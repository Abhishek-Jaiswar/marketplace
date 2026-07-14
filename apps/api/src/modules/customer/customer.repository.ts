import { db } from "@workspace/db"
import { TCreateAddress, TUpdateAddress, TUpdateProfile } from "./customer.types.js"

class CustomerRepository {
  async findCustomerByUserId(userId: string) {
    return db.customer.findUnique({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
            roles: true,
            avatar: true,
          },
        },
        defaultShippingAddress: true,
        defaultBillingAddress: true,
        addresses: true,
      },
    })
  }

  async updateCustomerProfile(userId: string, data: TUpdateProfile) {
    const updateData: any = {}
    if (data.phoneNumber !== undefined) {
      updateData.phoneNumber = data.phoneNumber ?? null
    }

    return db.customer.update({
      where: {
        userId,
      },
      data: updateData,
    })
  }

  async findAddressById(addressId: string) {
    return db.address.findUnique({
      where: {
        id: addressId,
      },
    })
  }

  async createAddress(customerId: string, data: TCreateAddress) {
    return db.address.create({
      data: {
        street1: data.street1,
        street2: data.street2 ?? null,
        landmark: data.landmark ?? null,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phoneNumber: data.phoneNumber ?? null,
        customerId,
      },
    })
  }

  async updateAddress(addressId: string, data: TUpdateAddress) {
    const updateData: any = {}
    if (data.street1 !== undefined) updateData.street1 = data.street1
    if (data.street2 !== undefined) updateData.street2 = data.street2 ?? null
    if (data.landmark !== undefined) updateData.landmark = data.landmark ?? null
    if (data.city !== undefined) updateData.city = data.city
    if (data.state !== undefined) updateData.state = data.state
    if (data.postalCode !== undefined) updateData.postalCode = data.postalCode
    if (data.country !== undefined) updateData.country = data.country
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber ?? null

    return db.address.update({
      where: {
        id: addressId,
      },
      data: updateData,
    })
  }

  async deleteAddress(addressId: string) {
    return db.address.delete({
      where: {
        id: addressId,
      },
    })
  }

  async setDefaultShippingAddress(userId: string, addressId: string | null) {
    return db.customer.update({
      where: {
        userId,
      },
      data: {
        defaultShippingAddressId: addressId,
      },
    })
  }

  async setDefaultBillingAddress(userId: string, addressId: string | null) {
    return db.customer.update({
      where: {
        userId,
      },
      data: {
        defaultBillingAddressId: addressId,
      },
    })
  }
}

export const customerRepository = new CustomerRepository()
