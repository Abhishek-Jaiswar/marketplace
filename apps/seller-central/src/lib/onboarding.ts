export interface SellerLike {
  id?: string;
  status?: string;
  gstin?: string | null;
  bankAccounts?: any[];
  store?: {
    addressId?: string | null;
    address?: any;
  } | null;
}

/**
 * Determines whether a seller needs to be redirected to a pending onboarding step.
 * Returns `null` if the seller is allowed post-onboarding access (i.e. APPROVED, UNDER_REVIEW, or REJECTED).
 * Otherwise returns the redirect path string (e.g. "/onboard?step=1", "/onboard?step=2", or "/store-setup").
 */
export function getSellerOnboardingRedirect(
  seller?: SellerLike | null
): string | null {
  if (!seller) {
    return "/onboard?step=1";
  }

  // Submitted / Active statuses: onboarding phase completed
  if (
    seller.status === "APPROVED" ||
    seller.status === "UNDER_REVIEW" ||
    seller.status === "REJECTED"
  ) {
    return null;
  }

  // Incomplete status: DRAFT or DOCUMENTS_PENDING
  const hasBusinessDetails = Boolean(seller.gstin);
  const hasBankAccounts = Boolean(
    seller.bankAccounts && seller.bankAccounts.length > 0
  );

  if (hasBusinessDetails && hasBankAccounts) {
    return "/store-setup";
  } else if (hasBusinessDetails) {
    return "/onboard?step=2";
  } else {
    return "/onboard?step=1";
  }
}
