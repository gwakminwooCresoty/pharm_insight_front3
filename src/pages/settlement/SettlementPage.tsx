import { useState } from 'react';
import { Banknote, Receipt, BarChart2, Download } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
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

// --- 매장별 정산 현황 ---
type StoreRow = {
  storeId: string;
  storeName: string;
  totalSales: number;
  cardRatio: number;
  transactionCount: number;
  avgAmount: number;
};
const STORE_SETTLEMENT: StoreRow[] = [
  { storeId: 'STORE-001', storeName: '강남점', totalSales: 48_200_000, cardRatio: 0.78, transactionCount: 1420, avgAmount: 33944 },
  { storeId: 'STORE-002', storeName: '서초점', totalSales: 35_800_000, cardRatio: 0.82, transactionCount: 1050, avgAmount: 34095 },
  { storeId: 'STORE-003', storeName: '송파점', totalSales: 28_600_000, cardRatio: 0.71, transactionCount: 890,  avgAmount: 32135 },
  { storeId: 'STORE-004', storeName: '마포점', totalSales: 22_400_000, cardRatio: 0.69, transactionCount: 720,  avgAmount: 31111 },
  { storeId: 'STORE-005', storeName: '종로점', totalSales: 19_000_000, cardRatio: 0.74, transactionCount: 580,  avgAmount: 32758 },
];

// --- 시간대별 매출 현황 ---
const MAX_SLOT_SALES = 44_800_000;
const TIME_SLOTS = [
  { key: 'morning',   label: '오전 09-12시', sales: 21_500_000, barRatio: 21_500_000 / MAX_SLOT_SALES, cardRatio: 0.71 },
  { key: 'lunch',     label: '점심 12-14시', sales: 38_200_000, barRatio: 38_200_000 / MAX_SLOT_SALES, cardRatio: 0.83 },
  { key: 'afternoon', label: '오후 14-18시', sales: 44_800_000, barRatio: 1,                            cardRatio: 0.76 },
  { key: 'evening',   label: '저녁 18-21시', sales: 27_500_000, barRatio: 27_500_000 / MAX_SLOT_SALES, cardRatio: 0.80 },
  { key: 'night',     label: '야간 21시-',   sales:  4_000_000, barRatio:  4_000_000 / MAX_SLOT_SALES, cardRatio: 0.62 },
];

// --- 결제수단별 전주 대비 ---
const WOW_DATA = [
  { paymentType: 'CARD',  paymentName: '카드',   sales: 97_200_000, change:  6.2 },
  { paymentType: 'CASH',  paymentName: '현금',   sales: 22_400_000, change: -7.1 },
  { paymentType: 'POINT', paymentName: '포인트', sales: 11_800_000, change:  8.3 },
  { paymentType: 'ETC',   paymentName: '기타',   sales:  4_600_000, change: -4.2 },
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

      {/* Row 1: 도넛 차트 + 정산서 + KPI */}
      <div className="grid grid-cols-2 gap-4">
        {/* 도넛 차트 */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">결제수단별 구성비</h2>
          <PaymentDonutChart breakdown={filteredBreakdown} />
        </div>

        {/* 정산서 테이블 + KPI 세로 컬럼 */}
        <div className="flex gap-3 items-stretch">
          {/* 정산서 테이블 */}
          <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
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

          {/* KPI 세로 3개 */}
          <div className="w-48 shrink-0 grid grid-rows-3 gap-2">

            {/* 총 매출액 */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              <div className="px-4 py-2.5 flex items-center gap-2 bg-blue-50/60 border-b border-blue-100/60">
                <span className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center shrink-0">
                  <Banknote size={11} className="text-blue-600" />
                </span>
                <span className="text-[11px] text-blue-600 font-semibold tracking-wide">총 매출액</span>
              </div>
              <div className="flex-1 flex items-center px-4">
                <span className="text-[20px] font-bold text-gray-900 whitespace-nowrap leading-none">
                  {formatKRW(totalSales)}
                </span>
              </div>
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
                <span className="text-[11px] text-gray-400">결제수단 {filteredBreakdown.length}개 합산</span>
              </div>
            </div>

            {/* 총 결제 건수 */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              <div className="px-4 py-2.5 flex items-center gap-2 bg-emerald-50/60 border-b border-emerald-100/60">
                <span className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
                  <Receipt size={11} className="text-emerald-600" />
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold tracking-wide">총 결제 건수</span>
              </div>
              <div className="flex-1 flex items-center px-4">
                <span className="text-[20px] font-bold text-gray-900 whitespace-nowrap leading-none">
                  {formatNumber(totalCount)}건
                </span>
              </div>
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
                <span className="text-[11px] text-gray-400">
                  건당 평균 {totalCount > 0 ? formatKRW(Math.floor(totalSales / totalCount)) : '0원'}
                </span>
              </div>
            </div>

            {/* 건당 평균 금액 */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              <div className="px-4 py-2.5 flex items-center gap-2 bg-violet-50/60 border-b border-violet-100/60">
                <span className="w-5 h-5 rounded-md bg-violet-100 flex items-center justify-center shrink-0">
                  <BarChart2 size={11} className="text-violet-600" />
                </span>
                <span className="text-[11px] text-violet-600 font-semibold tracking-wide">건당 평균 금액</span>
              </div>
              <div className="flex-1 flex items-center px-4">
                <span className="text-[20px] font-bold text-gray-900 whitespace-nowrap leading-none">
                  {totalCount > 0 ? formatKRW(Math.floor(totalSales / totalCount)) : '0원'}
                </span>
              </div>
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
                <span className="text-[11px] text-gray-400">총 {formatNumber(totalCount)}건 기준</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Row 2: 매장별 정산 현황 + 시간대별 매출 분포 */}
      <div className="grid grid-cols-5 gap-4">

        {/* 매장별 정산 현황 */}
        <div className="col-span-3 bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">매장별 정산 현황</h2>
          <Table<StoreRow>
            columns={[
              { key: 'storeName', header: '매장' },
              {
                key: 'totalSales',
                header: '매출액',
                render: (row) => formatKRW(row.totalSales),
                className: 'text-right',
              },
              {
                key: 'cardRatio',
                header: '카드 비율',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${row.cardRatio * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-7 text-right shrink-0">
                      {(row.cardRatio * 100).toFixed(0)}%
                    </span>
                  </div>
                ),
              },
              {
                key: 'transactionCount',
                header: '건수',
                render: (row) => formatNumber(row.transactionCount) + '건',
                className: 'text-right',
              },
              {
                key: 'avgAmount',
                header: '건당 평균',
                render: (row) => formatKRW(row.avgAmount),
                className: 'text-right',
              },
            ]}
            data={STORE_SETTLEMENT}
            rowKey={(row) => row.storeId}
          />
        </div>

        {/* 시간대별 매출 분포 */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">시간대별 매출 현황</h2>
          <div className="flex flex-col gap-3.5">
            {TIME_SLOTS.map((slot) => (
              <div key={slot.key}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-xs text-gray-600">{slot.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-400">카드 {(slot.cardRatio * 100).toFixed(0)}%</span>
                    <span className="text-xs font-semibold text-gray-800">{formatKRW(slot.sales)}</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-400"
                    style={{ width: `${slot.barRatio * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: 결제수단별 전주 대비 변화 */}
      <div className="grid grid-cols-4 gap-4">
        {WOW_DATA.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div key={item.paymentType} className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">
                  {item.paymentName}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                }`}>
                  {isUp ? '▲' : '▼'} {Math.abs(item.change).toFixed(1)}%
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900 whitespace-nowrap leading-none mb-2">
                {formatKRW(item.sales)}
              </div>
              <div className="flex items-center gap-1">
                <div className="flex-1 h-1 rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${isUp ? 'bg-emerald-400' : 'bg-red-300'}`}
                    style={{ width: `${Math.min(Math.abs(item.change) * 8, 100)}%` }}
                  />
                </div>
                <span className="text-[11px] text-gray-400 shrink-0">전주 대비</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 4: 기간별 추이 차트 */}
      {viewMode === 'period' && (
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">기간별 결제수단 추이</h2>
          <PaymentStackBarChart dailyTrend={DUMMY_SETTLEMENT.dailyTrend} />
        </div>
      )}

    </PageContainer>
  );
}
