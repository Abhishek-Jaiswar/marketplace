# Postman API Collection & Environment

This directory provides Postman v2.1.0 collection and environment files for testing the CBS Marketplace REST API.

## Files

- **[`cbs-marketplace.postman_collection.json`](./cbs-marketplace.postman_collection.json)**: Complete collection of requests organized by functional domains with automated test scripts for token capture.
- **[`cbs-marketplace.postman_environment.json`](./cbs-marketplace.postman_environment.json)**: Environment variable file configured for `http://localhost:4000`.

## Features

- **Automated Token Capture**:
  - `Login (Admin)` automatically stores `adminAccessToken` into the collection/environment variables.
  - `Login (Seller)` automatically stores `sellerAccessToken`.
  - `Login (Customer)` and `Refresh Token` automatically store `accessToken`.
- **Automatic ID Propagation**:
  - Creating a category captures `categoryId`.
  - Fetching seller profile captures `sellerId`.
  - Adding a customer address captures `addressId`.
- **Preconfigured Seed Credentials**:
  - **Admin**: `admin@cbsmarketplace.com` / `AdminPassword123!`
  - **Seller**: `seller@cbsmarketplace.com` / `SellerPassword123!`

## How to Import

1. Open Postman.
2. Click **Import** (top left).
3. Select or drag-and-drop both:
   - `cbs-marketplace.postman_collection.json`
   - `cbs-marketplace.postman_environment.json`
4. In the top-right environment selector, choose **CBS Marketplace (Local)**.
5. Run **Authentication & Users > 3. Login (Admin)** or **4. Login (Seller)** to authenticate.
