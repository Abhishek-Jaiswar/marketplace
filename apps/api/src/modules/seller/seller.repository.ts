import {
  db,
  type BusinessType,
  type MediaType,
  type SellerDocumentType,
  type SellerStatus,
  type StorageProvider,
  type UserRole,
  type VerificationStatus,
} from "@workspace/db"

class SellerRepository {
  async findAllSellers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [totals, items] = await Promise.all([
      db.orm.public.Seller.aggregate((aggregate) => ({
        total: aggregate.count(),
      })),
      db.orm.public.Seller.orderBy((seller) => seller.createdAt.desc())
        .offset(skip)
        .limit(limit)
        .include("owner", (owner) =>
          owner.select(
            "id",
            "firstName",
            "lastName",
            "email",
            "status",
            "roles"
          )
        )
        .include("bankAccounts")
        .include("store", (store) => store.include("address"))
        .include("verification", (verification) =>
          verification.include("documents", (documents) =>
            documents.include("media")
          )
        )
        .all(),
    ])

    return {
      total: totals.total,
      page,
      limit,
      totalPages: Math.ceil(totals.total / limit),
      data: items,
    }
  }

  async findSellerById(sellerId: string) {
    return db.orm.public.Seller.include("owner", (owner) =>
      owner.select("id", "firstName", "lastName", "email", "status", "roles")
    )
      .include("bankAccounts")
      .include("store", (store) => store.include("address"))
      .include("verification", (verification) =>
        verification.include("documents", (documents) =>
          documents.include("media")
        )
      )
      .where({ id: sellerId })
      .first()
  }

  async findSellerIdentityByOwnerId(ownerUserId: string) {
    return db.orm.public.Seller.select("id", "status")
      .where({ ownerUserId })
      .first()
  }

  async findSellerByOwnerId(ownerUserId: string) {
    return db.orm.public.Seller.include("bankAccounts")
      .include("store", (store) => store.include("address"))
      .include("verification", (verification) =>
        verification.include("documents", (documents) =>
          documents.include("media")
        )
      )
      .where({ ownerUserId })
      .first()
  }

  async createSeller(
    ownerUserId: string,
    businessName: string,
    businessType: BusinessType,
    contactEmail?: string,
    contactPhone?: string,
    gstin?: string
  ) {
    return db.orm.public.Seller.include("owner", (owner) =>
      owner.select("id", "firstName", "lastName", "email", "status", "roles")
    )
      .include("bankAccounts")
      .include("store", (store) => store.include("address"))
      .include("verification", (verification) =>
        verification.include("documents", (documents) =>
          documents.include("media")
        )
      )
      .create({
        ownerUserId,
        businessName,
        businessType,
        gstin: gstin ?? null,
        contactEmail: contactEmail ?? null,
        contactPhone: contactPhone ?? null,
        status: "DRAFT",
      })
  }

  async updateSellerProfile(
    sellerId: string,
    data: {
      businessName?: string
      businessType?: BusinessType
      gstin?: string
      contactEmail?: string
      contactPhone?: string
      status?: SellerStatus
      approvedAt?: Date | string | null
    }
  ) {
    return db.orm.public.Seller.where({ id: sellerId }).update({
      ...(data.businessName !== undefined && {
        businessName: data.businessName,
      }),
      ...(data.businessType !== undefined && {
        businessType: data.businessType,
      }),
      ...(data.gstin !== undefined && { gstin: data.gstin ?? null }),
      ...(data.contactEmail !== undefined && {
        contactEmail: data.contactEmail ?? null,
      }),
      ...(data.contactPhone !== undefined && {
        contactPhone: data.contactPhone ?? null,
      }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.approvedAt !== undefined && {
        approvedAt:
          data.approvedAt instanceof Date
            ? data.approvedAt.toISOString()
            : data.approvedAt,
      }),
    })
  }

  async updateUserRoles(userId: string, roles: UserRole[]) {
    return db.orm.public.User.select(
      "id",
      "firstName",
      "lastName",
      "email",
      "status",
      "roles",
      "emailVerified"
    )
      .where({ id: userId })
      .update({
        roles,
      })
  }

  async upsertStore(
    sellerId: string,
    storeData: {
      displayName: string
      slug: string
      description?: string
      address?: {
        street1: string
        street2?: string
        landmark?: string
        city: string
        state: string
        postalCode: string
        country: string
        phoneNumber?: string
      }
    }
  ) {
    let addressId: string | undefined

    if (storeData.address) {
      const existingStore = await db.orm.public.Store.select("addressId")
        .where({ sellerId })
        .first()

      if (existingStore?.addressId) {
        const updatedAddress = await db.orm.public.Address.where({
          id: existingStore.addressId,
        }).update({
          street1: storeData.address.street1,
          street2: storeData.address.street2 ?? null,
          landmark: storeData.address.landmark ?? null,
          city: storeData.address.city,
          state: storeData.address.state,
          postalCode: storeData.address.postalCode,
          country: storeData.address.country,
          phoneNumber: storeData.address.phoneNumber ?? null,
        })

        addressId = updatedAddress?.id
      } else {
        const newAddress = await db.orm.public.Address.create({
          street1: storeData.address.street1,
          street2: storeData.address.street2 ?? null,
          landmark: storeData.address.landmark ?? null,
          city: storeData.address.city,
          state: storeData.address.state,
          postalCode: storeData.address.postalCode,
          country: storeData.address.country,
          phoneNumber: storeData.address.phoneNumber ?? null,
        })

        addressId = newAddress.id
      }
    }

    const finalSlug = storeData.slug || `store-${sellerId.substring(0, 6)}`

    return db.orm.public.Store.include("address").upsert({
      create: {
        sellerId,
        displayName: storeData.displayName,
        slug: finalSlug,
        description: storeData.description ?? null,
        addressId: addressId ?? null,
      },
      update: {
        displayName: storeData.displayName,
        slug: finalSlug,
        description: storeData.description ?? null,
        addressId: addressId !== undefined ? addressId : null,
      },
      conflictOn: { sellerId },
    })
  }

  async findStoreBySlug(slug: string) {
    return db.orm.public.Store.include("address")
      .include("seller", (seller) =>
        seller.select(
          "id",
          "businessName",
          "businessType",
          "contactEmail",
          "contactPhone",
          "status",
          "createdAt"
        )
      )
      .where({ slug })
      .first()
  }

  async addBankAccount(
    sellerId: string,
    bankData: {
      accountHolderName: string
      accountNumber: string
      ifscCode: string
      bankName: string
    }
  ) {
    const existing = await db.orm.public.BankAccount.where({
      sellerId,
      isPrimary: true,
    }).first()

    if (existing) {
      return db.orm.public.BankAccount.where({ id: existing.id }).update({
        accountHolderName: bankData.accountHolderName,
        accountNumber: bankData.accountNumber,
        ifscCode: bankData.ifscCode,
        bankName: bankData.bankName,
        status: "PENDING",
      })
    }

    await db.orm.public.BankAccount.where({ sellerId }).updateAll({
      isPrimary: false,
    })

    return db.orm.public.BankAccount.create({
      sellerId,
      accountHolderName: bankData.accountHolderName,
      accountNumber: bankData.accountNumber,
      ifscCode: bankData.ifscCode,
      bankName: bankData.bankName,
      isPrimary: true,
      status: "PENDING",
    })
  }

  async getOrCreateVerification(sellerId: string) {
    const existing = await db.orm.public.SellerVerification.include(
      "documents",
      (documents) => documents.include("media")
    )
      .where({ sellerId })
      .first()

    if (existing) {
      return existing
    }

    return db.orm.public.SellerVerification.include("documents", (documents) =>
      documents.include("media")
    ).create({
      sellerId,
      status: "PENDING",
    })
  }

  async updateVerificationStatus(
    sellerId: string,
    status: VerificationStatus,
    reviewedBy?: string,
    remarks?: string,
    stepData?: {
      businessStatus?: VerificationStatus
      businessRejectionReason?: string | null
      storeStatus?: VerificationStatus
      storeRejectionReason?: string | null
      bankStatus?: VerificationStatus
      bankRejectionReason?: string | null
      documentsStatus?: VerificationStatus
      documentsRejectionReason?: string | null
    }
  ) {
    const verification = await this.getOrCreateVerification(sellerId)

    return db.orm.public.SellerVerification.where({
      id: verification.id,
    }).update({
      status,
      reviewedBy: reviewedBy ?? null,
      remarks: remarks ?? null,
      ...(stepData ?? {}),
      ...(status === "UNDER_REVIEW" && {
        submittedAt: new Date().toISOString(),
      }),
      ...(["APPROVED", "REJECTED"].includes(status) && {
        reviewedAt: new Date().toISOString(),
      }),
    })
  }

  async createMedia(mediaData: {
    fileName: string
    originalName: string
    mimeType: string
    extension: string | null
    size: number
    mediaType: MediaType
    provider: StorageProvider
    storageKey: string
    url: string
    uploadedById?: string
  }) {
    return db.orm.public.Media.create({
      fileName: mediaData.fileName,
      originalName: mediaData.originalName,
      mimeType: mediaData.mimeType,
      extension: mediaData.extension,
      size: mediaData.size,
      mediaType: mediaData.mediaType,
      provider: mediaData.provider,
      storageKey: mediaData.storageKey,
      url: mediaData.url,
      uploadedById: mediaData.uploadedById ?? null,
    })
  }

  async addDocument(
    verificationId: string,
    mediaId: string,
    type: SellerDocumentType
  ) {
    const existing = await db.orm.public.SellerDocument.where({
      verificationId,
      type,
    }).first()

    if (existing) {
      await db.orm.public.SellerDocument.where({ id: existing.id }).delete()
    }

    return db.orm.public.SellerDocument.include("media").create({
      verificationId,
      mediaId,
      type,
      status: "PENDING",
    })
  }

  async registerSellerTransaction(payload: any, passwordHash: string) {
    return db.transaction(async (tx) => {
      const user = await tx.orm.public.User.select(
        "id",
        "firstName",
        "lastName",
        "email",
        "status",
        "roles",
        "createdAt"
      ).create({
        firstName: payload.firstName,
        lastName: payload.lastName || null,
        email: payload.email,
        roles: ["CUSTOMER", "SELLER"],
        status: "UNVERIFIED",
        credential: (credential) => credential.create({ passwordHash }),
        customer: (customer) => customer.create({}),
      })

      const seller = await tx.orm.public.Seller.include("owner", (owner) =>
        owner.select("id", "firstName", "lastName", "email", "status", "roles")
      )
        .include("bankAccounts")
        .include("store", (store) => store.include("address"))
        .include("verification", (verification) =>
          verification.include("documents", (documents) =>
            documents.include("media")
          )
        )
        .create({
          ownerUserId: user.id,
          businessName: payload.businessName || `${payload.firstName}'s Store`,
          businessType: payload.businessType || "INDIVIDUAL",
          contactEmail: payload.email,
          status: "DRAFT",
        })

      return { user, seller }
    })
  }
}

export const sellerRepository = new SellerRepository()
