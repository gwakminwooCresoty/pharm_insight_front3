import { useState } from 'react';
import { Hash, CheckCircle2, XCircle, FileSpreadsheet, Trophy } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import DateRangePicker from '@/components/ui/DateRangePicker';
import MultiSelect from '@/components/ui/MultiSelect';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import { useAuth } from '@/hooks/useAuth';
import { useSetPageMeta, useSetPageFilters, useSetPageFooter } from '@/hooks/usePageMeta';
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

  useSetPageFooter(
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2.5">
        <Hash size={16} className="text-gray-400 shrink-0" />
        <div>
          <div className="text-[11px] text-gray-400 font-medium leading-none mb-1">총 건수</div>
          <div className="text-base font-bold text-gray-900 leading-none">{formatNumber(filtered.length)}건</div>
        </div>
      </div>
      <div className="w-px h-8 bg-gray-200" />
      <div className="flex items-center gap-2.5">
        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
        <div>
          <div className="text-[11px] text-gray-400 font-medium leading-none mb-1">총 승인금액</div>
          <div className="text-base font-bold text-gray-900 leading-none">{formatKRW(totalApproved)}</div>
        </div>
      </div>
      <div className="w-px h-8 bg-gray-200" />
      <div className="flex items-center gap-2.5">
        <XCircle size={16} className="text-red-400 shrink-0" />
        <div>
          <div className="text-[11px] text-gray-400 font-medium leading-none mb-1">총 취소금액</div>
          <div className="text-base font-bold text-red-500 leading-none">{formatKRW(totalCancelled)}</div>
        </div>
      </div>
    </div>,
  );

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
        <span className="text-xs text-slate-500 font-medium">승인 상태</span>
        <div className="flex gap-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setStatusFilter(opt.value); setPage(0); }}
              className={`px-3 py-2 rounded-lg text-sm border transition-colors ${statusFilter === opt.value
                ? 'bg-primary-600 text-white ring-primary-600 shadow-sm'
                : 'ring-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-slate-500 font-medium">승인번호</span>
        <input
          type="text"
          value={approvalNo}
          onChange={(e) => { setApprovalNo(e.target.value); setPage(0); }}
          placeholder="승인번호 검색"
          className="ring-1 ring-slate-200 rounded-[var(--radius-button)] px-3 py-2 text-sm bg-white hover:ring-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 transition-all w-32"
        />
      </div>
      <Button>조회</Button>
      {can('EXPORT_DATA') && (
        <div>
          <Button variant="excel">
            <FileSpreadsheet size={13} />엑셀 다운로드
          </Button>
        </div>
      )}
    </div>,
  );

  const top3 = [...DUMMY_CARD_SUMMARY]
    .sort((a, b) => b.approvedAmount - a.approvedAmount)
    .slice(0, 3);

  const rankStyle = [
    'text-amber-600 bg-amber-50 border-amber-300',
    'text-slate-500 bg-slate-50 border-slate-300',
    'text-orange-700 bg-orange-50 border-orange-300',
  ];

  return (
    <PageContainer>
      <div className="flex gap-3 items-start">

        {/* 승인 내역 테이블 */}
        <div className="flex-1 min-w-0 bg-white rounded-[var(--radius-card)] border border-slate-100 p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            승인 내역
            <span className="text-gray-400 ml-2 font-normal">
              ({formatNumber(filtered.length)}건)
            </span>
          </h2>

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
        </div>

        {/* 카드사 매출 TOP 3 - 오른쪽 컬럼 */}
        <div className="w-40 shrink-0 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Trophy size={12} className="text-amber-500" />
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              매출 TOP 3
            </span>
          </div>
          {top3.map((card, idx) => (
            <button
              key={card.cardCompanyCode}
              type="button"
              onClick={() => handleCardSummaryClick(card.cardCompanyCode)}
              className={`bg-white rounded-[var(--radius-card)] border px-3 py-2 text-left transition-all shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-primary-400 ${selectedCards.includes(card.cardCompanyCode)
                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-400'
                : 'border-slate-100'
                }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[11px] font-semibold text-gray-500">{card.cardCompanyName}</p>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${rankStyle[idx]}`}>
                  {idx + 1}위
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {formatKRW(card.approvedAmount)}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">{formatNumber(card.approvedCount)}건</p>
            </button>
          ))}
        </div>

      </div>
    </PageContainer>
  );
}
