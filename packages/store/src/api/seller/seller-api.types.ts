export type BusinessType =
  | "INDIVIDUAL"
  | "SOLE_PROPRIETORSHIP"
  | "PARTNERSHIP"
  | "LLP"
  | "PRIVATE_LIMITED"
  | "PUBLIC_LIMITED";

export type SellerStatus =
  | "DRAFT"
  | "DOCUMENTS_PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export type VerificationStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export type SellerDocumentType =
  | "GST_CERTIFICATE"
  | "PAN_CARD"
  | "BUSINESS_LICENSE"
  | "ADDRESS_PROOF"
  | "CANCELLED_CHEQUE"
  | "OTHER";

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
}

export interface Store {
  id: string;
  sellerId: string;
  displayName: string;
  slug: string;
  logoMediaId?: string | null;
  bannerMediaId?: string | null;
  addressId?: string | null;
  description?: string | null;
  address?: Address | null;
}

export interface BankAccount {
  id: string;
  sellerId: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  isPrimary: boolean;
  status: VerificationStatus;
  verifiedAt?: string | null;
}

export interface Media {
  id: string;
  fileName: string;
  mimeType: string;
  url: string;
}

export interface SellerDocument {
  id: string;
  verificationId: string;
  mediaId: string;
  type: SellerDocumentType;
  status: VerificationStatus;
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  media: Media;
}

export interface SellerVerification {
  id: string;
  sellerId: string;
  status: VerificationStatus;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  remarks?: string | null;
  documents: SellerDocument[];
}

export interface Seller {
  id: string;
  ownerUserId: string;
  businessName: string;
  businessType: BusinessType;
  contactEmail?: string | null;
  contactPhone?: string | null;
  gstin?: string | null;
  status: SellerStatus;
  approvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  store?: Store | null;
  bankAccounts?: BankAccount[];
  verification?: SellerVerification | null;
}

export interface RegisterSellerRequest {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  businessName: string;
  businessType: BusinessType;
}

export interface OnboardRequest {
  businessName: string;
  businessType: BusinessType;
  contactPhone?: string;
  contactEmail?: string;
  gstin?: string;
}

export interface UpdateStoreRequest {
  displayName: string;
  slug: string;
  description?: string;
  address: {
    street1: string;
    street2?: string;
    landmark?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber?: string;
  };
}

export interface BankAccountRequest {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface VerifySellerRequest {
  status: "APPROVED" | "REJECTED";
  remarks?: string;
}

export interface PaginatedSellersResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Seller[];
}
