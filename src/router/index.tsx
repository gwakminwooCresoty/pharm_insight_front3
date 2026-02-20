import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import PosStatisticsPage from '@/pages/pos/PosStatisticsPage';
import ItemDetailPage from '@/pages/pos/ItemDetailPage';
import SettlementPage from '@/pages/settlement/SettlementPage';
import CardApprovalPage from '@/pages/card/CardApprovalPage';
import PlatformDashboardPage from '@/pages/platform/PlatformDashboardPage';
import TenantManagePage from '@/pages/platform/TenantManagePage';
import UserManagePage from '@/pages/platform/UserManagePage';
import type { Permission } from '@/types/auth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RoleGuard({
  children,
  permission,
}: {
  children: React.ReactNode;
  permission: Permission;
}) {
  const { can } = useAuth();
  if (!can(permission)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-3">🚫</div>
          <h2 className="text-lg font-semibold text-gray-800">접근 권한 없음</h2>
          <p className="text-sm text-gray-500 mt-1">
            이 페이지에 접근할 권한이 없습니다. (403 Forbidden)
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/pos/statistics" replace />,
      },
      {
        path: 'pos/statistics',
        element: <PosStatisticsPage />,
      },
      {
        path: 'pos/items/:itemCode',
        element: <ItemDetailPage />,
      },
      {
        path: 'settlement',
        element: (
          <RoleGuard permission="SETTLEMENT_READ">
            <SettlementPage />
          </RoleGuard>
        ),
      },
      {
        path: 'card/approvals',
        element: (
          <RoleGuard permission="CARD_APPROVAL_READ">
            <CardApprovalPage />
          </RoleGuard>
        ),
      },
      {
        path: 'platform/dashboard',
        element: (
          <RoleGuard permission="PLATFORM_DASHBOARD">
            <PlatformDashboardPage />
          </RoleGuard>
        ),
      },
      {
        path: 'platform/tenants',
        element: (
          <RoleGuard permission="TENANT_MANAGE">
            <TenantManagePage />
          </RoleGuard>
        ),
      },
      {
        path: 'platform/users',
        element: (
          <RoleGuard permission="USER_MANAGE">
            <UserManagePage />
          </RoleGuard>
        ),
      },
    ],
  },
]);
