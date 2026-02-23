import type { AuthUser, Permission, UserRole } from '@/types/auth';

export const ROLE_LABELS: Record<UserRole, string> = {
  PLATFORM_ADMIN: '플랫폼 관리자',
  FRANCHISE_ADMIN: '프랜차이즈 관리자',
  FRANCHISE_VIEWER: '프랜차이즈 열람자',
  REGION_MANAGER: '지역 관리자',
  STORE_MANAGER: '매장 관리자',
  STORE_STAFF: '매장 직원',
};

export function hasPermission(user: AuthUser, permission: Permission): boolean {
  return user.permissions.includes(permission);
}

export function canAccessMenu(user: AuthUser, menuKey: string): boolean {
  const menuPermissions: Record<string, Permission[]> = {
    settlement: ['SETTLEMENT_READ'],
    card: ['CARD_APPROVAL_READ'],
    'platform-dashboard': ['PLATFORM_DASHBOARD'],
    'platform-franchises': ['FRANCHISE_MANAGE'],
    'platform-users': ['USER_MANAGE'],
    'permission-groups': ['FRANCHISE_MANAGE'],
    'franchise-stores': ['FRANCHISE_STORE_MANAGE'],
  };
  const required = menuPermissions[menuKey];
  if (!required) return true;
  return required.every((p) => hasPermission(user, p));
}

export type StoreSelectorMode =
  | 'hidden'
  | 'multi'
  | 'franchise-multi'
  | 'platform';

export function shouldShowStoreSelector(role: UserRole): StoreSelectorMode {
  if (role === 'STORE_MANAGER' || role === 'STORE_STAFF') return 'hidden';
  if (role === 'REGION_MANAGER') return 'multi';
  if (role === 'FRANCHISE_ADMIN' || role === 'FRANCHISE_VIEWER')
    return 'franchise-multi';
  if (role === 'PLATFORM_ADMIN') return 'platform';
  return 'hidden';
}
