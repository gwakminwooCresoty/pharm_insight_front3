import { useState } from 'react';
import { Hash, CheckCircle2, XCircle, Download } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import KpiCard from '@/components/ui/KpiCard';
import DateRangePicker from '@/components/ui/DateRangePicker';
import MultiSelect from '@/components/ui/MultiSelect';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import { useAuth } from '@/hooks/useAuth';
import { useSetPageMeta, useSetPageFilters } from '@/hooks/usePageMeta';
import { shouldShowStoreSelector } from '@/utils/permissions';
import { formatKRW, formatNumber, formatDateTime } from '@/utils/formatters';
import { paginateArray } from '@/utils/dummy.helpers';
import {
  DUMMY_CARD_SUMMARY,
  DUMMY_APPROVALS,
  CARD_OPTIONS,
  type CardApproval,
  type ApprovalStatus,
} from '@/data/card.dummy';
import { STORE_OPTIONS } from '@/data/pos.dummy';

type StatusFilter = 'ALL' | ApprovalStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'APPROVED', label: '정상' },
  { value: 'CANCELLED', label: '취소' },
  { value: 'ERROR', label: '오류' },
];

function statusBadgeColor(status: ApprovalStatus) {
  if (status === 'APPROVED') return 'green' as const;
  if (status === 'CANCELLED') return 'orange' as const;
  return 'red' as const;
}

function statusLabel(status: ApprovalStatus) {
  if (status === 'APPROVED') return '정상';
  if (status === 'CANCELLED') return '취소';
  return '오류';
}

function rowClass(row: CardApproval): string {
  if (row.status === 'CANCELLED') return 'bg-orange-50';
  if (row.status === 'ERROR') return 'bg-red-50';
  return '';
}

export default function CardApprovalPage() {
  useSetPageMeta('카드승인 조회', '카드사별 매출·승인 내역 관리 (취소/오류 포함)');
  const { currentUser, can } = useAuth();
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [approvalNo, setApprovalNo] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const storeMode = currentUser ? shouldShowStoreSelector(currentUser.role) : 'hidden';

  const filtered = DUMMY_APPROVALS.filter((a) => {
    if (selectedCards.length > 0 && !selectedCards.includes(a.cardCompanyCode)) return false;
    if (selectedStores.length > 0 && !selectedStores.includes(a.storeId)) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (approvalNo && !a.approvalNo.includes(approvalNo)) return false;
    return true;
  });

  const paged = paginateArray(filtered, page, PAGE_SIZE);

  const totalApproved = filtered
    .filter((a) => a.status === 'APPROVED')
    .reduce((s, a) => s + a.amount, 0);
  const totalCancelled = filtered
    .filter((a) => a.status === 'CANCELLED')
    .reduce((s, a) => s + a.amount, 0);

  function handleCardSummaryClick(code: string) {
    setSelectedCards((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [code]
    );
    setPage(0);
  }

  useSetPageFilters(
    <div className="flex flex-wrap gap-4 items-end">
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
        label="조회 기간"
      />
      <MultiSelect
        options={CARD_OPTIONS}
        selected={selectedCards}
        onChange={(v) => { setSelectedCards(v); setPage(0); }}
        placeholder="카드사 전체"
        label="카드사"
      />
      {storeMode !== 'hidden' && (
        <MultiSelect
          options={STORE_OPTIONS}
          selected={selectedStores}
          onChange={(v) => { setSelectedStores(v); setPage(0); }}
          placeholder="매장 전체"
          label="매장 선택"
        />
      )}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-medium">승인 상태</span>
        <div className="flex gap-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setStatusFilter(opt.value); setPage(0); }}
              className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                statusFilter === opt.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-medium">승인번호</span>
        <input
          type="text"
          value={approvalNo}
          onChange={(e) => { setApprovalNo(e.target.value); setPage(0); }}
          placeholder="승인번호 검색"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
        />
      </div>
      <Button>조회</Button>
    </div>,
  );

  return (
    <PageContainer>

      {/* 카드사별 요약 카드 */}
      <div className="grid grid-cols-3 gap-2.5">
        {DUMMY_CARD_SUMMARY.map((card) => (
          <button
            key={card.cardCompanyCode}
            type="button"
            onClick={() => handleCardSummaryClick(card.cardCompanyCode)}
            className={`bg-white rounded-lg border p-3 text-left transition-all shadow-sm hover:border-blue-400 hover:shadow-md ${
              selectedCards.includes(card.cardCompanyCode)
                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-400'
                : 'border-gray-100'
            }`}
          >
            <p className="text-[11px] font-semibold text-gray-400 uppercase">{card.cardCompanyName}</p>
            <p className="text-[15px] font-bold text-gray-900 mt-1 leading-tight">
              {formatKRW(card.approvedAmount)}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">{formatNumber(card.approvedCount)}건</p>
          </button>
        ))}
      </div>

      {/* 승인 내역 테이블 */}
      <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">
            승인 내역
            <span className="text-gray-400 ml-2 font-normal">
              ({formatNumber(filtered.length)}건)
            </span>
          </h2>
          {can('EXPORT_DATA') && (
            <Button variant="secondary" size="sm">
              <Download size={13} />엑셀 다운로드
            </Button>
          )}
        </div>

        <Table<CardApproval>
          columns={[
            {
              key: 'approvedAt',
              header: '거래일시',
              render: (row) => (
                <span className="text-xs font-mono">{formatDateTime(row.approvedAt)}</span>
              ),
            },
            { key: 'cardCompanyName', header: '카드사' },
            { key: 'approvalNo', header: '승인번호', className: 'font-mono text-xs' },
            {
              key: 'amount',
              header: '승인금액',
              render: (row) => formatKRW(row.amount),
              className: 'text-right',
            },
            {
              key: 'installment',
              header: '할부',
              render: (row) =>
                row.installment === 0 ? '일시불' : `${row.installment}개월`,
              className: 'text-center',
            },
            {
              key: 'status',
              header: '상태',
              render: (row) => (
                <Badge color={statusBadgeColor(row.status)}>
                  {statusLabel(row.status)}
                </Badge>
              ),
            },
            { key: 'storeName', header: '매장' },
            {
              key: 'maskedCardNo',
              header: '카드번호',
              className: 'font-mono text-xs',
            },
          ]}
          data={paged.content}
          rowKey={(row) => row.approvalId}
          rowClassName={rowClass}
        />

        <Pagination
          page={page}
          totalPages={paged.totalPages}
          totalElements={paged.totalElements}
          size={PAGE_SIZE}
          onPageChange={setPage}
        />

        {/* 하단 집계 */}
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
          <KpiCard
            label="총 건수"
            value={formatNumber(filtered.length) + '건'}
            icon={<Hash size={15} />}
          />
          <KpiCard label="총 승인금액" value={formatKRW(totalApproved)} icon={<CheckCircle2 size={15} />} />
          <KpiCard label="총 취소금액" value={formatKRW(totalCancelled)} icon={<XCircle size={15} />} />
        </div>
      </div>
    </PageContainer>
  );
}
