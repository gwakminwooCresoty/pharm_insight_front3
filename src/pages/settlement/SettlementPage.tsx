import { useState } from 'react';
import { Banknote, Receipt, BarChart2, Download } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import KpiCard from '@/components/ui/KpiCard';
import DateRangePicker from '@/components/ui/DateRangePicker';
import MultiSelect from '@/components/ui/MultiSelect';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import PaymentDonutChart from '@/components/charts/PaymentDonutChart';
import PaymentStackBarChart from '@/components/charts/PaymentStackBarChart';
import { useAuth } from '@/hooks/useAuth';
import { useSetPageMeta, useSetPageFilters } from '@/hooks/usePageMeta';
import { shouldShowStoreSelector } from '@/utils/permissions';
import { formatKRW, formatNumber, formatRatio } from '@/utils/formatters';
import { DUMMY_SETTLEMENT, type PaymentBreakdown } from '@/data/settlement.dummy';
import { STORE_OPTIONS } from '@/data/pos.dummy';

type ViewMode = 'daily' | 'period';

const PAYMENT_TYPE_OPTIONS = [
  { value: 'CARD', label: '카드' },
  { value: 'CASH', label: '현금' },
  { value: 'POINT', label: '포인트' },
  { value: 'ETC', label: '기타' },
];

export default function SettlementPage() {
  useSetPageMeta('CR정산서 — 결제수단별 실적', '결제수단별 매출 구조 분석');
  const { currentUser, can } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('period');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  const storeMode = currentUser ? shouldShowStoreSelector(currentUser.role) : 'hidden';

  useSetPageFilters(
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-medium">조회 방식</span>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 text-sm transition-colors ${viewMode === 'daily' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            데일리
          </button>
          <button
            type="button"
            onClick={() => setViewMode('period')}
            className={`px-4 py-2 text-sm transition-colors ${viewMode === 'period' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            기간별
          </button>
        </div>
      </div>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
        label="조회 기간"
      />
      {storeMode !== 'hidden' && (
        <MultiSelect
          options={STORE_OPTIONS}
          selected={selectedStores}
          onChange={setSelectedStores}
          placeholder="매장 전체"
          label="매장 선택"
        />
      )}
      <MultiSelect
        options={PAYMENT_TYPE_OPTIONS}
        selected={selectedPayments}
        onChange={setSelectedPayments}
        placeholder="결제수단 전체"
        label="결제수단"
      />
      <Button>조회</Button>
    </div>,
  );

  const filteredBreakdown =
    selectedPayments.length === 0
      ? DUMMY_SETTLEMENT.breakdown
      : DUMMY_SETTLEMENT.breakdown.filter((b) =>
          selectedPayments.includes(b.paymentType)
        );

  const totalSales = filteredBreakdown.reduce((s, b) => s + b.sales, 0);
  const totalCount = filteredBreakdown.reduce((s, b) => s + b.count, 0);

  return (
    <PageContainer>
      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="총 매출액" value={formatKRW(totalSales)} icon={<Banknote size={15} />} />
        <KpiCard label="총 결제 건수" value={formatNumber(totalCount) + '건'} icon={<Receipt size={15} />} />
        <KpiCard
          label="건당 평균 금액"
          value={totalCount > 0 ? formatKRW(Math.floor(totalSales / totalCount)) : '0원'}
          icon={<BarChart2 size={15} />}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 도넛 차트 */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">결제수단별 구성비</h2>
          <PaymentDonutChart breakdown={filteredBreakdown} />
        </div>

        {/* 정산서 테이블 */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">정산서</h2>
            {can('EXPORT_DATA') && (
              <Button variant="secondary" size="sm">
                <Download size={13} />다운로드
              </Button>
            )}
          </div>
          <Table<PaymentBreakdown>
            columns={[
              { key: 'paymentName', header: '결제수단' },
              {
                key: 'sales',
                header: '매출액',
                render: (row) => formatKRW(row.sales),
                className: 'text-right',
              },
              {
                key: 'count',
                header: '건수',
                render: (row) => formatNumber(row.count) + '건',
                className: 'text-right',
              },
              {
                key: 'ratio',
                header: '구성비',
                render: (row) => formatRatio(row.ratio),
                className: 'text-right',
              },
              {
                key: 'avgAmount',
                header: '건당 평균',
                render: (row) => formatKRW(row.avgAmount),
                className: 'text-right',
              },
            ]}
            data={filteredBreakdown}
            rowKey={(row) => row.paymentType}
          />
          {/* 합계 행 */}
          <div className="border-t-2 border-gray-200 mt-2 pt-2 px-4 flex justify-between text-sm font-semibold text-gray-900">
            <span>합계</span>
            <span>{formatKRW(totalSales)}</span>
          </div>
        </div>
      </div>

      {/* 기간별 추이 차트 */}
      {viewMode === 'period' && (
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">기간별 결제수단 추이</h2>
          <PaymentStackBarChart dailyTrend={DUMMY_SETTLEMENT.dailyTrend} />
        </div>
      )}
    </PageContainer>
  );
}
