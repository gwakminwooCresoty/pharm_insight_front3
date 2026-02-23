import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/utils/permissions';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function TopHeader() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { title, subtitle } = usePageMeta();

  if (!currentUser) return null;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 shadow-sm">
      <div className="flex flex-col justify-center">
        {title && (
          <span className="text-sm font-semibold text-gray-800 leading-tight">{title}</span>
        )}
        {subtitle && (
          <span className="text-xs text-gray-400 leading-tight mt-0.5">{subtitle}</span>
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
