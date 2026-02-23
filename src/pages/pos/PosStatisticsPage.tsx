import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, ShoppingBag, FileSpreadsheet } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import KpiCard from '@/components/ui/KpiCard';
import DateRangePicker from '@/components/ui/DateRangePicker';
import MultiSelect from '@/components/ui/MultiSelect';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import TrendLineChart from '@/components/charts/TrendLineChart';
import { useAuth } from '@/hooks/useAuth';
import { useSetPageMeta, useSetPageFilters } from '@/hooks/usePageMeta';
import { shouldShowStoreSelector } from '@/utils/permissions';
import { formatKRW, formatNumber, formatRatio } from '@/utils/formatters';
import { paginateArray } from '@/utils/dummy.helpers';
import {
  DUMMY_POS_SUMMARY,
  DUMMY_TREND_HOUR,
  DUMMY_TREND_DATE,
  DUMMY_TREND_WEEKDAY,
  DUMMY_TREND_PERIOD,
  DUMMY_ITEMS,
  STORE_OPTIONS,
  type ItemRank,
} from '@/data/pos.dummy';

type AxisType = 'HOUR' | 'DATE' | 'WEEKDAY' | 'PERIOD';
type CategoryCode = 'ALL' | 'OTC' | 'RX' | 'ETC';

const AXIS_OPTIONS: { value: AxisType; label: string }[] = [
  { value: 'HOUR', label: '시간대별' },
  { value: 'DATE', label: '일자별' },
  { value: 'WEEKDAY', label: '요일별' },
  { value: 'PERIOD', label: '기간별' },
];

const CATEGORY_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'OTC', label: 'OTC' },
  { value: 'RX', label: '처방의약품' },
  { value: 'ETC', label: '기타' },
];

function getTrendData(axisType: AxisType) {
  switch (axisType) {
    case 'HOUR': return DUMMY_TREND_HOUR;
    case 'DATE': return DUMMY_TREND_DATE;
    case 'WEEKDAY': return DUMMY_TREND_WEEKDAY;
    case 'PERIOD': return DUMMY_TREND_PERIOD;
  }
}

export default function PosStatisticsPage() {
  useSetPageMeta('POS 실적 통합 조회', '단품 기준 판매량/매출 관리, 기간 비교 실적 분석');
  const { currentUser, can } = useAuth();
  const navigate = useNavigate();
  const [axisType, setAxisType] = useState<AxisType>('DATE');
  const [category, setCategory] = useState<CategoryCode>('ALL');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');
  const [compareStart, setCompareStart] = useState('');
  const [compareEnd, setCompareEnd] = useState('');
  const [showCompare, setShowCompare] = useState(false);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'item' | 'date'>('item');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const storeMode = currentUser ? shouldShowStoreSelector(currentUser.role) : 'hidden';

  const filteredItems = DUMMY_ITEMS.filter((item) => {
    if (category !== 'ALL' && item.category !== category) return false;
    return true;
  });

  const pagedItems = paginateArray(filteredItems, page, PAGE_SIZE);
  const trendData = getTrendData(axisType);
  const showCompareChart = showCompare && compareStart && compareEnd;

  useSetPageFilters(
    <>
      <div className="flex flex-wrap gap-4 items-end">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
          label="조회 기간"
        />
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-medium">조회 축</span>
          <div className="flex gap-1">
            {AXIS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAxisType(opt.value)}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors ${axisType === opt.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {storeMode !== 'hidden' && (
          <MultiSelect
            options={STORE_OPTIONS}
            selected={selectedStores}
            onChange={setSelectedStores}
            placeholder="매장 전체"
            label="매장 선택"
          />
        )}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-medium">상품 분류</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryCode)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={() => setShowCompare(!showCompare)} variant="secondary">
          {showCompare ? '비교기간 닫기' : '기간 비교'}
        </Button>
        <Button onClick={() => setPage(0)}>조회</Button>
        {can('EXPORT_DATA') && (
          <div>
            <Button variant="excel">
              <FileSpreadsheet size={13} />엑셀 다운로드
            </Button>
          </div>
        )}
      </div>
      {showCompare && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <DateRangePicker
            startDate={compareStart}
            endDate={compareEnd}
            onStartChange={setCompareStart}
            onEndChange={setCompareEnd}
            label="비교 기간"
          />
        </div>
      )}
    </>,
  );

  return (
    <PageContainer>
      <div className="flex gap-3 items-start">

        {/* 탭 패널 — 메인 콘텐츠 */}
        <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('item')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'item'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              상품별 통계
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('date')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'date'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              일자별 통계
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'item' ? (
              <>
                <Table<ItemRank & { _idx: number }>
                  columns={[
                    {
                      key: 'rank',
                      header: '순위',
                      render: (row) => (
                        <span className="text-gray-400 font-mono">
                          {page * PAGE_SIZE + ((row as unknown as { _idx: number })._idx) + 1}
                        </span>
                      ),
                    },
                    { key: 'itemCode', header: '단품코드', className: 'font-mono text-xs' },
                    { key: 'itemName', header: '단품명' },
                    { key: 'category', header: '분류' },
                    {
                      key: 'qty',
                      header: '판매수량',
                      render: (row) => formatNumber(row.qty) + '개',
                      className: 'text-right',
                    },
                    {
                      key: 'sales',
                      header: '매출액',
                      render: (row) => formatKRW(row.sales),
                      className: 'text-right font-medium',
                    },
                    {
                      key: 'ratio',
                      header: '구성비',
                      render: (row) => formatRatio(row.ratio),
                      className: 'text-right',
                    },
                  ]}
                  data={pagedItems.content.map((item, i) => ({
                    ...item,
                    _idx: i,
                  }))}
                  rowKey={(row) => row.itemCode}
                  onRowClick={(row) => navigate(`/pos/items/${row.itemCode}`)}
                />
                <Pagination
                  page={page}
                  totalPages={pagedItems.totalPages}
                  totalElements={pagedItems.totalElements}
                  size={PAGE_SIZE}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <>
                {/* 차트 — 일자별 통계 탭에 통합 */}
                <TrendLineChart
                  data={trendData}
                  showCompare={Boolean(showCompareChart)}
                />
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Table
                    columns={[
                      { key: 'axis', header: '일자' },
                      {
                        key: 'sales',
                        header: '매출액',
                        render: (row) => formatKRW((row as typeof trendData[0]).sales),
                        className: 'text-right',
                      },
                      {
                        key: 'customers',
                        header: '객수',
                        render: (row) => formatNumber((row as typeof trendData[0]).customers) + '명',
                        className: 'text-right',
                      },
                    ]}
                    data={DUMMY_TREND_DATE}
                    rowKey={(row) => row.axis}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* KPI 요약 — 오른쪽 컬럼 */}
        <div className="w-52 shrink-0 flex flex-col gap-2">
          <KpiCard
            label="매출액"
            value={formatKRW(DUMMY_POS_SUMMARY.totalSales)}
            compareRatio={showCompare ? DUMMY_POS_SUMMARY.compareRatio : undefined}
            icon={<TrendingUp size={15} />}
          />
          <KpiCard
            label="객수"
            value={formatNumber(DUMMY_POS_SUMMARY.customerCount) + '명'}
            compareRatio={showCompare ? 3.1 : undefined}
            icon={<Users size={15} />}
          />
          <KpiCard
            label="객단가"
            value={formatKRW(DUMMY_POS_SUMMARY.avgSpend)}
            compareRatio={showCompare ? 2.0 : undefined}
            icon={<ShoppingBag size={15} />}
          />
        </div>

      </div>
    </PageContainer>
  );
}
