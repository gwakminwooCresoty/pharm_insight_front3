import { useState } from 'react';
import { TrendingUp, Users, Building2, Store } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import DateRangePicker from '@/components/ui/DateRangePicker';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import FranchiseRankBarChart from '@/components/charts/FranchiseRankBarChart';
import TrendLineChart from '@/components/charts/TrendLineChart';
import { formatKRW, formatNumber } from '@/utils/formatters';
import { useSetPageMeta, useSetPageFilters } from '@/hooks/usePageMeta';
import { paginateArray } from '@/utils/dummy.helpers';
import {
  DUMMY_PLATFORM_KPI,
  DUMMY_FRANCHISES,
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        {/* 좌측 세로 KPI 카드 (1열 차지) */}
        <div className="lg:col-span-1 flex flex-col gap-3 h-full">
          {/* 플랫폼 총 매출 */}
          <div className="bg-white rounded-[var(--radius-card)] border border-slate-100 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-[var(--transition-normal)] p-3.5 flex items-center gap-3.5 flex-1 w-full">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <TrendingUp size={18} className="text-primary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">플랫폼 총 매출</p>
              <div className="flex items-end justify-between">
                <p className="text-lg font-bold text-gray-900 leading-none truncate">
                  {formatKRW(DUMMY_PLATFORM_KPI.totalSales)}
                </p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                  ▲ {DUMMY_PLATFORM_KPI.compareRatio}%
                </span>
              </div>
            </div>
          </div>

          {/* 총 객수 */}
          <div className="bg-white rounded-[var(--radius-card)] border border-slate-100 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-[var(--transition-normal)] p-3.5 flex items-center gap-3.5 flex-1 w-full">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <Users size={18} className="text-teal-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">총 객수</p>
              <div className="flex items-end justify-between">
                <p className="text-lg font-bold text-gray-900 leading-none truncate">
                  {formatNumber(DUMMY_PLATFORM_KPI.totalCustomerCount)}명
                </p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                  ▲ 2.1%
                </span>
              </div>
            </div>
          </div>

          {/* 활성 프랜차이즈 */}
          <div className="bg-white rounded-[var(--radius-card)] border border-slate-100 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-[var(--transition-normal)] p-3.5 flex items-center gap-3.5 flex-1 w-full">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">활성 프랜차이즈</p>
              <div className="flex items-end justify-between">
                <p className="text-lg font-bold text-gray-900 leading-none truncate">
                  {DUMMY_PLATFORM_KPI.activeFranchiseCount}개
                </p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 shrink-0">
                  운영중
                </span>
              </div>
            </div>
          </div>

          {/* 활성 매장 */}
          <div className="bg-white rounded-[var(--radius-card)] border border-slate-100 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-[var(--transition-normal)] p-3.5 flex items-center gap-3.5 flex-1 w-full">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
              <Store size={18} className="text-violet-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">활성 매장</p>
              <div className="flex items-end justify-between">
                <p className="text-lg font-bold text-gray-900 leading-none truncate">
                  {DUMMY_PLATFORM_KPI.activeStoreCount}개
                </p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-600 shrink-0">
                  전국
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 우측 메인 차트 (3열 차지) */}
        <div className="lg:col-span-3 bg-white rounded-[var(--radius-card)] border border-slate-100 p-4 shadow-[var(--shadow-card)] flex flex-col h-full">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 shrink-0">
            플랫폼 전체 매출 추이
          </h2>
          <div className="flex-1 min-h-[300px]">
            <TrendLineChart data={platformTrend} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* 프랜차이즈 랭킹 차트 */}
        <div className="bg-white rounded-[var(--radius-card)] border border-slate-100 p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            프랜차이즈별 매출 랭킹
          </h2>
          <FranchiseRankBarChart franchises={DUMMY_FRANCHISES} />
        </div>
      </div>

      {/* 프랜차이즈 랭킹 테이블 */}
      <div className="bg-white rounded-[var(--radius-card)] border border-slate-100 p-4 shadow-[var(--shadow-card)]">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">프랜차이즈 현황</h2>
        <Table<FranchiseSummary>
          columns={[
            {
              key: 'salesRank',
              header: '순위',
              render: (row) => (
                <span className="font-bold text-primary-600">#{row.salesRank}</span>
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
