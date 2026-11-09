import { db } from "@workspace/db"
import {
  TCreateAddress,
  TUpdateAddress,
  TUpdateProfile,
} from "./customer.types.js"

class CustomerRepository {
  async findCustomerByUserId(userId: string) {
    return db.orm.public.Customer.include("user", (user) =>
      user.select(
        "id",
        "firstName",
        "lastName",
        "email",
        "status",
        "roles",
        "avatar"
      )
    )
      .include("defaultShippingAddress")
      .include("defaultBillingAddress")
      .include("addresses")
      .where({ userId })
      .first()
  }

  async updateCustomerProfile(userId: string, data: TUpdateProfile) {
    return db.orm.public.Customer.where({ userId }).update({
      ...(data.phoneNumber !== undefined && {
        phoneNumber: data.phoneNumber ?? null,
      }),
    })
  }

  async findAddressById(addressId: string) {
    return db.orm.public.Address.first({ id: addressId })
  }

  async createAddress(customerId: string, data: TCreateAddress) {
    return db.orm.public.Address.create({
      street1: data.street1,
      street2: data.street2 ?? null,
      landmark: data.landmark ?? null,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      phoneNumber: data.phoneNumber ?? null,
      customerId,
    })
  }

  async updateAddress(addressId: string, data: TUpdateAddress) {
    return db.orm.public.Address.where({ id: addressId }).update({
      ...(data.street1 !== undefined && { street1: data.street1 }),
      ...(data.street2 !== undefined && { street2: data.street2 ?? null }),
      ...(data.landmark !== undefined && { landmark: data.landmark ?? null }),
      ...(data.city !== undefined && { city: data.city }),
      ...(data.state !== undefined && { state: data.state }),
      ...(data.postalCode !== undefined && { postalCode: data.postalCode }),
      ...(data.country !== undefined && { country: data.country }),
      ...(data.phoneNumber !== undefined && {
        phoneNumber: data.phoneNumber ?? null,
      }),
    })
  }

  async deleteAddress(addressId: string) {
    return db.orm.public.Address.where({ id: addressId }).delete()
  }

  async setDefaultShippingAddress(userId: string, addressId: string | null) {
    return db.orm.public.Customer.where({ userId }).update({
      defaultShippingAddressId: addressId,
    })
  }

  async setDefaultBillingAddress(userId: string, addressId: string | null) {
    return db.orm.public.Customer.where({ userId }).update({
      defaultBillingAddressId: addressId,
    })
  }
}

export const customerRepository = new CustomerRepository()
