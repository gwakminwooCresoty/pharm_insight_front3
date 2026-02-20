import { useParams, useNavigate } from 'react-router-dom';
import { Package, TrendingUp, Tag } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import KpiCard from '@/components/ui/KpiCard';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { formatKRW, formatNumber, formatRatio } from '@/utils/formatters';
import { DUMMY_ITEMS, STORE_OPTIONS } from '@/data/pos.dummy';

interface StoreBreakdown {
  storeId: string;
  storeName: string;
  qty: number;
  sales: number;
  ratio: number;
}

export default function ItemDetailPage() {
  const { itemCode } = useParams<{ itemCode: string }>();
  const navigate = useNavigate();

  const item = DUMMY_ITEMS.find((i) => i.itemCode === itemCode) ?? DUMMY_ITEMS[0];

  const storeBreakdown: StoreBreakdown[] = STORE_OPTIONS.map((store, i) => {
    const qty = Math.floor(item.qty * [0.25, 0.20, 0.20, 0.18, 0.17][i]);
    const sales = qty * Math.floor(item.sales / item.qty);
    return {
      storeId: store.value,
      storeName: store.label,
      qty,
      sales,
      ratio: 0,
    };
  }).map((s) => ({
    ...s,
    ratio: Number(((s.sales / item.sales) * 100).toFixed(1)),
  }));

  return (
    <PageContainer
      title={`단품 실적 상세`}
      subtitle={`${item.itemName} (${item.itemCode})`}
      actions={
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← 목록으로
        </Button>
      }
    >
      {/* 단품 정보 카드 */}
      <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
            {item.category}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{item.itemName}</h2>
            <p className="text-sm text-gray-500">{item.itemCode} · {item.category}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <KpiCard label="총 판매수량" value={formatNumber(item.qty) + '개'} icon={<Package size={15} />} />
          <KpiCard label="총 매출액" value={formatKRW(item.sales)} icon={<TrendingUp size={15} />} />
          <KpiCard
            label="평균 단가"
            value={formatKRW(Math.floor(item.sales / item.qty))}
            icon={<Tag size={15} />}
          />
        </div>
      </div>

      {/* 매장별 판매 현황 */}
      <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">매장별 판매 현황</h2>
        <Table<StoreBreakdown>
          columns={[
            { key: 'storeName', header: '매장명' },
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
          data={storeBreakdown}
          rowKey={(row) => row.storeId}
        />
      </div>
    </PageContainer>
  );
}
