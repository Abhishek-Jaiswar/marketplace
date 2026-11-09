#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3683dd933b50546bcd1b0408037c5f43cf4c4a8f2f8004d316b6b6f0de322141/contract';
import endContract from '../../snapshots/3683dd933b50546bcd1b0408037c5f43cf4c4a8f2f8004d316b6b6f0de322141/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/d92976cc8f675e499fb94cc2a2a826099a36dd356e8629c722fae9a6dea91862/contract';
import startContract from '../../snapshots/d92976cc8f675e499fb94cc2a2a826099a36dd356e8629c722fae9a6dea91862/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'AuditLog',
        columns: [
          col('action', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('actorType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('actorUserId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('after', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('before', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('entityId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('entityType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('ipAddress', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'AuditLog_actorType_check_47b31a02',
            sql`"actorType" IN ('CUSTOMER', 'SELLER', 'ADMIN', 'SYSTEM')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Cart',
        columns: [
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('customerId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('expiresAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('guestToken', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'CartItem',
        columns: [
          col('cartId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quantity', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sellerListingId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('unitPriceAtAdd', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('cart_item_quantity_positive_fc510296', sql`"quantity" > 0`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'CategoryAttribute',
        columns: [
          col('categoryId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isFilterable', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('isRequired', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('isVariantAxis', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('key', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('label', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('options', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('unit', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'CategoryAttribute_options_elem_not_null_cd282aaa',
            sql`array_position("options", NULL) IS NULL`,
          ),
          checkExpression(
            'CategoryAttribute_type_check_5e6741d8',
            sql`"type" IN ('TEXT', 'NUMBER', 'BOOLEAN', 'SELECT', 'MULTI_SELECT')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Collection',
        columns: [
          col('bannerMediaId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('endsAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('startsAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'CollectionProduct',
        columns: [
          col('collectionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('productId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'CommissionRule',
        columns: [
          col('categoryId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('rateBps', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sellerId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('validFrom', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('validTo', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('commission_rate_in_range_bf5b17e6', sql`"rateBps" BETWEEN 0 AND 10000`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Coupon',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('endsAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('maxDiscountAmount', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('minOrderAmount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('perCustomerLimit', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('sellerId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('startsAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('usageLimit', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('usedCount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('value', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('Coupon_type_check_974eeae5', sql`"type" IN ('PERCENTAGE', 'FLAT')`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'CouponRedemption',
        columns: [
          col('couponId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('customerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('discountAmount', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orderId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Invoice',
        columns: [
          col('cgstAmount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('documentMediaId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('igstAmount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('invoiceNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('issuedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('placeOfSupply', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('returnRequestId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('sellerOrderId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sgstAmount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('taxableAmount', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('total', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Invoice_type_check_dd857474',
            sql`"type" IN ('TAX_INVOICE', 'CREDIT_NOTE')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Notification',
        columns: [
          col('body', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('linkUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('readAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Notification_type_check_d93b579a',
            sql`"type" IN ('ORDER', 'SHIPMENT', 'RETURN', 'PAYOUT', 'ACCOUNT', 'PROMOTION')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Order',
        columns: [
          col('billingAddress', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('cancelledAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('currency', 'text', {
            notNull: true,
            default: lit('INR'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('customerGstin', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('customerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('discountTotal', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('grandTotal', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('idempotencyKey', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orderNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('placedAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('shippingAddress', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('shippingTotal', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING_PAYMENT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('subtotal', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('taxTotal', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Order_status_check_e1cddfec',
            sql`"status" IN ('PENDING_PAYMENT', 'PLACED', 'COMPLETED', 'CANCELLED', 'PAYMENT_FAILED')`,
          ),
          checkExpression('order_grand_total_non_negative_0c37465c', sql`"grandTotal" >= 0`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'OrderEvent',
        columns: [
          col('actorType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('actorUserId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('fromStatus', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('metadata', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('note', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('orderId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sellerOrderId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('toStatus', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'OrderEvent_actorType_check_47b31a02',
            sql`"actorType" IN ('CUSTOMER', 'SELLER', 'ADMIN', 'SYSTEM')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'OrderItem',
        columns: [
          col('attributes', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('cgstAmount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('commissionAmount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('commissionBps', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('discountAmount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('gstRateBps', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('hsnCode', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('igstAmount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('imageUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('lineTotal', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('quantity', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sellerListingId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sellerOrderId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sellerSku', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sgstAmount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('sku', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PLACED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('taxableAmount', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('unitMrp', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('unitPrice', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('variantId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'OrderItem_status_check_63f515d6',
            sql`"status" IN ('PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED')`,
          ),
          checkExpression('order_item_quantity_positive_fc510296', sql`"quantity" > 0`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Payment',
        columns: [
          col('amount', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('capturedAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('currency', 'text', {
            notNull: true,
            default: lit('INR'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('failureCode', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('failureReason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('method', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('orderId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('provider', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('providerOrderId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('providerPaymentId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('CREATED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Payment_method_check_b0a030f1',
            sql`"method" IN ('UPI', 'CARD', 'NETBANKING', 'WALLET', 'EMI', 'COD')`,
          ),
          checkExpression(
            'Payment_provider_check_02b505aa',
            sql`"provider" IN ('RAZORPAY', 'COD')`,
          ),
          checkExpression(
            'Payment_status_check_4379fb47',
            sql`"status" IN ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'PARTIALLY_REFUNDED', 'REFUNDED')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'PaymentWebhookEvent',
        columns: [
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('error', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('eventType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('payload', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('processedAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('provider', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('providerEventId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'PaymentWebhookEvent_provider_check_02b505aa',
            sql`"provider" IN ('RAZORPAY', 'COD')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Payout',
        columns: [
          col('amount', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('bankAccountId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('failureReason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('paidAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('payoutNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('periodEnd', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('periodStart', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('sellerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('utrNumber', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Payout_status_check_1378c8a0',
            sql`"status" IN ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'ON_HOLD')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'ProductReview',
        columns: [
          col('body', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('customerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('helpfulCount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('moderatedAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('moderatedById', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('orderItemId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('productId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('rating', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('title', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'ProductReview_status_check_cc4cbb7b',
            sql`"status" IN ('PENDING', 'PUBLISHED', 'REJECTED')`,
          ),
          checkExpression('product_review_rating_in_range_63f6196d', sql`"rating" BETWEEN 1 AND 5`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Refund',
        columns: [
          col('amount', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orderItemId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('paymentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('processedAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('providerRefundId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('reason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('returnRequestId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Refund_status_check_8276955c',
            sql`"status" IN ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED')`,
          ),
          checkExpression('refund_amount_positive_ed0d10ac', sql`"amount" > 0`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'ReturnMedia',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('mediaId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('returnRequestId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ReturnRequest',
        columns: [
          col('comment', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('completedAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('customerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('decidedAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('decidedById', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orderItemId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quantity', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('reason', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('receivedAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('rejectionReason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('resolution', 'text', {
            notNull: true,
            default: lit('REFUND'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('returnNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sellerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('REQUESTED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'ReturnRequest_reason_check_e9e2f3b2',
            sql`"reason" IN ('DAMAGED', 'DEFECTIVE', 'WRONG_ITEM', 'NOT_AS_DESCRIBED', 'SIZE_OR_FIT', 'CHANGED_MIND', 'OTHER')`,
          ),
          checkExpression(
            'ReturnRequest_resolution_check_f4b59d50',
            sql`"resolution" IN ('REFUND', 'REPLACEMENT')`,
          ),
          checkExpression(
            'ReturnRequest_status_check_cf915274',
            sql`"status" IN ('REQUESTED', 'APPROVED', 'REJECTED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'RECEIVED', 'COMPLETED', 'CANCELLED')`,
          ),
          checkExpression('return_quantity_positive_fc510296', sql`"quantity" > 0`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'ReviewMedia',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('mediaId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('reviewId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'SellerLedgerEntry',
        columns: [
          col('amount', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('availableAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('balanceAfter', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('idempotencyKey', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('note', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('orderItemId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('payoutId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('sellerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sellerOrderId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'SellerLedgerEntry_type_check_5983c8ff',
            sql`"type" IN ('SALE', 'COMMISSION', 'SHIPPING_FEE', 'PAYMENT_FEE', 'TCS', 'TDS', 'REFUND_REVERSAL', 'COMMISSION_REVERSAL', 'ADJUSTMENT', 'PAYOUT')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'SellerOrder',
        columns: [
          col('acceptedAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('cancelReason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('cancelledAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('cancelledBy', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('deliveredAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('discountTotal', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orderId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('packedAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('pickupLocationId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('sellerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sellerOrderNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('shipByAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('shippedAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('shippingTotal', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('NEW'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('subtotal', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('taxTotal', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('total', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'SellerOrder_cancelledBy_check_bdf4c9ef',
            sql`"cancelledBy" IN ('CUSTOMER', 'SELLER', 'ADMIN', 'SYSTEM')`,
          ),
          checkExpression(
            'SellerOrder_status_check_18d39b76',
            sql`"status" IN ('NEW', 'ACCEPTED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'SellerRating',
        columns: [
          col('comment', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('customerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('rating', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sellerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sellerOrderId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('seller_rating_in_range_63f6196d', sql`"rating" BETWEEN 1 AND 5`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Shipment',
        columns: [
          col('carrier', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('codAmount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('deliveredAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('direction', 'text', {
            notNull: true,
            default: lit('FORWARD'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('expectedDeliveryAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('labelMediaId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('pickedUpAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('returnRequestId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('sellerOrderId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('shippingCost', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('trackingNumber', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('weightGrams', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Shipment_direction_check_e4bcb6d2',
            sql`"direction" IN ('FORWARD', 'RETURN')`,
          ),
          checkExpression(
            'Shipment_status_check_acc16340',
            sql`"status" IN ('PENDING', 'LABEL_CREATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED', 'RETURNED_TO_SELLER', 'CANCELLED')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'ShipmentEvent',
        columns: [
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('location', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('occurredAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('rawStatus', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('shipmentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'ShipmentEvent_status_check_acc16340',
            sql`"status" IN ('PENDING', 'LABEL_CREATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED', 'RETURNED_TO_SELLER', 'CANCELLED')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'ShipmentItem',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orderItemId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quantity', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('shipmentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('shipment_item_quantity_positive_fc510296', sql`"quantity" > 0`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'WishlistItem',
        columns: [
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('customerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('productId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Address',
        column: col('recipientName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Address',
        column: col('stateCode', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Address',
        column: col('type', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Category',
        column: col('isReturnable', 'bool', {
          notNull: true,
          default: lit(true),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Category',
        column: col('returnWindowDays', 'int4', {
          notNull: true,
          default: lit(7),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'InventoryReservation',
        column: col('orderItemId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Product',
        column: col('countryOfOrigin', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Product',
        column: col('gstRateBps', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Product',
        column: col('hsnCode', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Product',
        column: col('manufacturerInfo', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Product',
        column: col('ratingCount', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Product',
        column: col('ratingTotal', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Seller',
        column: col('panNumber', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Seller',
        column: col('ratingCount', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Seller',
        column: col('ratingTotal', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'SellerListing',
        column: col('codEnabled', 'bool', {
          notNull: true,
          default: lit(true),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'SellerListing',
        column: col('maxOrderQuantity', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'SellerListing',
        column: col('minOrderQuantity', 'int4', {
          notNull: true,
          default: lit(1),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'Address',
        constraint: 'Address_type_check_1d56252c',
        expression: sql`"type" IN ('HOME', 'WORK', 'OTHER')`,
      }),
      this.addUnique({
        schema: 'public',
        table: 'Cart',
        constraint: 'Cart_customerId_key',
        columns: ['customerId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Cart',
        constraint: 'Cart_guestToken_key',
        columns: ['guestToken'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'CartItem',
        constraint: 'CartItem_cartId_sellerListingId_key',
        columns: ['cartId', 'sellerListingId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'CategoryAttribute',
        constraint: 'CategoryAttribute_categoryId_key_key',
        columns: ['categoryId', 'key'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Collection',
        constraint: 'Collection_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'CollectionProduct',
        constraint: 'CollectionProduct_collectionId_productId_key',
        columns: ['collectionId', 'productId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Coupon',
        constraint: 'Coupon_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'CouponRedemption',
        constraint: 'CouponRedemption_couponId_orderId_key',
        columns: ['couponId', 'orderId'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'InventoryItem',
        constraint: 'inventory_stock_consistent_f576fb82',
        expression: sql`"onHand" >= 0 AND "reserved" >= 0 AND "reserved" <= "onHand"`,
      }),
      this.addUnique({
        schema: 'public',
        table: 'Invoice',
        constraint: 'Invoice_invoiceNumber_key',
        columns: ['invoiceNumber'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Order',
        constraint: 'Order_orderNumber_key',
        columns: ['orderNumber'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Order',
        constraint: 'Order_idempotencyKey_key',
        columns: ['idempotencyKey'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Payment',
        constraint: 'Payment_providerOrderId_key',
        columns: ['providerOrderId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Payment',
        constraint: 'Payment_providerPaymentId_key',
        columns: ['providerPaymentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'PaymentWebhookEvent',
        constraint: 'PaymentWebhookEvent_provider_providerEventId_key',
        columns: ['provider', 'providerEventId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Payout',
        constraint: 'Payout_payoutNumber_key',
        columns: ['payoutNumber'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ProductReview',
        constraint: 'ProductReview_orderItemId_key',
        columns: ['orderItemId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Refund',
        constraint: 'Refund_providerRefundId_key',
        columns: ['providerRefundId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ReturnMedia',
        constraint: 'ReturnMedia_returnRequestId_mediaId_key',
        columns: ['returnRequestId', 'mediaId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ReturnRequest',
        constraint: 'ReturnRequest_returnNumber_key',
        columns: ['returnNumber'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ReviewMedia',
        constraint: 'ReviewMedia_reviewId_mediaId_key',
        columns: ['reviewId', 'mediaId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'SellerLedgerEntry',
        constraint: 'SellerLedgerEntry_idempotencyKey_key',
        columns: ['idempotencyKey'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'SellerListing',
        constraint: 'listing_price_within_mrp_6271f37a',
        expression: sql`"sellingPrice" <= "mrpPrice"`,
      }),
      this.addUnique({
        schema: 'public',
        table: 'SellerOrder',
        constraint: 'SellerOrder_sellerOrderNumber_key',
        columns: ['sellerOrderNumber'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'SellerOrder',
        constraint: 'SellerOrder_orderId_sellerId_key',
        columns: ['orderId', 'sellerId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'SellerRating',
        constraint: 'SellerRating_sellerOrderId_key',
        columns: ['sellerOrderId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Shipment',
        constraint: 'Shipment_carrier_trackingNumber_key',
        columns: ['carrier', 'trackingNumber'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ShipmentItem',
        constraint: 'ShipmentItem_shipmentId_orderItemId_key',
        columns: ['shipmentId', 'orderItemId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'WishlistItem',
        constraint: 'WishlistItem_customerId_productId_key',
        columns: ['customerId', 'productId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AuditLog',
        index: 'AuditLog_actorUserId_idx_96dac96c',
        columns: ['actorUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AuditLog',
        index: 'AuditLog_createdAt_idx_9575dbd7',
        columns: ['createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AuditLog',
        index: 'AuditLog_entityType_entityId_idx_ea0fa809',
        columns: ['entityType', 'entityId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Cart',
        index: 'Cart_expiresAt_idx_6b6b8c10',
        columns: ['expiresAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CartItem',
        index: 'CartItem_cartId_idx_79939295',
        columns: ['cartId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CartItem',
        index: 'CartItem_sellerListingId_idx_f2caddaa',
        columns: ['sellerListingId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CategoryAttribute',
        index: 'CategoryAttribute_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Collection',
        index: 'Collection_bannerMediaId_idx_758a6d51',
        columns: ['bannerMediaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Collection',
        index: 'Collection_isActive_sortOrder_idx_43c1fe34',
        columns: ['isActive', 'sortOrder'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CollectionProduct',
        index: 'CollectionProduct_collectionId_idx_b344fc1a',
        columns: ['collectionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CollectionProduct',
        index: 'CollectionProduct_productId_idx_5858600a',
        columns: ['productId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CommissionRule',
        index: 'CommissionRule_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CommissionRule',
        index: 'CommissionRule_isActive_idx_77fe3ba1',
        columns: ['isActive'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CommissionRule',
        index: 'CommissionRule_sellerId_idx_d71255f2',
        columns: ['sellerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Coupon',
        index: 'Coupon_isActive_endsAt_idx_efc13dfc',
        columns: ['isActive', 'endsAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Coupon',
        index: 'Coupon_sellerId_idx_d71255f2',
        columns: ['sellerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CouponRedemption',
        index: 'CouponRedemption_couponId_idx_a9dd19dc',
        columns: ['couponId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CouponRedemption',
        index: 'CouponRedemption_customerId_couponId_idx_0a44d2da',
        columns: ['customerId', 'couponId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CouponRedemption',
        index: 'CouponRedemption_customerId_idx_b2a8a46c',
        columns: ['customerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CouponRedemption',
        index: 'CouponRedemption_orderId_idx_d284871b',
        columns: ['orderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'InventoryReservation',
        index: 'InventoryReservation_orderItemId_idx_99e2d9f7',
        columns: ['orderItemId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Invoice',
        index: 'Invoice_documentMediaId_idx_833bd938',
        columns: ['documentMediaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Invoice',
        index: 'Invoice_returnRequestId_idx_433faccd',
        columns: ['returnRequestId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Invoice',
        index: 'Invoice_sellerOrderId_idx_337553c9',
        columns: ['sellerOrderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Notification',
        index: 'Notification_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Notification',
        index: 'Notification_userId_readAt_createdAt_idx_9b6c3810',
        columns: ['userId', 'readAt', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Order',
        index: 'Order_customerId_createdAt_idx_f10a1fb1',
        columns: ['customerId', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Order',
        index: 'Order_customerId_idx_b2a8a46c',
        columns: ['customerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Order',
        index: 'Order_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'OrderEvent',
        index: 'OrderEvent_actorUserId_idx_96dac96c',
        columns: ['actorUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'OrderEvent',
        index: 'OrderEvent_orderId_createdAt_idx_cf5e070a',
        columns: ['orderId', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'OrderEvent',
        index: 'OrderEvent_orderId_idx_d284871b',
        columns: ['orderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'OrderEvent',
        index: 'OrderEvent_sellerOrderId_idx_337553c9',
        columns: ['sellerOrderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'OrderItem',
        index: 'OrderItem_sellerListingId_idx_f2caddaa',
        columns: ['sellerListingId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'OrderItem',
        index: 'OrderItem_sellerOrderId_idx_337553c9',
        columns: ['sellerOrderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'OrderItem',
        index: 'OrderItem_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'OrderItem',
        index: 'OrderItem_variantId_idx_e16bb45d',
        columns: ['variantId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Payment',
        index: 'Payment_orderId_idx_d284871b',
        columns: ['orderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Payment',
        index: 'Payment_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PaymentWebhookEvent',
        index: 'PaymentWebhookEvent_processedAt_idx_e83f4a54',
        columns: ['processedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Payout',
        index: 'Payout_bankAccountId_idx_868f7205',
        columns: ['bankAccountId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Payout',
        index: 'Payout_sellerId_idx_d71255f2',
        columns: ['sellerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Payout',
        index: 'Payout_sellerId_status_idx_a31309c3',
        columns: ['sellerId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Payout',
        index: 'Payout_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Product',
        index: 'product_search_974e991a',
        expression: sql`(setweight(to_tsvector('english', coalesce("title", '')), 'A') || setweight(to_tsvector('english', coalesce("description", '')), 'B'))`,
        extras: { type: 'gin' },
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductReview',
        index: 'ProductReview_customerId_idx_b2a8a46c',
        columns: ['customerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductReview',
        index: 'ProductReview_moderatedById_idx_4b155aa3',
        columns: ['moderatedById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductReview',
        index: 'ProductReview_productId_idx_5858600a',
        columns: ['productId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductReview',
        index: 'ProductReview_productId_status_idx_285a0d76',
        columns: ['productId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Refund',
        index: 'Refund_orderItemId_idx_99e2d9f7',
        columns: ['orderItemId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Refund',
        index: 'Refund_paymentId_idx_b2fe9a10',
        columns: ['paymentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Refund',
        index: 'Refund_returnRequestId_idx_433faccd',
        columns: ['returnRequestId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Refund',
        index: 'Refund_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ReturnMedia',
        index: 'ReturnMedia_mediaId_idx_6b06655c',
        columns: ['mediaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ReturnMedia',
        index: 'ReturnMedia_returnRequestId_idx_433faccd',
        columns: ['returnRequestId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ReturnRequest',
        index: 'ReturnRequest_customerId_idx_b2a8a46c',
        columns: ['customerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ReturnRequest',
        index: 'ReturnRequest_decidedById_idx_8194d55f',
        columns: ['decidedById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ReturnRequest',
        index: 'ReturnRequest_orderItemId_idx_99e2d9f7',
        columns: ['orderItemId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ReturnRequest',
        index: 'ReturnRequest_sellerId_idx_d71255f2',
        columns: ['sellerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ReturnRequest',
        index: 'ReturnRequest_sellerId_status_idx_a31309c3',
        columns: ['sellerId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ReviewMedia',
        index: 'ReviewMedia_mediaId_idx_6b06655c',
        columns: ['mediaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ReviewMedia',
        index: 'ReviewMedia_reviewId_idx_2f51da17',
        columns: ['reviewId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerLedgerEntry',
        index: 'SellerLedgerEntry_availableAt_idx_10832852',
        columns: ['availableAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerLedgerEntry',
        index: 'SellerLedgerEntry_orderItemId_idx_99e2d9f7',
        columns: ['orderItemId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerLedgerEntry',
        index: 'SellerLedgerEntry_payoutId_idx_cce6e609',
        columns: ['payoutId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerLedgerEntry',
        index: 'SellerLedgerEntry_sellerId_createdAt_idx_a21eaac1',
        columns: ['sellerId', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerLedgerEntry',
        index: 'SellerLedgerEntry_sellerId_idx_d71255f2',
        columns: ['sellerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerLedgerEntry',
        index: 'SellerLedgerEntry_sellerOrderId_idx_337553c9',
        columns: ['sellerOrderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerLedgerEntry',
        index: 'SellerLedgerEntry_type_idx_b6b604ea',
        columns: ['type'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerListing',
        index: 'listing_buy_box_700c60e0',
        columns: ['variantId', 'status', 'sellingPrice'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerOrder',
        index: 'SellerOrder_orderId_idx_d284871b',
        columns: ['orderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerOrder',
        index: 'SellerOrder_pickupLocationId_idx_950b2b81',
        columns: ['pickupLocationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerOrder',
        index: 'SellerOrder_sellerId_idx_d71255f2',
        columns: ['sellerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerOrder',
        index: 'SellerOrder_sellerId_status_idx_a31309c3',
        columns: ['sellerId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerOrder',
        index: 'SellerOrder_status_shipByAt_idx_1ac8d3a7',
        columns: ['status', 'shipByAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerRating',
        index: 'SellerRating_customerId_idx_b2a8a46c',
        columns: ['customerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerRating',
        index: 'SellerRating_sellerId_idx_d71255f2',
        columns: ['sellerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Shipment',
        index: 'Shipment_labelMediaId_idx_a80108a9',
        columns: ['labelMediaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Shipment',
        index: 'Shipment_returnRequestId_idx_433faccd',
        columns: ['returnRequestId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Shipment',
        index: 'Shipment_sellerOrderId_idx_337553c9',
        columns: ['sellerOrderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Shipment',
        index: 'Shipment_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ShipmentEvent',
        index: 'ShipmentEvent_shipmentId_idx_e3606ec1',
        columns: ['shipmentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ShipmentEvent',
        index: 'ShipmentEvent_shipmentId_occurredAt_idx_835d387d',
        columns: ['shipmentId', 'occurredAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ShipmentItem',
        index: 'ShipmentItem_orderItemId_idx_99e2d9f7',
        columns: ['orderItemId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ShipmentItem',
        index: 'ShipmentItem_shipmentId_idx_e3606ec1',
        columns: ['shipmentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'WishlistItem',
        index: 'WishlistItem_customerId_idx_b2a8a46c',
        columns: ['customerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'WishlistItem',
        index: 'WishlistItem_productId_idx_5858600a',
        columns: ['productId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AuditLog',
        foreignKey: {
          name: 'AuditLog_actorUserId_fkey',
          columns: ['actorUserId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Cart',
        foreignKey: {
          name: 'Cart_customerId_fkey',
          columns: ['customerId'],
          references: { schema: 'public', table: 'Customer', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CartItem',
        foreignKey: {
          name: 'CartItem_cartId_fkey',
          columns: ['cartId'],
          references: { schema: 'public', table: 'Cart', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CartItem',
        foreignKey: {
          name: 'CartItem_sellerListingId_fkey',
          columns: ['sellerListingId'],
          references: { schema: 'public', table: 'SellerListing', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CategoryAttribute',
        foreignKey: {
          name: 'CategoryAttribute_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'Category', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Collection',
        foreignKey: {
          name: 'Collection_bannerMediaId_fkey',
          columns: ['bannerMediaId'],
          references: { schema: 'public', table: 'Media', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CollectionProduct',
        foreignKey: {
          name: 'CollectionProduct_collectionId_fkey',
          columns: ['collectionId'],
          references: { schema: 'public', table: 'Collection', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CollectionProduct',
        foreignKey: {
          name: 'CollectionProduct_productId_fkey',
          columns: ['productId'],
          references: { schema: 'public', table: 'Product', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CommissionRule',
        foreignKey: {
          name: 'CommissionRule_sellerId_fkey',
          columns: ['sellerId'],
          references: { schema: 'public', table: 'Seller', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CommissionRule',
        foreignKey: {
          name: 'CommissionRule_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'Category', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Coupon',
        foreignKey: {
          name: 'Coupon_sellerId_fkey',
          columns: ['sellerId'],
          references: { schema: 'public', table: 'Seller', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CouponRedemption',
        foreignKey: {
          name: 'CouponRedemption_couponId_fkey',
          columns: ['couponId'],
          references: { schema: 'public', table: 'Coupon', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CouponRedemption',
        foreignKey: {
          name: 'CouponRedemption_orderId_fkey',
          columns: ['orderId'],
          references: { schema: 'public', table: 'Order', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CouponRedemption',
        foreignKey: {
          name: 'CouponRedemption_customerId_fkey',
          columns: ['customerId'],
          references: { schema: 'public', table: 'Customer', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Invoice',
        foreignKey: {
          name: 'Invoice_sellerOrderId_fkey',
          columns: ['sellerOrderId'],
          references: { schema: 'public', table: 'SellerOrder', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Invoice',
        foreignKey: {
          name: 'Invoice_returnRequestId_fkey',
          columns: ['returnRequestId'],
          references: { schema: 'public', table: 'ReturnRequest', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Invoice',
        foreignKey: {
          name: 'Invoice_documentMediaId_fkey',
          columns: ['documentMediaId'],
          references: { schema: 'public', table: 'Media', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Notification',
        foreignKey: {
          name: 'Notification_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Order',
        foreignKey: {
          name: 'Order_customerId_fkey',
          columns: ['customerId'],
          references: { schema: 'public', table: 'Customer', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'OrderEvent',
        foreignKey: {
          name: 'OrderEvent_orderId_fkey',
          columns: ['orderId'],
          references: { schema: 'public', table: 'Order', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'OrderEvent',
        foreignKey: {
          name: 'OrderEvent_sellerOrderId_fkey',
          columns: ['sellerOrderId'],
          references: { schema: 'public', table: 'SellerOrder', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'OrderEvent',
        foreignKey: {
          name: 'OrderEvent_actorUserId_fkey',
          columns: ['actorUserId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'OrderItem',
        foreignKey: {
          name: 'OrderItem_sellerOrderId_fkey',
          columns: ['sellerOrderId'],
          references: { schema: 'public', table: 'SellerOrder', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'OrderItem',
        foreignKey: {
          name: 'OrderItem_sellerListingId_fkey',
          columns: ['sellerListingId'],
          references: { schema: 'public', table: 'SellerListing', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'OrderItem',
        foreignKey: {
          name: 'OrderItem_variantId_fkey',
          columns: ['variantId'],
          references: { schema: 'public', table: 'ProductVariant', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'InventoryReservation',
        foreignKey: {
          name: 'InventoryReservation_orderItemId_fkey',
          columns: ['orderItemId'],
          references: { schema: 'public', table: 'OrderItem', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Payment',
        foreignKey: {
          name: 'Payment_orderId_fkey',
          columns: ['orderId'],
          references: { schema: 'public', table: 'Order', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Payout',
        foreignKey: {
          name: 'Payout_sellerId_fkey',
          columns: ['sellerId'],
          references: { schema: 'public', table: 'Seller', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Payout',
        foreignKey: {
          name: 'Payout_bankAccountId_fkey',
          columns: ['bankAccountId'],
          references: { schema: 'public', table: 'BankAccount', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductReview',
        foreignKey: {
          name: 'ProductReview_productId_fkey',
          columns: ['productId'],
          references: { schema: 'public', table: 'Product', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductReview',
        foreignKey: {
          name: 'ProductReview_customerId_fkey',
          columns: ['customerId'],
          references: { schema: 'public', table: 'Customer', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductReview',
        foreignKey: {
          name: 'ProductReview_orderItemId_fkey',
          columns: ['orderItemId'],
          references: { schema: 'public', table: 'OrderItem', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductReview',
        foreignKey: {
          name: 'ProductReview_moderatedById_fkey',
          columns: ['moderatedById'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Refund',
        foreignKey: {
          name: 'Refund_paymentId_fkey',
          columns: ['paymentId'],
          references: { schema: 'public', table: 'Payment', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Refund',
        foreignKey: {
          name: 'Refund_orderItemId_fkey',
          columns: ['orderItemId'],
          references: { schema: 'public', table: 'OrderItem', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Refund',
        foreignKey: {
          name: 'Refund_returnRequestId_fkey',
          columns: ['returnRequestId'],
          references: { schema: 'public', table: 'ReturnRequest', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ReturnMedia',
        foreignKey: {
          name: 'ReturnMedia_returnRequestId_fkey',
          columns: ['returnRequestId'],
          references: { schema: 'public', table: 'ReturnRequest', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ReturnMedia',
        foreignKey: {
          name: 'ReturnMedia_mediaId_fkey',
          columns: ['mediaId'],
          references: { schema: 'public', table: 'Media', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ReturnRequest',
        foreignKey: {
          name: 'ReturnRequest_orderItemId_fkey',
          columns: ['orderItemId'],
          references: { schema: 'public', table: 'OrderItem', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ReturnRequest',
        foreignKey: {
          name: 'ReturnRequest_customerId_fkey',
          columns: ['customerId'],
          references: { schema: 'public', table: 'Customer', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ReturnRequest',
        foreignKey: {
          name: 'ReturnRequest_sellerId_fkey',
          columns: ['sellerId'],
          references: { schema: 'public', table: 'Seller', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ReturnRequest',
        foreignKey: {
          name: 'ReturnRequest_decidedById_fkey',
          columns: ['decidedById'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ReviewMedia',
        foreignKey: {
          name: 'ReviewMedia_reviewId_fkey',
          columns: ['reviewId'],
          references: { schema: 'public', table: 'ProductReview', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ReviewMedia',
        foreignKey: {
          name: 'ReviewMedia_mediaId_fkey',
          columns: ['mediaId'],
          references: { schema: 'public', table: 'Media', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SellerLedgerEntry',
        foreignKey: {
          name: 'SellerLedgerEntry_sellerId_fkey',
          columns: ['sellerId'],
          references: { schema: 'public', table: 'Seller', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SellerLedgerEntry',
        foreignKey: {
          name: 'SellerLedgerEntry_sellerOrderId_fkey',
          columns: ['sellerOrderId'],
          references: { schema: 'public', table: 'SellerOrder', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SellerLedgerEntry',
        foreignKey: {
          name: 'SellerLedgerEntry_orderItemId_fkey',
          columns: ['orderItemId'],
          references: { schema: 'public', table: 'OrderItem', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SellerLedgerEntry',
        foreignKey: {
          name: 'SellerLedgerEntry_payoutId_fkey',
          columns: ['payoutId'],
          references: { schema: 'public', table: 'Payout', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SellerOrder',
        foreignKey: {
          name: 'SellerOrder_orderId_fkey',
          columns: ['orderId'],
          references: { schema: 'public', table: 'Order', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SellerOrder',
        foreignKey: {
          name: 'SellerOrder_sellerId_fkey',
          columns: ['sellerId'],
          references: { schema: 'public', table: 'Seller', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SellerOrder',
        foreignKey: {
          name: 'SellerOrder_pickupLocationId_fkey',
          columns: ['pickupLocationId'],
          references: { schema: 'public', table: 'InventoryLocation', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SellerRating',
        foreignKey: {
          name: 'SellerRating_sellerOrderId_fkey',
          columns: ['sellerOrderId'],
          references: { schema: 'public', table: 'SellerOrder', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SellerRating',
        foreignKey: {
          name: 'SellerRating_sellerId_fkey',
          columns: ['sellerId'],
          references: { schema: 'public', table: 'Seller', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SellerRating',
        foreignKey: {
          name: 'SellerRating_customerId_fkey',
          columns: ['customerId'],
          references: { schema: 'public', table: 'Customer', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Shipment',
        foreignKey: {
          name: 'Shipment_sellerOrderId_fkey',
          columns: ['sellerOrderId'],
          references: { schema: 'public', table: 'SellerOrder', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Shipment',
        foreignKey: {
          name: 'Shipment_returnRequestId_fkey',
          columns: ['returnRequestId'],
          references: { schema: 'public', table: 'ReturnRequest', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Shipment',
        foreignKey: {
          name: 'Shipment_labelMediaId_fkey',
          columns: ['labelMediaId'],
          references: { schema: 'public', table: 'Media', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ShipmentEvent',
        foreignKey: {
          name: 'ShipmentEvent_shipmentId_fkey',
          columns: ['shipmentId'],
          references: { schema: 'public', table: 'Shipment', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ShipmentItem',
        foreignKey: {
          name: 'ShipmentItem_shipmentId_fkey',
          columns: ['shipmentId'],
          references: { schema: 'public', table: 'Shipment', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ShipmentItem',
        foreignKey: {
          name: 'ShipmentItem_orderItemId_fkey',
          columns: ['orderItemId'],
          references: { schema: 'public', table: 'OrderItem', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'WishlistItem',
        foreignKey: {
          name: 'WishlistItem_customerId_fkey',
          columns: ['customerId'],
          references: { schema: 'public', table: 'Customer', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'WishlistItem',
        foreignKey: {
          name: 'WishlistItem_productId_fkey',
          columns: ['productId'],
          references: { schema: 'public', table: 'Product', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
