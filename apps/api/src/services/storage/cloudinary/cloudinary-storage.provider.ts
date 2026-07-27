
import { logger } from "@workspace/logger";
import cloudinary from "../../../lib/cloudinary.js";
import { Env } from "../../../config/env.config.js";
import type { IStorageProvider } from "../storage-provider.interface.js";
import type { StorageAsset } from "../storage.types.js";

export class CloudinaryStorageProvider implements IStorageProvider {
  async upload(buffer: Buffer, folder: string): Promise<StorageAsset> {
    if (!Env.CLOUDINARY_CLOUD_NAME || Env.CLOUDINARY_CLOUD_NAME.includes("your-") || Env.CLOUDINARY_CLOUD_NAME.includes("mock")) {
      const base64 = buffer.toString("base64");
      return {
        url: `data:image/png;base64,${base64}`,
        storageKey: `local_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      };
    }

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            logger.warn("Cloudinary upload failed, using local base64 fallback", error);
            const base64 = buffer.toString("base64");
            return resolve({
              url: `data:image/png;base64,${base64}`,
              storageKey: `fallback_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            });
          }

          resolve({
            url: result.secure_url,
            storageKey: result.public_id,
          });
        }
      );

      uploadStream.end(buffer);
    });
  }

  async delete(storageKey: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(storageKey);

      return result.result === "ok" || result.result === "not found";
    } catch (error) {
      logger.error("Cloudinary delete failed", error);

      return false;
    }
  }

  async deleteMany(storageKeys: string[]): Promise<boolean> {
    try {
      if (!storageKeys.length) {
        return true;
      }

      await cloudinary.api.delete_resources(storageKeys);

      return true;
    } catch (error) {
      logger.error("Cloudinary bulk delete failed", error);

      return false;
    }
  }
}
