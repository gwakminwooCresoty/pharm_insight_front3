export type PermissionMenu = {
  id: string;
  label: string;
  isDefault: boolean;
  parentId: string | null;
};

export type PermissionGroup = {
  id: string;
  name: string;
  description: string;
  menuIds: string[];
  isSystem: boolean;
  createdAt: string;
};

export const PERMISSION_MENUS: PermissionMenu[] = [
  { id: 'm_dashboard', label: '대시보드', isDefault: true, parentId: null },
  { id: 'm_store', label: '매장 관리', isDefault: true, parentId: null },
  { id: 'm_statistics', label: '통계/분석', isDefault: false, parentId: null },
  { id: 'm_stat_premium', label: '프리미엄 통계', isDefault: false, parentId: 'm_statistics' },
  { id: 'm_settlement', label: '정산 관리', isDefault: false, parentId: null },
  { id: 'm_tax', label: '세금계산서', isDefault: false, parentId: 'm_settlement' },
  { id: 'm_api', label: 'API 연동', isDefault: false, parentId: null },
];

export const DUMMY_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: 'g_basic',
    name: '기본 그룹',
    description: '모든 프랜차이즈에 기본 제공되는 필수 메뉴 그룹입니다.',
    menuIds: ['m_dashboard', 'm_store'],
    isSystem: true,
    createdAt: '2025-01-01',
  },
  {
    id: 'g_premium',
    name: '프리미엄 분석 그룹',
    description: '통계 및 프리미엄 분석 기능을 포함합니다.',
    menuIds: ['m_statistics', 'm_stat_premium'],
    isSystem: false,
    createdAt: '2025-01-10',
  },
  {
    id: 'g_settlement',
    name: '정산 전용 그룹',
    description: '정산 관리 및 세금계산서 기능을 포함합니다.',
    menuIds: ['m_settlement', 'm_tax'],
    isSystem: false,
    createdAt: '2025-01-10',
  },
  {
    id: 'g_api',
    name: '외부 연동 그룹',
    description: 'API 연동 기능을 포함합니다.',
    menuIds: ['m_api'],
    isSystem: false,
    createdAt: '2025-01-15',
  },
];
