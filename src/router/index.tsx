import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { Ban } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import PlatformLoginPage from '@/pages/PlatformLoginPage';
import PosStatisticsPage from '@/pages/pos/PosStatisticsPage';
import ItemDetailPage from '@/pages/pos/ItemDetailPage';
import SettlementPage from '@/pages/settlement/SettlementPage';
import CardApprovalPage from '@/pages/card/CardApprovalPage';
import PlatformDashboardPage from '@/pages/platform/PlatformDashboardPage';
import TenantManagePage from '@/pages/platform/TenantManagePage';
import UserManagePage from '@/pages/platform/UserManagePage';
import PermissionGroupPage from '@/pages/platform/PermissionGroupPage';
import StoreManagePage from '@/pages/franchise/StoreManagePage';
import PlatformInsightMapPage from '@/pages/platform/PlatformInsightMapPage';
import SystemMonitorPage from '@/pages/platform/SystemMonitorPage';
import type { Permission } from '@/types/auth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    const isPlatformPath = location.pathname.startsWith('/platform/');
    return <Navigate to={isPlatformPath ? '/platform/login' : '/login'} replace />;
  }
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
          <div className="flex justify-center mb-3">
            <Ban size={36} className="text-slate-300" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">접근 권한 없음</h2>
          <p className="text-sm text-slate-500 mt-1">
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
    path: '/platform/login',
    element: <PlatformLoginPage />,
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
        path: 'platform/system-monitor',
        element: (
          <RoleGuard permission="PLATFORM_DASHBOARD">
            <SystemMonitorPage />
          </RoleGuard>
        ),
      },
      {
        path: 'platform/franchises',
        element: (
          <RoleGuard permission="FRANCHISE_MANAGE">
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
      {
        path: 'platform/permission-groups',
        element: (
          <RoleGuard permission="FRANCHISE_MANAGE">
            <PermissionGroupPage />
          </RoleGuard>
        ),
      },
      {
        path: 'platform/insight-map',
        element: (
          <RoleGuard permission="PLATFORM_DASHBOARD">
            <PlatformInsightMapPage />
          </RoleGuard>
        ),
      },
      {
        path: 'franchise/stores',
        element: (
          <RoleGuard permission="FRANCHISE_STORE_MANAGE">
            <StoreManagePage />
          </RoleGuard>
        ),
      },
    ],
  },
]);
