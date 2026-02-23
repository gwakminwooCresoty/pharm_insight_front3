export type UserRole =
  | 'PLATFORM_ADMIN'
  | 'FRANCHISE_ADMIN'
  | 'FRANCHISE_VIEWER'
  | 'REGION_MANAGER'
  | 'STORE_MANAGER'
  | 'STORE_STAFF';

export type Permission =
  | 'POS_STATS_READ'
  | 'SETTLEMENT_READ'
  | 'CARD_APPROVAL_READ'
  | 'EXPORT_DATA'
  | 'USER_MANAGE'
  | 'FRANCHISE_MANAGE'
  | 'PLATFORM_DASHBOARD'
  | 'FRANCHISE_STORE_MANAGE';

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  franchiseId: string | null;
  franchiseName: string | null;
  regionId: string | null;
  storeId: string | null;
  storeName: string | null;
  permissions: Permission[];
}
