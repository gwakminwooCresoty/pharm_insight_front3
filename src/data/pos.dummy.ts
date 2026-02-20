export interface TrendPoint {
  axis: string;
  sales: number;
  customers: number;
  compareSales?: number;
}

export interface ItemRank {
  itemCode: string;
  itemName: string;
  category: string;
  qty: number;
  sales: number;
  ratio: number;
  storeId: string;
  franchiseId: string;
}

export interface PosSummary {
  totalSales: number;
  customerCount: number;
  avgSpend: number;
  compareRatio: number;
}

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const DUMMY_POS_SUMMARY: PosSummary = {
  totalSales: 152000000,
  customerCount: 3120,
  avgSpend: 48717,
  compareRatio: 5.2,
};

export const DUMMY_TREND_HOUR: TrendPoint[] = Array.from(
  { length: 13 },
  (_, i) => ({
    axis: `${i + 9}시`,
    sales: rand(3000000, 15000000),
    customers: rand(50, 300),
    compareSales: rand(2500000, 13000000),
  })
);

export const DUMMY_TREND_DATE: TrendPoint[] = Array.from(
  { length: 30 },
  (_, i) => ({
    axis: `01/${String(i + 1).padStart(2, '0')}`,
    sales: rand(2000000, 9000000),
    customers: rand(30, 220),
    compareSales: rand(1800000, 8500000),
  })
);

export const DUMMY_TREND_WEEKDAY: TrendPoint[] = [
  { axis: '월', sales: 5200000, customers: 110 },
  { axis: '화', sales: 4800000, customers: 98 },
  { axis: '수', sales: 5600000, customers: 120 },
  { axis: '목', sales: 5100000, customers: 105 },
  { axis: '금', sales: 7200000, customers: 155 },
  { axis: '토', sales: 9800000, customers: 210 },
  { axis: '일', sales: 6400000, customers: 135 },
];

export const DUMMY_TREND_PERIOD: TrendPoint[] = [
  { axis: '이전기간', sales: 144400000, customers: 2967 },
  { axis: '현재기간', sales: 152000000, customers: 3120 },
];

const ITEM_NAMES = [
  '타이레놀 500mg',
  '부루펜 400mg',
  '게보린 정',
  '판피린 T 정',
  '후시딘 연고',
  '박카스D',
  '베아제 정',
  '마데카솔 파우더',
  '에어본 정',
  '이지엔6 이브',
  '쎄토펜 시럽',
  '아스피린 100mg',
  '지르텍 10mg',
  '클라리틴 정',
  '솔가 비타민C',
  '고려은단 멀티비타민',
  '오메가3 1000mg',
  '프리바이오틱스 유산균',
  '비타민D 2000IU',
  '마그네슘 킬레이트',
];

const CATEGORIES = ['OTC', 'OTC', 'OTC', 'RX', 'ETC'];
const STORES = [
  'STORE-001',
  'STORE-002',
  'STORE-003',
  'STORE-004',
  'STORE-005',
];

export const DUMMY_ITEMS: ItemRank[] = Array.from({ length: 100 }, (_, i) => {
  const qty = rand(100, 2000);
  const price = [5000, 7500, 12000, 15000, 20000][i % 5];
  const sales = qty * price;
  return {
    itemCode: `ITEM${String(i + 1).padStart(3, '0')}`,
    itemName: ITEM_NAMES[i % ITEM_NAMES.length] + (i >= 20 ? ` (${i + 1})` : ''),
    category: CATEGORIES[i % CATEGORIES.length],
    qty,
    sales,
    ratio: 0,
    storeId: STORES[i % STORES.length],
    franchiseId: 'FRAN-001',
  };
}).sort((a, b) => b.sales - a.sales)
  .map((item, i, arr) => {
    const totalSales = arr.reduce((s, x) => s + x.sales, 0);
    return { ...item, ratio: Number(((item.sales / totalSales) * 100).toFixed(1)) };
  });

export const STORE_OPTIONS = [
  { value: 'STORE-001', label: '강남점' },
  { value: 'STORE-002', label: '서초점' },
  { value: 'STORE-003', label: '송파점' },
  { value: 'STORE-004', label: '마포점' },
  { value: 'STORE-005', label: '종로점' },
];

export const REGION_STORE_MAP: Record<string, string[]> = {
  'REGION-01': ['STORE-001', 'STORE-002', 'STORE-003'],
  'REGION-02': ['STORE-004', 'STORE-005'],
};
