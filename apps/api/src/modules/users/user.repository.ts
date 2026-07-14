import { db, type UserStatus, type Prisma } from "@workspace/db"
import { TRegister } from "./user.types.js"

class UserRepository {
  async findUserById(userId: string) {
    return await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        roles: true,
        emailVerified: true,
        emailVerifiedAt: true,
      },
    })
  }

  async findUserByEmail(email: string) {
    return await db.user.findUnique({
      where: {
        email,
      },
      include: {
        credential: true,
      },
    })
  }

  async registerUser(payload: TRegister, passwordHash: string) {
    return await db.user.create({
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
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
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    const data: Prisma.UserUpdateInput = {
      status,
      emailVerifiedAt: status === "ACTIVE" ? new Date() : null,
    }
    if (status === "ACTIVE") {
      data.emailVerified = true
    }

    return await db.user.update({
      where: {
        id: userId,
      },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        roles: true,
        emailVerified: true,
        updatedAt: true,
      },
    })
  }

  async getAllUsers() {
    return await db.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        roles: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async createSession(
    userId: string,
    refreshTokenHash: string,
    expiresAt: Date,
    userAgent?: string,
    ipAddress?: string
  ) {
    return await db.session.create({
      data: {
        userId,
        refreshTokenHash,
        expiresAt,
        userAgent: userAgent ?? null,
        ipAddress: ipAddress ?? null,
      },
    })
  }

  async findSessionByHash(refreshTokenHash: string) {
    return await db.session.findUnique({
      where: {
        refreshTokenHash,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            status: true,
            roles: true,
            emailVerified: true,
          },
        },
      },
    })
  }

  async deleteSessionByHash(refreshTokenHash: string) {
    return await db.session.delete({
      where: {
        refreshTokenHash,
      },
    }).catch(() => null) // Ignore error if session already deleted
  }

  async deleteAllSessionsForUser(userId: string) {
    return await db.session.deleteMany({
      where: {
        userId,
      },
    })
  }

  async updateCredentialPassword(userId: string, passwordHash: string) {
    return await db.credential.update({
      where: {
        userId,
      },
      data: {
        passwordHash,
        passwordChangedAt: new Date(),
      },
    })
  }
}

export const userRepository = new UserRepository()
