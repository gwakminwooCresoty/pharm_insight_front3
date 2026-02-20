import { NavLink } from 'react-router-dom';
import {
  BarChart2,
  FileText,
  CreditCard,
  LayoutDashboard,
  Building2,
  Users,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { canAccessMenu } from '@/utils/permissions';
import { BRANDING } from '@/data/branding.dummy';

interface MenuItem {
  path: string;
  label: string;
  menuKey?: string;
  icon: React.ReactNode;
}

const ALL_MENU_ITEMS: MenuItem[] = [
  { path: '/pos/statistics', label: 'POS 실적 조회', icon: <BarChart2 size={15} /> },
  { path: '/settlement', label: 'CR정산서', menuKey: 'settlement', icon: <FileText size={15} /> },
  { path: '/card/approvals', label: '카드승인 조회', menuKey: 'card', icon: <CreditCard size={15} /> },
];

const PLATFORM_MENU_ITEMS: MenuItem[] = [
  {
    path: '/platform/dashboard',
    label: '플랫폼 대시보드',
    menuKey: 'platform-dashboard',
    icon: <LayoutDashboard size={15} />,
  },
  {
    path: '/platform/tenants',
    label: '테넌트 관리',
    menuKey: 'platform-tenants',
    icon: <Building2 size={15} />,
  },
  {
    path: '/platform/users',
    label: '사용자 관리',
    menuKey: 'platform-users',
    icon: <Users size={15} />,
  },
];

const linkBase =
  'flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors';
const linkActive = 'bg-blue-600 text-white';
const linkIdle = 'text-slate-400 hover:bg-slate-800 hover:text-slate-200';

export default function Sidebar() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const visibleMenu = ALL_MENU_ITEMS.filter(
    (item) => !item.menuKey || canAccessMenu(currentUser, item.menuKey)
  );

  const visiblePlatformMenu = PLATFORM_MENU_ITEMS.filter(
    (item) => !item.menuKey || canAccessMenu(currentUser, item.menuKey)
  );

  return (
    <aside className="w-48 bg-slate-900 text-white flex flex-col shrink-0">
      {/* 로고 */}
      <div className="px-4 py-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          {/* 약국 십자 로고마크 */}
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="5.5" y="1" width="3" height="12" rx="1" fill="white" />
              <rect x="1" y="5.5" width="12" height="3" rx="1" fill="white" />
            </svg>
          </div>
          <span className="font-bold text-[14px] tracking-tight text-white leading-tight">
            {BRANDING.serviceName}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1 pl-9">POS 분석 플랫폼</p>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-2 py-1.5">
          업무
        </p>
        {visibleMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {visiblePlatformMenu.length > 0 && (
          <>
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-2 py-1.5 mt-3">
              플랫폼 관리
            </p>
            {visiblePlatformMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkIdle}`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* 하단 사용자 요약 */}
      <div className="px-3 py-3 border-t border-slate-700/60">
        <p className="text-[11px] text-slate-400 truncate">{currentUser.name}</p>
        <p className="text-[10px] text-slate-600 truncate mt-0.5">
          {currentUser.franchiseName ?? '플랫폼'}
        </p>
      </div>
    </aside>
  );
}
