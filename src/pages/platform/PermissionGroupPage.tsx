import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ShieldCheck, Lock } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import { useSetPageMeta, useSetPageFilters } from '@/hooks/usePageMeta';
import {
  PERMISSION_MENUS,
  DUMMY_PERMISSION_GROUPS,
  type PermissionGroup,
} from '@/data/permission.dummy';

type GroupFormData = {
  name: string;
  description: string;
};

// ─── 메뉴 체크박스 (계층형) ─────────────────────────────────────────────────

function MenuCheckboxGroup({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const rootMenus = PERMISSION_MENUS.filter((m) => m.parentId === null);
  const getChildren = (parentId: string) =>
    PERMISSION_MENUS.filter((m) => m.parentId === parentId);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
      {rootMenus.map((menu) => {
        const children = getChildren(menu.id);
        return (
          <div key={menu.id}>
            <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 bg-white">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={selected.includes(menu.id)}
                onChange={() => toggle(menu.id)}
              />
              <span className="text-sm font-medium text-gray-800">{menu.label}</span>
              {menu.isDefault && (
                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">기본</span>
              )}
            </label>
            {children.map((child) => (
              <label
                key={child.id}
                className="flex items-center gap-3 px-4 py-2.5 pl-10 cursor-pointer hover:bg-blue-50/40 bg-gray-50/50 border-t border-gray-100"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={selected.includes(child.id)}
                  onChange={() => toggle(child.id)}
                />
                <span className="text-sm text-gray-600">└ {child.label}</span>
              </label>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── 그룹 등록/수정 폼 ──────────────────────────────────────────────────────

interface GroupFormProps {
  onSubmit: (data: GroupFormData) => void;
  onCancel: () => void;
  register: ReturnType<typeof useForm<GroupFormData>>['register'];
  handleSubmit: ReturnType<typeof useForm<GroupFormData>>['handleSubmit'];
  errors: ReturnType<typeof useForm<GroupFormData>>['formState']['errors'];
  selectedMenus: string[];
  onMenuChange: (ids: string[]) => void;
  isCreate: boolean;
}

function GroupForm({
  onSubmit,
  onCancel,
  register,
  handleSubmit,
  errors,
  selectedMenus,
  onMenuChange,
  isCreate,
}: GroupFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">그룹명 *</label>
        <input
          type="text"
          {...register('name', { required: '필수 입력항목입니다.' })}
          placeholder="예: 프리미엄 분석 그룹"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">설명</label>
        <input
          type="text"
          {...register('description')}
          placeholder="이 그룹의 목적을 간략히 설명해주세요"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">포함 메뉴</label>
          <span className="text-xs text-gray-400">{selectedMenus.length}개 선택됨</span>
        </div>
        <MenuCheckboxGroup selected={selectedMenus} onChange={onMenuChange} />
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <Button variant="secondary" onClick={onCancel} type="button">
          취소
        </Button>
        <Button type="submit">{isCreate ? '등록' : '수정 저장'}</Button>
      </div>
    </form>
  );
}

// ─── 메인 페이지 ────────────────────────────────────────────────────────────

export default function PermissionGroupPage() {
  useSetPageMeta('권한 그룹 관리', '프랜차이즈에 부여할 권한 그룹을 정의·관리합니다');

  const [groups, setGroups] = useState<PermissionGroup[]>(DUMMY_PERMISSION_GROUPS);
  const [keyword, setKeyword] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PermissionGroup | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PermissionGroup | null>(null);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GroupFormData>();

  useSetPageFilters(
    <div className="flex gap-3 items-end">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-medium">그룹명</span>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="그룹명 검색"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="ml-auto">
        <Button
          onClick={() => {
            reset({ name: '', description: '' });
            setSelectedMenus([]);
            setCreateOpen(true);
          }}
        >
          + 그룹 등록
        </Button>
      </div>
    </div>,
  );

  const menuLabel = (id: string) =>
    PERMISSION_MENUS.find((m) => m.id === id)?.label ?? id;

  const filtered = groups.filter(
    (g) => !keyword || g.name.includes(keyword) || g.description.includes(keyword),
  );

  function handleCreate(data: GroupFormData) {
    const newGroup: PermissionGroup = {
      id: `g_${Date.now()}`,
      name: data.name,
      description: data.description,
      menuIds: selectedMenus,
      isSystem: false,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setGroups((prev) => [newGroup, ...prev]);
    setCreateOpen(false);
    reset();
    setSelectedMenus([]);
  }

  function handleEdit(data: GroupFormData) {
    if (!editTarget) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === editTarget.id
          ? { ...g, name: data.name, description: data.description, menuIds: selectedMenus }
          : g,
      ),
    );
    setEditTarget(null);
    reset();
    setSelectedMenus([]);
  }

  function openEdit(group: PermissionGroup) {
    setEditTarget(group);
    setSelectedMenus([...group.menuIds]);
    reset({ name: group.name, description: group.description });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setGroups((prev) => prev.filter((g) => g.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <PageContainer>
      {/* 통계 요약 행 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 px-5 py-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <ShieldCheck size={18} className="text-blue-600" />
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium mb-0.5">전체 권한 그룹</div>
            <div className="text-2xl font-bold text-gray-900">{groups.length}개</div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 px-5 py-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
            <Lock size={18} className="text-slate-500" />
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium mb-0.5">시스템 그룹</div>
            <div className="text-2xl font-bold text-gray-900">
              {groups.filter((g) => g.isSystem).length}개
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 px-5 py-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
            <ShieldCheck size={18} className="text-violet-500" />
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium mb-0.5">커스텀 그룹</div>
            <div className="text-2xl font-bold text-gray-900">
              {groups.filter((g) => !g.isSystem).length}개
            </div>
          </div>
        </div>
      </div>

      {/* 그룹 테이블 */}
      <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
        <Table<PermissionGroup>
          columns={[
            {
              key: 'name',
              header: '그룹명',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                    {row.isSystem
                      ? <Lock size={12} className="text-slate-500" />
                      : <ShieldCheck size={12} className="text-blue-500" />
                    }
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{row.name}</div>
                    {row.description && (
                      <div className="text-xs text-gray-400 mt-0.5">{row.description}</div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: 'isSystem',
              header: '구분',
              render: (row) => (
                <Badge color={row.isSystem ? 'blue' : 'gray'}>
                  {row.isSystem ? '시스템' : '커스텀'}
                </Badge>
              ),
            },
            {
              key: 'menuIds',
              header: '포함 메뉴',
              render: (row) => (
                <div className="flex flex-wrap gap-1">
                  {row.menuIds.length === 0
                    ? <span className="text-xs text-gray-400">없음</span>
                    : row.menuIds.map((id) => (
                      <span
                        key={id}
                        className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium"
                      >
                        {menuLabel(id)}
                      </span>
                    ))
                  }
                </div>
              ),
            },
            {
              key: 'menuIds',
              header: '메뉴 수',
              render: (row) => (
                <span className="text-sm text-gray-600 font-medium">{row.menuIds.length}개</span>
              ),
              className: 'text-center',
            },
            {
              key: 'createdAt',
              header: '등록일',
              className: 'text-sm text-gray-500',
            },
            {
              key: 'id',
              header: '관리',
              render: (row) => (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      (e as React.MouseEvent).stopPropagation();
                      openEdit(row);
                    }}
                  >
                    수정
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={row.isSystem}
                    title={row.isSystem ? '시스템 그룹은 삭제할 수 없습니다' : undefined}
                    onClick={(e) => {
                      (e as React.MouseEvent).stopPropagation();
                      setDeleteTarget(row);
                    }}
                  >
                    삭제
                  </Button>
                </div>
              ),
            },
          ]}
          data={filtered}
          rowKey={(row) => row.id}
        />
      </div>

      {/* 등록 모달 */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="권한 그룹 등록"
        size="lg"
      >
        <GroupForm
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          selectedMenus={selectedMenus}
          onMenuChange={setSelectedMenus}
          isCreate
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal
        open={editTarget !== null}
        onClose={() => { setEditTarget(null); reset(); setSelectedMenus([]); }}
        title={`권한 그룹 수정 — ${editTarget?.name ?? ''}`}
        size="lg"
      >
        <GroupForm
          onSubmit={handleEdit}
          onCancel={() => { setEditTarget(null); reset(); setSelectedMenus([]); }}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          selectedMenus={selectedMenus}
          onMenuChange={setSelectedMenus}
          isCreate={false}
        />
      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="권한 그룹 삭제"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-700">
            <strong className="text-gray-900">{deleteTarget?.name}</strong> 그룹을 삭제하면
            이 그룹이 적용된 프랜차이즈의 권한에 영향을 미칠 수 있습니다. 계속하시겠습니까?
          </p>
          {deleteTarget && deleteTarget.menuIds.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
              포함된 메뉴 {deleteTarget.menuIds.length}개 ({deleteTarget.menuIds.map(menuLabel).join(', ')})의
              접근 권한이 영향을 받습니다.
            </div>
          )}
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              취소
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              삭제
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
