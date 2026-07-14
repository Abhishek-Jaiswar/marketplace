import { customerRepository } from "./customer.repository.js"
import { customerCache } from "./customer.cache.js"
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../../utils/errors/index.js"
import { TCreateAddress, TUpdateAddress, TUpdateProfile } from "./customer.types.js"

class CustomerService {
  async getCustomerProfile(userId: string) {
    return customerCache.getOrSetCustomerDetails(userId, async () => {
      const customer = await customerRepository.findCustomerByUserId(userId)
      if (!customer) {
        throw new NotFoundError("Customer profile not found")
      }
      return customer
    })
  }

  async updateCustomerProfile(userId: string, data: TUpdateProfile) {
    // Verify customer exists
    const customer = await customerRepository.findCustomerByUserId(userId)
    if (!customer) {
      throw new NotFoundError("Customer profile not found")
    }

    const updatedCustomer = await customerRepository.updateCustomerProfile(userId, data)
    await customerCache.invalidateCustomer(userId)
    return updatedCustomer
  }

  async createCustomerAddress(userId: string, data: TCreateAddress) {
    const customer = await customerRepository.findCustomerByUserId(userId)
    if (!customer) {
      throw new NotFoundError("Customer profile not found")
    }

    const address = await customerRepository.createAddress(customer.id, data)
    await customerCache.invalidateCustomer(userId)
    return address
  }

  async updateCustomerAddress(userId: string, addressId: string, data: TUpdateAddress) {
    const customer = await customerRepository.findCustomerByUserId(userId)
    if (!customer) {
      throw new NotFoundError("Customer profile not found")
    }

    const address = await customerRepository.findAddressById(addressId)
    if (!address) {
      throw new NotFoundError("Address not found")
    }

    if (address.customerId !== customer.id) {
      throw new ForbiddenError("You are not authorized to modify this address")
    }

    const updatedAddress = await customerRepository.updateAddress(addressId, data)
    await customerCache.invalidateCustomer(userId)
    return updatedAddress
  }

  async deleteCustomerAddress(userId: string, addressId: string) {
    const customer = await customerRepository.findCustomerByUserId(userId)
    if (!customer) {
      throw new NotFoundError("Customer profile not found")
    }

    const address = await customerRepository.findAddressById(addressId)
    if (!address) {
      throw new NotFoundError("Address not found")
    }

    if (address.customerId !== customer.id) {
      throw new ForbiddenError("You are not authorized to delete this address")
    }

    await customerRepository.deleteAddress(addressId)
    await customerCache.invalidateCustomer(userId)
    return { message: "Address deleted successfully" }
  }

  async setDefaultShippingAddress(userId: string, addressId: string) {
    const customer = await customerRepository.findCustomerByUserId(userId)
    if (!customer) {
      throw new NotFoundError("Customer profile not found")
    }

    const address = await customerRepository.findAddressById(addressId)
    if (!address) {
      throw new NotFoundError("Address not found")
    }

    if (address.customerId !== customer.id) {
      throw new ForbiddenError("You are not authorized to use this address")
    }

    const updatedCustomer = await customerRepository.setDefaultShippingAddress(userId, addressId)
    await customerCache.invalidateCustomer(userId)
    return updatedCustomer
  }

  async setDefaultBillingAddress(userId: string, addressId: string) {
    const customer = await customerRepository.findCustomerByUserId(userId)
    if (!customer) {
      throw new NotFoundError("Customer profile not found")
    }

    const address = await customerRepository.findAddressById(addressId)
    if (!address) {
      throw new NotFoundError("Address not found")
    }

    if (address.customerId !== customer.id) {
      throw new ForbiddenError("You are not authorized to use this address")
    }

    const updatedCustomer = await customerRepository.setDefaultBillingAddress(userId, addressId)
    await customerCache.invalidateCustomer(userId)
    return updatedCustomer
  }
}

export const customerService = new CustomerService()
