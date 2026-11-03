#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/d92976cc8f675e499fb94cc2a2a826099a36dd356e8629c722fae9a6dea91862/contract';
import endContract from '../../snapshots/d92976cc8f675e499fb94cc2a2a826099a36dd356e8629c722fae9a6dea91862/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/fa11d18c9b68cae0ff0ec5951aa4ec3579b3a3e904937aaf83cf74836e432bc6/contract';
import startContract from '../../snapshots/fa11d18c9b68cae0ff0ec5951aa4ec3579b3a3e904937aaf83cf74836e432bc6/contract.json' with { type: 'json' };
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
      ...this.renameColumn({ schema: 'public', table: 'Product', column: 'name', to: 'title' }),
      this.dropConstraint({
        schema: 'public',
        table: 'Product',
        constraint: 'Product_mediaId_fkey',
        kind: 'foreignKey',
      }),
      this.dropConstraint({ schema: 'public', table: 'Product', constraint: 'Product_name_key' }),
      this.dropColumn({ schema: 'public', table: 'Product', column: 'excerpt' }),
      this.dropColumn({ schema: 'public', table: 'Product', column: 'price' }),
      this.dropIndex({ schema: 'public', table: 'Product', index: 'Product_mediaId_idx_6b06655c' }),
      this.dropColumn({ schema: 'public', table: 'Product', column: 'mediaId' }),
      this.createTable({
        schema: 'public',
        table: 'Brand',
        columns: [
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isVerified', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('logoMediaId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('website', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'InventoryItem',
        columns: [
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('locationId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('lowStockThreshold', 'int4', {
            notNull: true,
            default: lit(5),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('onHand', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('reserved', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('safetyStock', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('sellerListingId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'InventoryLedger',
        columns: [
          col('balanceAfter', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('inventoryItemId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('note', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('performedById', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('quantityDelta', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('reason', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('referenceId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('referenceType', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'InventoryLedger_reason_check_0e220a20',
            sql`"reason" IN ('RESTOCK', 'ORDER_RESERVED', 'ORDER_FULFILLED', 'ORDER_CANCELLED_RESTOCK', 'RETURN_RESTOCK', 'DAMAGE_WRITEOFF', 'INVENTORY_AUDIT_ADJUSTMENT', 'TRANSFER')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'InventoryLocation',
        columns: [
          col('addressId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
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
          col('isPrimary', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sellerId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', {
            notNull: true,
            default: lit('SELLER_WAREHOUSE'),
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
            'InventoryLocation_type_check_038210a3',
            sql`"type" IN ('SELLER_WAREHOUSE', 'PLATFORM_FULFILLMENT_CENTER', 'STORE_RETAIL_POINT')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'InventoryReservation',
        columns: [
          col('cartId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('expiresAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('inventoryItemId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orderId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('quantity', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
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
            'InventoryReservation_status_check_34ee0601',
            sql`"status" IN ('PENDING', 'COMMITTED', 'RELEASED', 'EXPIRED')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'ProductMedia',
        columns: [
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isPrimary', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('mediaId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('productId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('variantId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ProductVariant',
        columns: [
          col('attributes', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('barcode', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('dimensions', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('productId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sku', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('ACTIVE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('weightGrams', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'ProductVariant_status_check_7cdff295',
            sql`"status" IN ('ACTIVE', 'INACTIVE', 'DISCONTINUED')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'SellerListing',
        columns: [
          col('condition', 'text', {
            notNull: true,
            default: lit('NEW'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('conditionNote', 'text', { codecRef: { codecId: 'pg/text@1' } }),
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
          col('handlingTimeDays', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('mrpPrice', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sellerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sellerSku', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sellingPrice', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('ACTIVE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('variantId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('warranty', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'SellerListing_condition_check_4051a077',
            sql`"condition" IN ('NEW', 'REFURBISHED', 'USED_LIKE_NEW', 'USED_GOOD', 'USED_FAIR')`,
          ),
          checkExpression(
            'SellerListing_status_check_7bb79f61',
            sql`"status" IN ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'SUSPENDED')`,
          ),
        ],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Product',
        column: col('approvedAt', 'timestamp(3)', {
          codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Product',
        column: col('brandId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Product',
        column: col('createdById', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Product',
        column: col('reviewFeedback', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Product',
        column: col('reviewedById', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Product',
        column: col('specifications', 'json', { codecRef: { codecId: 'pg/json@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Product',
        column: col('status', 'text', {
          notNull: true,
          default: lit('DRAFT'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'Product',
        column: 'highlights',
        type: 'text[]',
        temporaryDefault: sql`'{}'`,
      }),
      this.addRequiredColumnToEmptyTable({
        schema: 'public',
        table: 'Product',
        column: 'slug',
        type: 'text',
      }),
      this.addUnique({
        schema: 'public',
        table: 'Brand',
        constraint: 'Brand_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Brand',
        constraint: 'Brand_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'InventoryItem',
        constraint: 'InventoryItem_sellerListingId_locationId_key',
        columns: ['sellerListingId', 'locationId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'InventoryLocation',
        constraint: 'InventoryLocation_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'InventoryLocation',
        constraint: 'InventoryLocation_addressId_key',
        columns: ['addressId'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'Product',
        constraint: 'Product_highlights_elem_not_null_1a2363a4',
        expression: sql`array_position("highlights", NULL) IS NULL`,
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'Product',
        constraint: 'Product_status_check_7e9c0b49',
        expression: sql`"status" IN ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED')`,
      }),
      this.addUnique({
        schema: 'public',
        table: 'Product',
        constraint: 'Product_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ProductVariant',
        constraint: 'ProductVariant_sku_key',
        columns: ['sku'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ProductVariant',
        constraint: 'ProductVariant_barcode_key',
        columns: ['barcode'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'SellerListing',
        constraint: 'SellerListing_sellerId_variantId_key',
        columns: ['sellerId', 'variantId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'SellerListing',
        constraint: 'SellerListing_sellerId_sellerSku_key',
        columns: ['sellerId', 'sellerSku'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Brand',
        index: 'Brand_isVerified_idx_abf61aed',
        columns: ['isVerified'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Brand',
        index: 'Brand_logoMediaId_idx_5efcb8af',
        columns: ['logoMediaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'InventoryItem',
        index: 'InventoryItem_locationId_idx_7aae3038',
        columns: ['locationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'InventoryItem',
        index: 'InventoryItem_sellerListingId_idx_f2caddaa',
        columns: ['sellerListingId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'InventoryLedger',
        index: 'InventoryLedger_createdAt_idx_9575dbd7',
        columns: ['createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'InventoryLedger',
        index: 'InventoryLedger_inventoryItemId_idx_ddbb7ccf',
        columns: ['inventoryItemId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'InventoryLedger',
        index: 'InventoryLedger_performedById_idx_ae2dd11d',
        columns: ['performedById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'InventoryLedger',
        index: 'InventoryLedger_reason_idx_61fdaecb',
        columns: ['reason'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'InventoryLocation',
        index: 'InventoryLocation_isActive_idx_77fe3ba1',
        columns: ['isActive'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'InventoryLocation',
        index: 'InventoryLocation_sellerId_idx_d71255f2',
        columns: ['sellerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'InventoryReservation',
        index: 'InventoryReservation_expiresAt_idx_6b6b8c10',
        columns: ['expiresAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'InventoryReservation',
        index: 'InventoryReservation_inventoryItemId_idx_ddbb7ccf',
        columns: ['inventoryItemId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'InventoryReservation',
        index: 'InventoryReservation_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Product',
        index: 'Product_brandId_idx_02e95397',
        columns: ['brandId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Product',
        index: 'Product_createdById_idx_8bf640ed',
        columns: ['createdById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Product',
        index: 'Product_reviewedById_idx_e2835478',
        columns: ['reviewedById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Product',
        index: 'Product_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductMedia',
        index: 'ProductMedia_mediaId_idx_6b06655c',
        columns: ['mediaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductMedia',
        index: 'ProductMedia_productId_idx_5858600a',
        columns: ['productId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductMedia',
        index: 'ProductMedia_variantId_idx_e16bb45d',
        columns: ['variantId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductVariant',
        index: 'ProductVariant_productId_idx_5858600a',
        columns: ['productId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProductVariant',
        index: 'ProductVariant_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerListing',
        index: 'SellerListing_sellerId_idx_d71255f2',
        columns: ['sellerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerListing',
        index: 'SellerListing_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SellerListing',
        index: 'SellerListing_variantId_idx_e16bb45d',
        columns: ['variantId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Brand',
        foreignKey: {
          name: 'Brand_logoMediaId_fkey',
          columns: ['logoMediaId'],
          references: { schema: 'public', table: 'Media', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'InventoryItem',
        foreignKey: {
          name: 'InventoryItem_sellerListingId_fkey',
          columns: ['sellerListingId'],
          references: { schema: 'public', table: 'SellerListing', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'InventoryItem',
        foreignKey: {
          name: 'InventoryItem_locationId_fkey',
          columns: ['locationId'],
          references: { schema: 'public', table: 'InventoryLocation', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'InventoryLedger',
        foreignKey: {
          name: 'InventoryLedger_inventoryItemId_fkey',
          columns: ['inventoryItemId'],
          references: { schema: 'public', table: 'InventoryItem', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'InventoryLedger',
        foreignKey: {
          name: 'InventoryLedger_performedById_fkey',
          columns: ['performedById'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'InventoryLocation',
        foreignKey: {
          name: 'InventoryLocation_sellerId_fkey',
          columns: ['sellerId'],
          references: { schema: 'public', table: 'Seller', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'InventoryLocation',
        foreignKey: {
          name: 'InventoryLocation_addressId_fkey',
          columns: ['addressId'],
          references: { schema: 'public', table: 'Address', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'InventoryReservation',
        foreignKey: {
          name: 'InventoryReservation_inventoryItemId_fkey',
          columns: ['inventoryItemId'],
          references: { schema: 'public', table: 'InventoryItem', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Product',
        foreignKey: {
          name: 'Product_brandId_fkey',
          columns: ['brandId'],
          references: { schema: 'public', table: 'Brand', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Product',
        foreignKey: {
          name: 'Product_createdById_fkey',
          columns: ['createdById'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Product',
        foreignKey: {
          name: 'Product_reviewedById_fkey',
          columns: ['reviewedById'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductMedia',
        foreignKey: {
          name: 'ProductMedia_productId_fkey',
          columns: ['productId'],
          references: { schema: 'public', table: 'Product', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductMedia',
        foreignKey: {
          name: 'ProductMedia_variantId_fkey',
          columns: ['variantId'],
          references: { schema: 'public', table: 'ProductVariant', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductMedia',
        foreignKey: {
          name: 'ProductMedia_mediaId_fkey',
          columns: ['mediaId'],
          references: { schema: 'public', table: 'Media', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProductVariant',
        foreignKey: {
          name: 'ProductVariant_productId_fkey',
          columns: ['productId'],
          references: { schema: 'public', table: 'Product', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SellerListing',
        foreignKey: {
          name: 'SellerListing_sellerId_fkey',
          columns: ['sellerId'],
          references: { schema: 'public', table: 'Seller', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SellerListing',
        foreignKey: {
          name: 'SellerListing_variantId_fkey',
          columns: ['variantId'],
          references: { schema: 'public', table: 'ProductVariant', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
