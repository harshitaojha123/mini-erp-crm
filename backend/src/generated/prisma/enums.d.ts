export declare const Role: {
    readonly ADMIN: 'ADMIN';
    readonly SALES: 'SALES';
    readonly WAREHOUSE: 'WAREHOUSE';
    readonly ACCOUNTS: 'ACCOUNTS';
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const CustomerType: {
    readonly RETAIL: 'RETAIL';
    readonly WHOLESALE: 'WHOLESALE';
    readonly DISTRIBUTOR: 'DISTRIBUTOR';
};
export type CustomerType = (typeof CustomerType)[keyof typeof CustomerType];
export declare const CustomerStatus: {
    readonly LEAD: 'LEAD';
    readonly ACTIVE: 'ACTIVE';
    readonly INACTIVE: 'INACTIVE';
};
export type CustomerStatus = (typeof CustomerStatus)[keyof typeof CustomerStatus];
export declare const MovementType: {
    readonly IN: 'IN';
    readonly OUT: 'OUT';
};
export type MovementType = (typeof MovementType)[keyof typeof MovementType];
export declare const ChallanStatus: {
    readonly DRAFT: 'DRAFT';
    readonly CONFIRMED: 'CONFIRMED';
    readonly CANCELLED: 'CANCELLED';
};
export type ChallanStatus = (typeof ChallanStatus)[keyof typeof ChallanStatus];
//# sourceMappingURL=enums.d.ts.map