import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/utils/permissions';
import type { Permission } from '@/types/auth';

export function useAuth() {
  const { currentUser, isAuthenticated, login, logout } = useAuthStore();

  function can(permission: Permission): boolean {
    if (!currentUser) return false;
    return hasPermission(currentUser, permission);
  }

  return { currentUser, isAuthenticated, login, logout, can };
}
