import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PageContainer from '@/components/layout/PageContainer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/utils/permissions';
import { paginateArray } from '@/utils/dummy.helpers';
import {
  DUMMY_PLATFORM_USERS,
  DUMMY_FRANCHISES,
  type PlatformUser,
  type UserStatus,
  type UserRole,
} from '@/data/platform.dummy';
import { STORE_OPTIONS } from '@/data/pos.dummy';

type InviteFormData = {
  email: string;
  name: string;
  role: UserRole;
  storeId: string;
  regionId: string;
};

type RoleFormData = {
  role: UserRole;
  storeId: string;
};

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'FRANCHISE_ADMIN', label: '프랜차이즈 관리자' },
  { value: 'FRANCHISE_VIEWER', label: '프랜차이즈 열람자' },
  { value: 'REGION_MANAGER', label: '지역 관리자' },
  { value: 'STORE_MANAGER', label: '매장 관리자' },
  { value: 'STORE_STAFF', label: '매장 직원' },
];

const FRANCHISE_OPTIONS = DUMMY_FRANCHISES.slice(0, 5).map((f) => ({
  value: f.franchiseId,
  label: f.franchiseName,
}));

function statusBadge(status: UserStatus) {
  return status === 'ACTIVE' ? (
    <Badge color="green">활성</Badge>
  ) : (
    <Badge color="gray">비활성</Badge>
  );
}

export default function UserManagePage() {
  const { currentUser } = useAuth();
  const isPlatformAdmin = currentUser?.role === 'PLATFORM_ADMIN';

  const [users, setUsers] = useState<PlatformUser[]>(DUMMY_PLATFORM_USERS);
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [franchiseFilter, setFranchiseFilter] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleTarget, setRoleTarget] = useState<PlatformUser | null>(null);
  const [statusTarget, setStatusTarget] = useState<PlatformUser | null>(null);

  const {
    register: registerInvite,
    handleSubmit: handleInviteSubmit,
    watch: watchInvite,
    reset: resetInvite,
    formState: { errors: inviteErrors },
  } = useForm<InviteFormData>({ defaultValues: { role: 'STORE_MANAGER' } });

  const {
    register: registerRole,
    handleSubmit: handleRoleSubmit,
    watch: watchRole,
    reset: resetRole,
  } = useForm<RoleFormData>({ defaultValues: { role: 'STORE_MANAGER' } });

  const inviteRole = watchInvite('role');
  const editRole = watchRole('role');

  const filtered = users.filter((u) => {
    if (keyword && !u.name.includes(keyword) && !u.email.includes(keyword)) return false;
    if (roleFilter && u.role !== roleFilter) return false;
    if (!isPlatformAdmin && u.role === 'PLATFORM_ADMIN') return false;
    if (isPlatformAdmin && franchiseFilter && u.franchiseId !== franchiseFilter) return false;
    if (!isPlatformAdmin && currentUser?.franchiseId && u.franchiseId !== currentUser.franchiseId) return false;
    return true;
  });

  const paged = paginateArray(filtered, page, PAGE_SIZE);

  function handleInvite(data: InviteFormData) {
    const franchiseId = currentUser?.franchiseId ?? (franchiseFilter || 'FRAN-001');
    const franchise = DUMMY_FRANCHISES.find((f) => f.franchiseId === franchiseId);
    const newUser: PlatformUser = {
      userId: `USER-${String(users.length + 1).padStart(3, '0')}`,
      name: data.name,
      email: data.email,
      role: data.role,
      franchiseId,
      franchiseName: franchise?.franchiseName ?? null,
      storeId: data.storeId || null,
      storeName: STORE_OPTIONS.find((s) => s.value === data.storeId)?.label ?? null,
      status: 'ACTIVE',
      lastLoginAt: '-',
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
    resetInvite();
    setInviteOpen(false);
  }

  function handleRoleChange(data: RoleFormData) {
    if (!roleTarget) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.userId === roleTarget.userId ? { ...u, role: data.role, storeId: data.storeId || null } : u
      )
    );
    resetRole();
    setRoleTarget(null);
  }

  function handleStatusToggle() {
    if (!statusTarget) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.userId === statusTarget.userId
          ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : u
      )
    );
    setStatusTarget(null);
  }

  return (
    <PageContainer
      title="사용자 및 권한 관리"
      subtitle={isPlatformAdmin ? '전체 플랫폼 사용자 관리' : `${currentUser?.franchiseName} 소속 사용자 관리`}
      actions={
        <Button onClick={() => { resetInvite(); setInviteOpen(true); }}>
          + 사용자 초대
        </Button>
      }
    >
      {/* 검색 필터 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {isPlatformAdmin && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 font-medium">프랜차이즈</span>
              <select
                value={franchiseFilter}
                onChange={(e) => { setFranchiseFilter(e.target.value); setPage(0); }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                {FRANCHISE_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-medium">역할</span>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">전체</option>
              {(isPlatformAdmin
                ? [{ value: 'PLATFORM_ADMIN', label: '플랫폼 관리자' }, ...ROLE_OPTIONS]
                : ROLE_OPTIONS
              ).map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-medium">이름/이메일 검색</span>
            <input
              type="text"
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
              placeholder="검색..."
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <Table<PlatformUser>
          columns={[
            { key: 'name', header: '이름' },
            { key: 'email', header: '이메일', className: 'text-xs font-mono' },
            {
              key: 'role',
              header: '역할',
              render: (row) => (
                <Badge color={row.role === 'PLATFORM_ADMIN' ? 'blue' : 'gray'}>
                  {ROLE_LABELS[row.role]}
                </Badge>
              ),
            },
            {
              key: 'franchiseName',
              header: '프랜차이즈',
              render: (row) => row.franchiseName ?? '-',
            },
            {
              key: 'storeName',
              header: '매장',
              render: (row) => row.storeName ?? '-',
            },
            {
              key: 'status',
              header: '상태',
              render: (row) => statusBadge(row.status),
            },
            {
              key: 'lastLoginAt',
              header: '최근 로그인',
              render: (row) => (
                <span className="text-xs text-gray-500">{row.lastLoginAt.replace('T', ' ')}</span>
              ),
            },
            {
              key: 'actions',
              header: '관리',
              render: (row) =>
                row.role === 'PLATFORM_ADMIN' ? (
                  <span className="text-xs text-gray-300">-</span>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        (e as React.MouseEvent).stopPropagation();
                        setRoleTarget(row);
                        resetRole({ role: row.role, storeId: row.storeId ?? '' });
                      }}
                    >
                      권한수정
                    </Button>
                    <Button
                      size="sm"
                      variant={row.status === 'ACTIVE' ? 'danger' : 'secondary'}
                      onClick={(e) => {
                        (e as React.MouseEvent).stopPropagation();
                        setStatusTarget(row);
                      }}
                    >
                      {row.status === 'ACTIVE' ? '비활성화' : '활성화'}
                    </Button>
                  </div>
                ),
            },
          ]}
          data={paged.content}
          rowKey={(row) => row.userId}
        />
        <Pagination
          page={page}
          totalPages={paged.totalPages}
          totalElements={paged.totalElements}
          size={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      {/* 사용자 초대 모달 */}
      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="사용자 초대"
        size="md"
      >
        <form onSubmit={handleInviteSubmit(handleInvite)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">이메일 *</label>
            <input
              type="email"
              {...registerInvite('email', { required: '필수 항목입니다.' })}
              placeholder="user@franchise.com"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {inviteErrors.email && (
              <span className="text-xs text-red-500">{inviteErrors.email.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">이름 *</label>
            <input
              type="text"
              {...registerInvite('name', { required: '필수 항목입니다.' })}
              placeholder="홍길동"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {inviteErrors.name && (
              <span className="text-xs text-red-500">{inviteErrors.name.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">역할 *</label>
            <select
              {...registerInvite('role', { required: true })}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          {(inviteRole === 'STORE_MANAGER' || inviteRole === 'STORE_STAFF') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">매장 *</label>
              <select
                {...registerInvite('storeId', { required: true })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">매장 선택</option>
                {STORE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          )}
          {inviteRole === 'REGION_MANAGER' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">지역 *</label>
              <select
                {...registerInvite('regionId')}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="REGION-01">강남 지역</option>
                <option value="REGION-02">강북 지역</option>
              </select>
            </div>
          )}
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="secondary" onClick={() => setInviteOpen(false)} type="button">취소</Button>
            <Button type="submit">초대 발송</Button>
          </div>
        </form>
      </Modal>

      {/* 권한 수정 모달 */}
      <Modal
        open={roleTarget !== null}
        onClose={() => setRoleTarget(null)}
        title={`권한 수정 — ${roleTarget?.name}`}
      >
        <form onSubmit={handleRoleSubmit(handleRoleChange)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">역할</label>
            <select
              {...registerRole('role')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          {(editRole === 'STORE_MANAGER' || editRole === 'STORE_STAFF') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">매장</label>
              <select
                {...registerRole('storeId')}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">매장 선택</option>
                {STORE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="secondary" onClick={() => setRoleTarget(null)} type="button">취소</Button>
            <Button type="submit">저장</Button>
          </div>
        </form>
      </Modal>

      {/* 상태 변경 확인 모달 */}
      <Modal
        open={statusTarget !== null}
        onClose={() => setStatusTarget(null)}
        title="사용자 상태 변경"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-700">
            <strong>{statusTarget?.name}</strong> 님을{' '}
            <strong>{statusTarget?.status === 'ACTIVE' ? '비활성화' : '활성화'}</strong>{' '}
            하시겠습니까?
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setStatusTarget(null)}>취소</Button>
            <Button
              variant={statusTarget?.status === 'ACTIVE' ? 'danger' : 'primary'}
              onClick={handleStatusToggle}
            >
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
