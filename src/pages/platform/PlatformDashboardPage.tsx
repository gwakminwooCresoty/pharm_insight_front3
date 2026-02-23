import { useState } from 'react';
import { TrendingUp, Users, Building2, Store, AlertTriangle } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import KpiCard from '@/components/ui/KpiCard';
import DateRangePicker from '@/components/ui/DateRangePicker';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import FranchiseRankBarChart from '@/components/charts/FranchiseRankBarChart';
import TrendLineChart from '@/components/charts/TrendLineChart';
import { formatKRW, formatNumber, formatRatio } from '@/utils/formatters';
import { useSetPageMeta, useSetPageFilters } from '@/hooks/usePageMeta';
import { paginateArray } from '@/utils/dummy.helpers';
import {
  DUMMY_PLATFORM_KPI,
  DUMMY_FRANCHISES,
  DUMMY_ANOMALIES,
  DUMMY_TREND_PLATFORM,
  type FranchiseSummary,
} from '@/data/platform.dummy';

// 플랫폼 트렌드를 TrendPoint 형태로 변환
const platformTrend = DUMMY_TREND_PLATFORM.map((d) => ({
  axis: d.date,
  sales: d.totalSales,
  customers: 0,
}));

export default function PlatformDashboardPage() {
  useSetPageMeta('플랫폼 전체 현황 대시보드', '전체 프랜차이즈 매출 현황 및 이상 징후 모니터링');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const paged = paginateArray(DUMMY_FRANCHISES, page, PAGE_SIZE);

  useSetPageFilters(
    <div className="flex flex-wrap gap-4 items-end">
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
        label="조회 기간"
      />
      <Button>조회</Button>
    </div>,
  );

  return (
    <PageContainer>

      {/* 플랫폼 KPI */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="플랫폼 총 매출"
          value={formatKRW(DUMMY_PLATFORM_KPI.totalSales)}
          compareRatio={DUMMY_PLATFORM_KPI.compareRatio}
          icon={<TrendingUp size={15} />}
        />
        <KpiCard
          label="총 객수"
          value={formatNumber(DUMMY_PLATFORM_KPI.totalCustomerCount) + '명'}
          compareRatio={2.1}
          icon={<Users size={15} />}
        />
        <KpiCard
          label="활성 프랜차이즈"
          value={DUMMY_PLATFORM_KPI.activeFranchiseCount + '개'}
          icon={<Building2 size={15} />}
        />
        <KpiCard
          label="활성 매장"
          value={DUMMY_PLATFORM_KPI.activeStoreCount + '개'}
          icon={<Store size={15} />}
        />
      </div>

      {/* 이상 징후 알림 */}
      {DUMMY_ANOMALIES.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-red-500 shrink-0" />
            <h2 className="text-sm font-semibold text-red-700">
              이상 징후 감지 — 전일 대비 매출 -30% 이상
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {DUMMY_ANOMALIES.map((a) => (
              <div
                key={a.storeId}
                className="bg-white rounded-lg border border-red-200 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{a.storeName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.franchiseName}</p>
                  </div>
                  <Badge color="red">{formatRatio(a.dropRatio)}</Badge>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-600">
                  <span>오늘: <strong>{formatKRW(a.todaySales)}</strong></span>
                  <span>어제: {formatKRW(a.yesterdaySales)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* 프랜차이즈 랭킹 차트 */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            프랜차이즈별 매출 랭킹
          </h2>
          <FranchiseRankBarChart franchises={DUMMY_FRANCHISES} />
        </div>

        {/* 플랫폼 전체 트렌드 */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            플랫폼 전체 매출 추이
          </h2>
          <TrendLineChart data={platformTrend} />
        </div>
      </div>

      {/* 프랜차이즈 랭킹 테이블 */}
      <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">프랜차이즈 현황</h2>
        <Table<FranchiseSummary>
          columns={[
            {
              key: 'salesRank',
              header: '순위',
              render: (row) => (
                <span className="font-bold text-blue-600">#{row.salesRank}</span>
              ),
            },
            { key: 'franchiseName', header: '프랜차이즈명' },
            {
              key: 'status',
              header: '상태',
              render: (row) => (
                <Badge
                  color={
                    row.status === 'ACTIVE'
                      ? 'green'
                      : row.status === 'SUSPENDED'
                        ? 'red'
                        : 'gray'
                  }
                >
                  {row.status === 'ACTIVE'
                    ? '활성'
                    : row.status === 'SUSPENDED'
                      ? '정지'
                      : '비활성'}
                </Badge>
              ),
            },
            {
              key: 'storeCount',
              header: '매장 수',
              render: (row) => row.storeCount + '개',
              className: 'text-right',
            },
            {
              key: 'totalSales',
              header: '매출액',
              render: (row) => formatKRW(row.totalSales),
              className: 'text-right font-medium',
            },
            {
              key: 'salesGrowthRatio',
              header: '성장률',
              render: (row) => (
                <span
                  className={
                    row.salesGrowthRatio >= 0 ? 'text-green-600' : 'text-red-500'
                  }
                >
                  {row.salesGrowthRatio >= 0 ? '▲' : '▼'}
                  {Math.abs(row.salesGrowthRatio).toFixed(1)}%
                </span>
              ),
              className: 'text-right',
            },
            {
              key: 'totalCustomerCount',
              header: '총 객수',
              render: (row) => formatNumber(row.totalCustomerCount) + '명',
              className: 'text-right',
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
    </PageContainer>
  );
}
