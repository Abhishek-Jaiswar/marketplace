import { db, type UserStatus } from "@workspace/db"
import { TRegister } from "./user.types.js"

class UserRepository {
  async findUserById(userId: string) {
    return await db.orm.public.User
      .select(
        "id",
        "firstName",
        "lastName",
        "email",
        "status",
        "roles",
        "emailVerified",
        "emailVerifiedAt",
      )
      .first({ id: userId })
  }

  async findUserByEmail(email: string) {
    return await db.orm.public.User
      .include("credential")
      .where({ email })
      .first()
  }

  async registerUser(payload: TRegister, passwordHash: string) {
    return await db.orm.public.User
      .select(
        "id",
        "firstName",
        "lastName",
        "email",
        "status",
        "roles",
        "emailVerified",
        "createdAt",
        "updatedAt",
      )
      .create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        credential: (credential) => credential.create({ passwordHash }),
        customer: (customer) => customer.create({}),
      })
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    return await db.orm.public.User
      .select(
        "id",
        "firstName",
        "lastName",
        "email",
        "status",
        "roles",
        "emailVerified",
        "updatedAt",
      )
      .where({ id: userId })
      .update({
        status,
        emailVerifiedAt: status === "ACTIVE" ? new Date().toISOString() : null,
        ...(status === "ACTIVE" && { emailVerified: true }),
      })
  }

  async getAllUsers() {
    return await db.orm.public.User
      .select(
        "id",
        "firstName",
        "lastName",
        "email",
        "status",
        "roles",
        "emailVerified",
        "createdAt",
        "updatedAt",
      )
      .orderBy((user) => user.createdAt.desc())
      .all()
  }

  async createSession(
    userId: string,
    refreshTokenHash: string,
    expiresAt: Date,
    userAgent?: string,
    ipAddress?: string,
  ) {
    return await db.orm.public.Session.create({
      userId,
      refreshTokenHash,
      expiresAt: expiresAt.toISOString(),
      userAgent: userAgent ?? null,
      ipAddress: ipAddress ?? null,
    })
  }

  async findSessionByHash(refreshTokenHash: string) {
    return await db.orm.public.Session
      .include("user", (user) =>
        user.select(
          "id",
          "email",
          "status",
          "roles",
          "emailVerified",
        ),
      )
      .where({ refreshTokenHash })
      .first()
  }

  async deleteSessionByHash(refreshTokenHash: string) {
    return await db.orm.public.Session
      .where({ refreshTokenHash })
      .delete()
      .catch(() => null)
  }

  async deleteAllSessionsForUser(userId: string) {
    return await db.orm.public.Session.where({ userId }).deleteAll()
  }

  async updateCredentialPassword(userId: string, passwordHash: string) {
    return await db.orm.public.Credential
      .where({ userId })
      .update({
        passwordHash,
        passwordChangedAt: new Date().toISOString(),
      })
  }
}

export const userRepository = new UserRepository()
