import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: 'User';
    readonly Customer: 'Customer';
    readonly Product: 'Product';
    readonly StockMovement: 'StockMovement';
    readonly Challan: 'Challan';
    readonly ChallanItem: 'ChallanItem';
    readonly FollowUp: 'FollowUp';
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: 'ReadUncommitted';
    readonly ReadCommitted: 'ReadCommitted';
    readonly RepeatableRead: 'RepeatableRead';
    readonly Serializable: 'Serializable';
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly email: 'email';
    readonly password: 'password';
    readonly role: 'role';
    readonly createdAt: 'createdAt';
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const CustomerScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly mobile: 'mobile';
    readonly email: 'email';
    readonly businessName: 'businessName';
    readonly gstNumber: 'gstNumber';
    readonly type: 'type';
    readonly address: 'address';
    readonly status: 'status';
    readonly followUpDate: 'followUpDate';
    readonly notes: 'notes';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
    readonly createdById: 'createdById';
};
export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum];
export declare const ProductScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly sku: 'sku';
    readonly category: 'category';
    readonly unitPrice: 'unitPrice';
    readonly currentStock: 'currentStock';
    readonly minStock: 'minStock';
    readonly warehouse: 'warehouse';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum];
export declare const StockMovementScalarFieldEnum: {
    readonly id: 'id';
    readonly quantity: 'quantity';
    readonly type: 'type';
    readonly reason: 'reason';
    readonly createdAt: 'createdAt';
    readonly productId: 'productId';
    readonly createdById: 'createdById';
};
export type StockMovementScalarFieldEnum = (typeof StockMovementScalarFieldEnum)[keyof typeof StockMovementScalarFieldEnum];
export declare const ChallanScalarFieldEnum: {
    readonly id: 'id';
    readonly challanNumber: 'challanNumber';
    readonly status: 'status';
    readonly totalQuantity: 'totalQuantity';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
    readonly customerId: 'customerId';
    readonly createdById: 'createdById';
};
export type ChallanScalarFieldEnum = (typeof ChallanScalarFieldEnum)[keyof typeof ChallanScalarFieldEnum];
export declare const ChallanItemScalarFieldEnum: {
    readonly id: 'id';
    readonly quantity: 'quantity';
    readonly unitPrice: 'unitPrice';
    readonly productName: 'productName';
    readonly sku: 'sku';
    readonly challanId: 'challanId';
    readonly productId: 'productId';
};
export type ChallanItemScalarFieldEnum = (typeof ChallanItemScalarFieldEnum)[keyof typeof ChallanItemScalarFieldEnum];
export declare const FollowUpScalarFieldEnum: {
    readonly id: 'id';
    readonly note: 'note';
    readonly createdAt: 'createdAt';
    readonly customerId: 'customerId';
    readonly createdById: 'createdById';
};
export type FollowUpScalarFieldEnum = (typeof FollowUpScalarFieldEnum)[keyof typeof FollowUpScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: 'asc';
    readonly desc: 'desc';
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: 'default';
    readonly insensitive: 'insensitive';
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: 'first';
    readonly last: 'last';
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map