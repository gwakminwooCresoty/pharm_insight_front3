import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
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

  // 이니셜 아바타
  const initials = currentUser.name.slice(0, 1);

  return (
    <header className="h-14 bg-gradient-to-r from-white via-white to-slate-50/80 border-b border-slate-200/80 flex items-center justify-between px-6 shrink-0 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
      <div className="flex flex-col justify-center">
        {title && (
          <span className="text-sm font-semibold text-gray-800 leading-tight">{title}</span>
        )}
        {subtitle && (
          <span className="text-xs text-slate-400 leading-tight mt-0.5">{subtitle}</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
          <div className="text-right">
            <p className="text-[13px] font-semibold text-gray-800 leading-tight">
              {currentUser.name}
            </p>
            <p className="text-[11px] text-slate-400 leading-tight">
              {ROLE_LABELS[currentUser.role]}
              {currentUser.storeName && ` · ${currentUser.storeName}`}
            </p>
          </div>
        </div>
        <div className="w-px h-6 bg-slate-100" />
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-slate-600 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 transition-colors duration-[var(--transition-fast)]"
        >
          <LogOut size={14} />
          로그아웃
        </button>
      </div>
    </header>
  );
}
