import { randomUUID } from "node:crypto"

import { db } from "@workspace/db"
import request, { type Response } from "supertest"
import { beforeAll, describe, expect, it, vi } from "vitest"

import { createApp } from "../app.js"
import { mailService } from "../services/mail/mail.service.js"

vi.mock("../lib/redis.js", () => ({ redis: { status: "end" } }))
vi.mock("../services/mail/mail.service.js", () => ({
  mailService: {
    sendOtpEmail: vi.fn(async () => undefined),
    sendResetPasswordOtp: vi.fn(async () => undefined),
  },
}))
vi.mock("../services/storage/upload.service.js", () => ({
  uploadService: {
    upload: vi.fn(async () => ({
      url: "https://example.com/document.pdf",
      storageKey: `document-${Math.random()}`,
    })),
  },
}))

const app = createApp()
const PASSWORD = "Password123!"
const NEW_PASSWORD = "NewPassword123!"
const unique = () => randomUUID().slice(0, 8)
const auth = (token: string) => ({ Authorization: `Bearer ${token}` })

function ok(response: Response, status = 200) {
  expect(
    response.status,
    `${response.request.method} ${response.request.url}: ${JSON.stringify(response.body)}`
  ).toBe(status)
  return response.body
}

function lastOtp(sender: "sendOtpEmail" | "sendResetPasswordOtp"): string {
  const call = vi.mocked(mailService[sender]).mock.lastCall as unknown as [
    string,
    string,
  ]
  return call[1]
}

async function registeredUser(email: string) {
  ok(
    await request(app).post("/api/users/register").send({
      firstName: "Test",
      lastName: "User",
      email,
      password: PASSWORD,
    }),
    201
  )
  ok(
    await request(app)
      .post("/api/users/verify")
      .send({ email, otp: lastOtp("sendOtpEmail") })
  )
}

async function login(email: string, password = PASSWORD): Promise<string> {
  const body = ok(
    await request(app).post("/api/users/login").send({ email, password })
  )
  return body.accessToken
}

async function createAdmin(): Promise<string> {
  const email = `admin-${unique()}@example.com`
  await registeredUser(email)
  await db.orm.public.User.where({ email }).update({ roles: ["ADMIN"] })
  return await login(email)
}

const ADDRESS = {
  street1: "12 MG Road",
  city: "Pune",
  state: "Maharashtra",
  postalCode: "411001",
  country: "India",
}

describe("account", () => {
  const email = `shopper-${unique()}@example.com`

  it("registers, verifies, signs in, refreshes and signs out", async () => {
    await registeredUser(email)

    const agent = request.agent(app)
    const session = ok(
      await agent.post("/api/users/login").send({ email, password: PASSWORD })
    )
    expect(session.accessToken).toEqual(expect.any(String))
    expect(session.user.email).toBe(email)

    const me = ok(
      await request(app).get("/api/users/me").set(auth(session.accessToken))
    )
    expect(me.user.email).toBe(email)

    const refreshed = ok(await agent.post("/api/users/refresh"))
    expect(refreshed.accessToken).toEqual(expect.any(String))

    ok(await agent.post("/api/users/logout"))
    expect((await agent.post("/api/users/refresh")).status).toBe(401)
  })

  it("rejects a wrong password", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email, password: "WrongPassword1!" })
    expect(response.status).toBe(401)
    expect(response.body.error.message).toEqual(expect.any(String))
  })

  it("resends a code to an unverified account", async () => {
    const pending = `pending-${unique()}@example.com`
    ok(
      await request(app).post("/api/users/register").send({
        firstName: "Pending",
        lastName: "User",
        email: pending,
        password: PASSWORD,
      }),
      201
    )
    ok(
      await request(app).post("/api/users/resend-otp").send({ email: pending })
    )
  })

  it("resets a forgotten password", async () => {
    ok(await request(app).post("/api/users/forgot-password").send({ email }))
    ok(
      await request(app)
        .post("/api/users/reset-password")
        .send({
          email,
          otp: lastOtp("sendResetPasswordOtp"),
          newPassword: NEW_PASSWORD,
        })
    )
    expect(await login(email, NEW_PASSWORD)).toEqual(expect.any(String))
  })

  it("lists users for admins only", async () => {
    const admin = await createAdmin()
    const shopper = await login(email, NEW_PASSWORD)

    ok(await request(app).get("/api/users").set(auth(admin)))
    expect(
      (await request(app).get("/api/users").set(auth(shopper))).status
    ).toBe(403)
  })
})

describe("customer", () => {
  it("manages a profile and addresses", async () => {
    const email = `customer-${unique()}@example.com`
    await registeredUser(email)
    const token = await login(email)

    const profile = ok(
      await request(app).get("/api/customers/profile").set(auth(token))
    )
    expect(profile.customer).toBeDefined()

    ok(
      await request(app)
        .patch("/api/customers/profile")
        .set(auth(token))
        .send({ phoneNumber: "9876543210" })
    )

    const created = ok(
      await request(app)
        .post("/api/customers/addresses")
        .set(auth(token))
        .send(ADDRESS),
      201
    )
    const addressId = created.address.id

    const updated = ok(
      await request(app)
        .put(`/api/customers/addresses/${addressId}`)
        .set(auth(token))
        .send({ city: "Mumbai" })
    )
    expect(updated.address.city).toBe("Mumbai")

    for (const kind of ["default-shipping", "default-billing"]) {
      ok(
        await request(app)
          .patch(`/api/customers/addresses/${addressId}/${kind}`)
          .set(auth(token))
      )
    }

    ok(
      await request(app)
        .delete(`/api/customers/addresses/${addressId}`)
        .set(auth(token))
    )
  })
})

describe("categories", () => {
  it("serves the public tree and supports admin changes", async () => {
    const admin = await createAdmin()
    const slug = `category-${unique()}`

    const created = ok(
      await request(app)
        .post("/api/categories")
        .set(auth(admin))
        .send({
          name: `Category ${slug}`,
          slug,
          image: "https://example.com/category.png",
          storageKey: "category-key",
          altText: "Category",
        }),
      201
    )
    const id = created.data.id

    const tree = ok(await request(app).get("/api/categories/tree"))
    expect(tree.data.map((node: { id: string }) => node.id)).toContain(id)

    ok(await request(app).get("/api/categories?limit=5"))
    expect(ok(await request(app).get(`/api/categories/${id}`)).data.id).toBe(id)
    expect(
      ok(await request(app).get(`/api/categories/slug/${slug}`)).data.id
    ).toBe(id)

    ok(
      await request(app)
        .put(`/api/categories/${id}`)
        .set(auth(admin))
        .send({ name: "Renamed category" })
    )
    ok(
      await request(app)
        .patch(`/api/categories/${id}/status`)
        .set(auth(admin))
        .send({ isActive: false })
    )
    ok(await request(app).delete(`/api/categories/${id}`).set(auth(admin)))
  })
})

describe("selling, from onboarding to a product page", () => {
  const email = `seller-${unique()}@example.com`
  const storeSlug = `store-${unique()}`
  let admin = ""
  let seller = ""
  let sellerId = ""
  let categoryId = ""

  beforeAll(async () => {
    admin = await createAdmin()
    const category = await db.orm.public.Category.create({
      slug: `category-${unique()}`,
      name: "Headphones",
      image: "https://example.com/category.png",
      storageKey: "category-key",
      altText: "Headphones",
    })
    categoryId = category.id
  })

  it("onboards a seller through admin approval", async () => {
    const registered = ok(
      await request(app).post("/api/sellers/register").send({
        firstName: "Seller",
        email,
        password: PASSWORD,
        businessName: "Apex Tech Gear",
        businessType: "PRIVATE_LIMITED",
      }),
      201
    )
    expect(registered.seller.id).toEqual(expect.any(String))
    ok(
      await request(app)
        .post("/api/users/verify")
        .send({ email, otp: lastOtp("sendOtpEmail") })
    )
    seller = await login(email)

    ok(
      await request(app)
        .get("/api/sellers/verify-gstin?gstin=27AAPFU0939F1ZV")
        .set(auth(seller))
    )

    const onboarded = ok(
      await request(app)
        .post("/api/sellers/onboard")
        .set(auth(seller))
        .send({
          businessName: "Apex Tech Gear",
          businessType: "PRIVATE_LIMITED",
          gstin: `27${unique()
            .toUpperCase()
            .replace(/[^A-Z]/g, "A")
            .padEnd(5, "A")
            .slice(0, 5)}0939F1ZV`,
        })
    )
    seller = onboarded.accessToken ?? seller

    const me = ok(await request(app).get("/api/sellers/me").set(auth(seller)))
    sellerId = me.seller.id

    ok(
      await request(app).put("/api/sellers/profile").set(auth(seller)).send({
        businessName: "Apex Tech Gear Pvt Ltd",
        businessType: "PRIVATE_LIMITED",
      })
    )
    ok(
      await request(app).put("/api/sellers/store").set(auth(seller)).send({
        displayName: "Apex Tech Gear",
        slug: storeSlug,
        address: ADDRESS,
      })
    )
    ok(
      await request(app)
        .post("/api/sellers/bank-accounts")
        .set(auth(seller))
        .send({
          accountHolderName: "Apex Tech Gear",
          accountNumber: "1234567890",
          ifscCode: "hdfc0000001",
          bankName: "HDFC Bank",
        }),
      201
    )

    for (const type of ["GST_CERTIFICATE", "PAN_CARD", "CANCELLED_CHEQUE"]) {
      ok(
        await request(app)
          .post("/api/sellers/documents")
          .set(auth(seller))
          .field("type", type)
          .attach("file", Buffer.from("%PDF-1.4 test"), {
            filename: "document.pdf",
            contentType: "application/pdf",
          }),
        201
      )
    }

    ok(await request(app).post("/api/sellers/submit").set(auth(seller)))

    const queue = ok(
      await request(app).get("/api/sellers?limit=100").set(auth(admin))
    )
    expect(JSON.stringify(queue)).toContain(sellerId)

    const approved = ok(
      await request(app)
        .post(`/api/sellers/${sellerId}/verify`)
        .set(auth(admin))
        .send({ status: "APPROVED" })
    )
    expect(approved.seller.status).toBe("APPROVED")

    const publicStore = ok(
      await request(app).get(`/api/sellers/store-public/${storeSlug}`)
    )
    expect(publicStore.store.slug).toBe(storeSlug)

    seller = await login(email)
  })

  it("takes a product from draft to a live product page", async () => {
    const brandName = `Brand ${unique()}`
    const brand = ok(
      await request(app)
        .post("/api/catalog/brands")
        .set(auth(admin))
        .send({ name: brandName }),
      201
    ).data
    ok(await request(app).get("/api/catalog/brands?limit=5"))
    ok(await request(app).get(`/api/catalog/brands/${brand.id}`))
    ok(await request(app).get(`/api/catalog/brands/slug/${brand.slug}`))
    ok(
      await request(app)
        .put(`/api/catalog/brands/${brand.id}`)
        .set(auth(admin))
        .send({ isVerified: true })
    )

    const product = ok(
      await request(app)
        .post("/api/catalog/products")
        .set(auth(seller))
        .send({
          title: `Wireless headphones ${unique()}`,
          description: "Noise-cancelling headphones with a 40 hour battery.",
          highlights: ["40 hour battery"],
          categoryId,
          brandId: brand.id,
        }),
      201
    ).data

    ok(
      await request(app)
        .put(`/api/catalog/products/${product.id}`)
        .set(auth(seller))
        .send({ highlights: ["40 hour battery", "Bluetooth 5.3"] })
    )

    const variant = ok(
      await request(app)
        .post(`/api/catalog/products/${product.id}/variants`)
        .set(auth(seller))
        .send({ sku: `SKU-${unique()}`, attributes: { colour: "Black" } }),
      201
    ).data
    ok(
      await request(app)
        .put(`/api/catalog/variants/${variant.id}`)
        .set(auth(seller))
        .send({ weightGrams: 250 })
    )

    const media = await db.orm.public.Media.create({
      fileName: "photo.jpg",
      originalName: "photo.jpg",
      mimeType: "image/jpeg",
      size: 10,
      mediaType: "IMAGE",
      provider: "CLOUDINARY",
      storageKey: `photo-${unique()}`,
      url: "https://example.com/photo.jpg",
    })
    const attached = ok(
      await request(app)
        .post(`/api/catalog/products/${product.id}/media`)
        .set(auth(seller))
        .send({ mediaId: media.id, isPrimary: true }),
      201
    ).data

    const reviewed = ok(
      await request(app)
        .patch(`/api/catalog/products/${product.id}/review`)
        .set(auth(admin))
        .send({ status: "APPROVED" })
    ).data
    expect(reviewed.status).toBe("APPROVED")

    const listing = ok(
      await request(app)
        .post("/api/catalog/listings")
        .set(auth(seller))
        .send({
          variantId: variant.id,
          sellerSku: `APEX-${unique()}`,
          mrpPrice: 15999,
          sellingPrice: 12499,
        }),
      201
    ).data
    ok(
      await request(app)
        .put(`/api/catalog/listings/${listing.id}`)
        .set(auth(seller))
        .send({ sellingPrice: 11999 })
    )
    ok(await request(app).get(`/api/catalog/listings?variantId=${variant.id}`))

    const list = ok(
      await request(app).get(
        `/api/catalog/products?status=APPROVED&categoryId=${categoryId}`
      )
    )
    expect(list.items[0].id).toBe(product.id)
    expect(list.items[0].variants[0].listings[0].sellingPrice).toBe(11999)
    expect(list.items[0].media[0].media.url).toBe(media.url)

    const sellersProducts = ok(
      await request(app).get(
        `/api/catalog/products?status=APPROVED&sellerId=${sellerId}`
      )
    )
    expect(sellersProducts.items.map((p: { id: string }) => p.id)).toEqual([
      product.id,
    ])
    expect(
      ok(
        await request(app).get(
          "/api/catalog/products?status=APPROVED&sellerId=nobody"
        )
      ).total
    ).toBe(0)
    ok(await request(app).get(`/api/catalog/products/${product.id}`))
    ok(await request(app).get(`/api/catalog/products/slug/${product.slug}`))

    const page = ok(await request(app).get(`/api/catalog/pdp/${product.slug}`))
    expect(JSON.stringify(page)).toContain(listing.id)

    ok(
      await request(app)
        .delete(`/api/catalog/media/${attached.id}`)
        .set(auth(seller))
    )
  })
})
