export interface Address {
  id: string;
  street1: string;
  street2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string | null;
  customerId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  status: string;
  roles: string[];
  avatar?: string | null;
}

export interface Customer {
  id: string;
  userId: string;
  user?: User;
  phoneNumber?: string | null;
  defaultShippingAddressId?: string | null;
  defaultBillingAddressId?: string | null;
  defaultShippingAddress?: Address | null;
  defaultBillingAddress?: Address | null;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCustomerProfileRequest {
  phoneNumber?: string;
}

export interface CreateAddressRequest {
  street1: string;
  street2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

export type UpdateAddressRequest = Partial<CreateAddressRequest>;
