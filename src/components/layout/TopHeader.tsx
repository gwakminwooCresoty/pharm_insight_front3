import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/utils/permissions';

const PAGE_TITLES: Record<string, string> = {
  '/pos/statistics': 'POS 실적 조회',
  '/settlement': 'CR정산서',
  '/card/approvals': '카드승인 조회',
  '/platform/dashboard': '플랫폼 대시보드',
  '/platform/tenants': '테넌트 관리',
  '/platform/users': '사용자 관리',
};

export default function TopHeader() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return null;

  const pageTitle =
    PAGE_TITLES[location.pathname] ??
    (location.pathname.startsWith('/pos/items/') ? '단품 실적 상세' : '');

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="h-12 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 shadow-sm">
      <div className="flex items-center gap-2">
        {pageTitle && (
          <span className="text-sm font-semibold text-gray-700">{pageTitle}</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-[13px] font-semibold text-gray-800 leading-tight">
            {currentUser.name}
          </p>
          <p className="text-[11px] text-gray-400 leading-tight">
            {ROLE_LABELS[currentUser.role]}
            {currentUser.storeName && ` · ${currentUser.storeName}`}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-[12px] text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-2.5 py-1 hover:bg-gray-50 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
