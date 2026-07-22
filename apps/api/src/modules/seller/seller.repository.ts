import {
  db,
  type SellerStatus,
  type BusinessType,
  type VerificationStatus,
  type SellerDocumentType,
  type MediaType,
  type StorageProvider,
} from "@workspace/db"

class SellerRepository {
  async findAllSellers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const [total, items] = await Promise.all([
      db.seller.count(),
      db.seller.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              status: true,
              roles: true,
            },
          },
          bankAccounts: true,
          store: {
            include: {
              address: true,
            },
          },
          verification: {
            include: {
              documents: {
                include: {
                  media: true,
                },
              },
            },
          },
        },
      }),
    ])

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: items,
    }
  }

  async findSellerById(sellerId: string) {
    return db.seller.findUnique({
      where: {
        id: sellerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
            roles: true,
          },
        },
        bankAccounts: true,
        store: {
          include: {
            address: true,
          },
        },
        verification: {
          include: {
            documents: {
              include: {
                media: true,
              },
            },
          },
        },
      },
    })
  }

  async findSellerByOwnerId(ownerUserId: string) {
    return db.seller.findUnique({
      where: {
        ownerUserId,
      },
      include: {
        bankAccounts: true,
        store: {
          include: {
            address: true,
          },
        },
        verification: {
          include: {
            documents: {
              include: {
                media: true,
              },
            },
          },
        },
      },
    })
  }

  async createSeller(
    ownerUserId: string,
    businessName: string,
    businessType: BusinessType,
    contactEmail?: string,
    contactPhone?: string,
    gstin?: string
  ) {
    return db.seller.create({
      data: {
        ownerUserId,
        businessName,
        businessType,
        gstin: gstin ?? null,
        contactEmail: contactEmail ?? null,
        contactPhone: contactPhone ?? null,
        status: "DRAFT",
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
            roles: true,
          },
        },
        bankAccounts: true,
        store: {
          include: {
            address: true,
          },
        },
        verification: {
          include: {
            documents: {
              include: {
                media: true,
              },
            },
          },
        },
      },
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
      approvedAt?: Date | null
    }
  ) {
    const updateData: any = {}
    if (data.businessName !== undefined) updateData.businessName = data.businessName
    if (data.businessType !== undefined) updateData.businessType = data.businessType
    if (data.gstin !== undefined) updateData.gstin = data.gstin ?? null
    if (data.contactEmail !== undefined) updateData.contactEmail = data.contactEmail ?? null
    if (data.contactPhone !== undefined) updateData.contactPhone = data.contactPhone ?? null
    if (data.status !== undefined) updateData.status = data.status
    if (data.approvedAt !== undefined) updateData.approvedAt = data.approvedAt

    return db.seller.update({
      where: { id: sellerId },
      data: updateData,
    })
  }

  async updateUserRoles(userId: string, roles: any[]) {
    return db.user.update({
      where: { id: userId },
      data: {
        roles,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        roles: true,
        emailVerified: true,
      },
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
    // 1. Handle Address first if provided
    let addressId: string | undefined

    if (storeData.address) {
      const existingStore = await db.store.findUnique({
        where: { sellerId },
        select: { addressId: true },
      })

      if (existingStore?.addressId) {
        const updatedAddress = await db.address.update({
          where: { id: existingStore.addressId },
          data: {
            street1: storeData.address.street1,
            street2: storeData.address.street2 ?? null,
            landmark: storeData.address.landmark ?? null,
            city: storeData.address.city,
            state: storeData.address.state,
            postalCode: storeData.address.postalCode,
            country: storeData.address.country,
            phoneNumber: storeData.address.phoneNumber ?? null,
          },
        })
        addressId = updatedAddress.id
      } else {
        const newAddress = await db.address.create({
          data: {
            street1: storeData.address.street1,
            street2: storeData.address.street2 ?? null,
            landmark: storeData.address.landmark ?? null,
            city: storeData.address.city,
            state: storeData.address.state,
            postalCode: storeData.address.postalCode,
            country: storeData.address.country,
            phoneNumber: storeData.address.phoneNumber ?? null,
          },
        })
        addressId = newAddress.id
      }
    }

    // 2. Upsert Store
    return db.store.upsert({
      where: { sellerId },
      create: {
        sellerId,
        displayName: storeData.displayName,
        slug: storeData.slug,
        description: storeData.description ?? null,
        addressId: addressId ?? null,
      },
      update: {
        displayName: storeData.displayName,
        slug: storeData.slug,
        description: storeData.description ?? null,
        addressId: addressId !== undefined ? addressId : null,
      },
      include: {
        address: true,
      },
    })
  }

  async findStoreBySlug(slug: string) {
    return db.store.findUnique({
      where: { slug },
    })
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
    // Disable primary flag on any existing bank accounts if we set this one
    await db.bankAccount.updateMany({
      where: { sellerId },
      data: { isPrimary: false },
    })

    return db.bankAccount.create({
      data: {
        sellerId,
        accountHolderName: bankData.accountHolderName,
        accountNumber: bankData.accountNumber,
        ifscCode: bankData.ifscCode,
        bankName: bankData.bankName,
        isPrimary: true,
        status: "PENDING",
      },
    })
  }

  async getOrCreateVerification(sellerId: string) {
    const existing = await db.sellerVerification.findUnique({
      where: { sellerId },
      include: {
        documents: {
          include: {
            media: true,
          },
        },
      },
    })

    if (existing) {
      return existing
    }

    return db.sellerVerification.create({
      data: {
        sellerId,
        status: "PENDING",
      },
      include: {
        documents: {
          include: {
            media: true,
          },
        },
      },
    })
  }

  async updateVerificationStatus(
    sellerId: string,
    status: VerificationStatus,
    reviewedBy?: string,
    remarks?: string
  ) {
    const verification = await this.getOrCreateVerification(sellerId)

    const updateData: any = {
      status,
      reviewedBy: reviewedBy ?? null,
      remarks: remarks ?? null,
    }
    if (status === "UNDER_REVIEW") {
      updateData.submittedAt = new Date()
    }
    if (["APPROVED", "REJECTED"].includes(status)) {
      updateData.reviewedAt = new Date()
    }

    return db.sellerVerification.update({
      where: { id: verification.id },
      data: updateData,
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
    return db.media.create({
      data: {
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
      },
    })
  }

  async addDocument(
    verificationId: string,
    mediaId: string,
    type: SellerDocumentType
  ) {
    // If a document of the same type already exists for this verification, delete it first
    const existing = await db.sellerDocument.findFirst({
      where: {
        verificationId,
        type,
      },
    })

    if (existing) {
      await db.sellerDocument.delete({
        where: { id: existing.id },
      })
    }

    return db.sellerDocument.create({
      data: {
        verificationId,
        mediaId,
        type,
        status: "PENDING",
      },
      include: {
        media: true,
      },
    })
  }

  async registerSellerTransaction(payload: any, passwordHash: string) {
    return db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: payload.firstName,
          lastName: payload.lastName || null,
          email: payload.email,
          roles: ["CUSTOMER", "SELLER"],
          status: "UNVERIFIED",
          credential: {
            create: {
              passwordHash,
            },
          },
          customer: {
            create: {},
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          status: true,
          roles: true,
          createdAt: true,
        },
      })

      const seller = await tx.seller.create({
        data: {
          ownerUserId: user.id,
          businessName: payload.businessName,
          businessType: payload.businessType,
          contactEmail: payload.email,
          status: "DRAFT",
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              status: true,
              roles: true,
            },
          },
          bankAccounts: true,
          store: {
            include: {
              address: true,
            },
          },
          verification: {
            include: {
              documents: {
                include: {
                  media: true,
                },
              },
            },
          },
        },
      })

      return { user, seller }
    })
  }
}

export const sellerRepository = new SellerRepository()
