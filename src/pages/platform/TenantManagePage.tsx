import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PageContainer from '@/components/layout/PageContainer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import { paginateArray } from '@/utils/dummy.helpers';
import {
  DUMMY_FRANCHISES,
  type FranchiseSummary,
  type FranchiseStatus,
} from '@/data/platform.dummy';

type FormData = {
  franchiseName: string;
  bizRegNo: string;
  representativeName: string;
  contractStartDate: string;
  contractEndDate: string;
  maxStoreCount: number;
  adminEmail: string;
};

type StatusFormData = {
  status: FranchiseStatus;
  reason: string;
};

function statusBadge(status: FranchiseStatus) {
  if (status === 'ACTIVE') return <Badge color="green">활성</Badge>;
  if (status === 'SUSPENDED') return <Badge color="red">정지</Badge>;
  return <Badge color="gray">비활성</Badge>;
}

export default function TenantManagePage() {
  const [franchises, setFranchises] = useState<FranchiseSummary[]>(DUMMY_FRANCHISES);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FranchiseSummary | null>(null);
  const [statusTarget, setStatusTarget] = useState<FranchiseSummary | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const {
    register: registerStatus,
    handleSubmit: handleStatusSubmit,
    reset: resetStatus,
  } = useForm<StatusFormData>();

  const filtered = franchises.filter((f) => {
    if (keyword && !f.franchiseName.includes(keyword)) return false;
    if (statusFilter && f.status !== statusFilter) return false;
    return true;
  });
  const paged = paginateArray(filtered, page, PAGE_SIZE);

  function handleCreate(data: FormData) {
    const newFranchise: FranchiseSummary = {
      franchiseId: `FRAN-${String(franchises.length + 1).padStart(3, '0')}`,
      franchiseName: data.franchiseName,
      bizRegNo: data.bizRegNo,
      representativeName: data.representativeName,
      contractStartDate: data.contractStartDate,
      contractEndDate: data.contractEndDate,
      status: 'ACTIVE',
      storeCount: 0,
      userCount: 1,
      totalSales: 0,
      totalCustomerCount: 0,
      avgSpend: 0,
      salesRank: franchises.length + 1,
      salesGrowthRatio: 0,
      createdAt: new Date().toISOString(),
    };
    setFranchises((prev) => [newFranchise, ...prev]);
    reset();
    setCreateOpen(false);
  }

  function handleEdit(data: FormData) {
    if (!editTarget) return;
    setFranchises((prev) =>
      prev.map((f) =>
        f.franchiseId === editTarget.franchiseId
          ? { ...f, ...data }
          : f
      )
    );
    reset();
    setEditTarget(null);
  }

  function handleStatusChange(data: StatusFormData) {
    if (!statusTarget) return;
    setFranchises((prev) =>
      prev.map((f) =>
        f.franchiseId === statusTarget.franchiseId
          ? { ...f, status: data.status }
          : f
      )
    );
    resetStatus();
    setStatusTarget(null);
  }

  function openEdit(f: FranchiseSummary) {
    setEditTarget(f);
    reset({
      franchiseName: f.franchiseName,
      bizRegNo: f.bizRegNo,
      representativeName: f.representativeName,
      contractStartDate: f.contractStartDate,
      contractEndDate: f.contractEndDate,
      maxStoreCount: 50,
      adminEmail: '',
    });
  }

  return (
    <PageContainer
      title="테넌트 관리"
      subtitle="프랜차이즈 등록 및 계약 정보 관리"
      actions={
        <Button onClick={() => { reset(); setCreateOpen(true); }}>
          + 프랜차이즈 등록
        </Button>
      }
    >
      {/* 검색 필터 */}
      <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
        <div className="flex gap-3 items-end">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-medium">프랜차이즈명</span>
            <input
              type="text"
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
              placeholder="이름 검색"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-medium">상태</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">전체</option>
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
              <option value="SUSPENDED">정지</option>
            </select>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
        <Table<FranchiseSummary>
          columns={[
            { key: 'franchiseId', header: 'ID', className: 'font-mono text-xs' },
            { key: 'franchiseName', header: '프랜차이즈명' },
            {
              key: 'status',
              header: '상태',
              render: (row) => statusBadge(row.status),
            },
            {
              key: 'storeCount',
              header: '매장 수',
              render: (row) => row.storeCount + '개',
              className: 'text-right',
            },
            {
              key: 'userCount',
              header: '사용자 수',
              render: (row) => row.userCount + '명',
              className: 'text-right',
            },
            { key: 'representativeName', header: '대표자' },
            {
              key: 'contractEndDate',
              header: '계약 만료일',
            },
            {
              key: 'actions',
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
                    variant={row.status === 'ACTIVE' ? 'danger' : 'secondary'}
                    onClick={(e) => {
                      (e as React.MouseEvent).stopPropagation();
                      setStatusTarget(row);
                      resetStatus({ status: row.status, reason: '' });
                    }}
                  >
                    상태변경
                  </Button>
                </div>
              ),
            },
          ]}
          data={paged.content}
          rowKey={(row) => row.franchiseId}
        />
        <Pagination
          page={page}
          totalPages={paged.totalPages}
          totalElements={paged.totalElements}
          size={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      {/* 생성 모달 */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="프랜차이즈 등록"
        size="lg"
      >
        <FranchiseForm
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          isCreate
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        title="프랜차이즈 수정"
        size="lg"
      >
        <FranchiseForm
          onSubmit={handleEdit}
          onCancel={() => setEditTarget(null)}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          isCreate={false}
        />
      </Modal>

      {/* 상태 변경 모달 */}
      <Modal
        open={statusTarget !== null}
        onClose={() => setStatusTarget(null)}
        title={`상태 변경 — ${statusTarget?.franchiseName}`}
      >
        <form
          onSubmit={handleStatusSubmit(handleStatusChange)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">변경할 상태</label>
            <select
              {...registerStatus('status', { required: true })}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVE">활성 (ACTIVE)</option>
              <option value="INACTIVE">비활성 (INACTIVE)</option>
              <option value="SUSPENDED">정지 (SUSPENDED)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">사유</label>
            <input
              type="text"
              {...registerStatus('reason')}
              placeholder="상태 변경 사유 입력"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="secondary" onClick={() => setStatusTarget(null)} type="button">
              취소
            </Button>
            <Button type="submit">변경 적용</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}

// 폼 컴포넌트
interface FranchiseFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  register: ReturnType<typeof useForm<FormData>>['register'];
  handleSubmit: ReturnType<typeof useForm<FormData>>['handleSubmit'];
  errors: ReturnType<typeof useForm<FormData>>['formState']['errors'];
  isCreate: boolean;
}

function FranchiseForm({ onSubmit, onCancel, register, handleSubmit, errors, isCreate }: FranchiseFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-sm font-medium text-gray-700">프랜차이즈명 *</label>
          <input
            type="text"
            {...register('franchiseName', { required: '필수 입력항목입니다.' })}
            placeholder="○○약국 체인"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.franchiseName && (
            <span className="text-xs text-red-500">{errors.franchiseName.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">사업자등록번호 *</label>
          <input
            type="text"
            {...register('bizRegNo', { required: '필수 입력항목입니다.' })}
            placeholder="000-00-00000"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.bizRegNo && (
            <span className="text-xs text-red-500">{errors.bizRegNo.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">대표자명 *</label>
          <input
            type="text"
            {...register('representativeName', { required: '필수 입력항목입니다.' })}
            placeholder="홍길동"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.representativeName && (
            <span className="text-xs text-red-500">{errors.representativeName.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">계약 시작일 *</label>
          <input
            type="date"
            {...register('contractStartDate', { required: '필수 입력항목입니다.' })}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">계약 종료일 *</label>
          <input
            type="date"
            {...register('contractEndDate', { required: '필수 입력항목입니다.' })}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {isCreate && (
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-sm font-medium text-gray-700">관리자 이메일 *</label>
            <input
              type="email"
              {...register('adminEmail', { required: isCreate ? '필수 입력항목입니다.' : false })}
              placeholder="admin@franchise.com"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.adminEmail && (
              <span className="text-xs text-red-500">{errors.adminEmail.message}</span>
            )}
          </div>
        )}
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
