export interface PaymentBreakdown {
  paymentType: string;
  paymentName: string;
  sales: number;
  count: number;
  ratio: number;
  avgAmount: number;
}

export interface DailySettlement {
  date: string;
  breakdown: PaymentBreakdown[];
}

export interface SettlementData {
  totalSales: number;
  totalCount: number;
  breakdown: PaymentBreakdown[];
  dailyTrend: DailySettlement[];
}

export const DUMMY_SETTLEMENT: SettlementData = {
  totalSales: 152000000,
  totalCount: 4180,
  breakdown: [
    {
      paymentType: 'CARD',
      paymentName: '카드',
      sales: 114000000,
      count: 3020,
      ratio: 75.0,
      avgAmount: 37748,
    },
    {
      paymentType: 'CASH',
      paymentName: '현금',
      sales: 30400000,
      count: 890,
      ratio: 20.0,
      avgAmount: 34157,
    },
    {
      paymentType: 'POINT',
      paymentName: '포인트',
      sales: 6080000,
      count: 220,
      ratio: 4.0,
      avgAmount: 27636,
    },
    {
      paymentType: 'ETC',
      paymentName: '기타',
      sales: 1520000,
      count: 50,
      ratio: 1.0,
      avgAmount: 30400,
    },
  ],
  dailyTrend: Array.from({ length: 30 }, (_, i) => ({
    date: `01/${String(i + 1).padStart(2, '0')}`,
    breakdown: [
      {
        paymentType: 'CARD',
        paymentName: '카드',
        sales: Math.floor(Math.random() * 5000000) + 2000000,
        count: Math.floor(Math.random() * 150) + 50,
        ratio: 75.0,
        avgAmount: 37748,
      },
      {
        paymentType: 'CASH',
        paymentName: '현금',
        sales: Math.floor(Math.random() * 1500000) + 500000,
        count: Math.floor(Math.random() * 50) + 10,
        ratio: 20.0,
        avgAmount: 34157,
      },
      {
        paymentType: 'POINT',
        paymentName: '포인트',
        sales: Math.floor(Math.random() * 300000) + 100000,
        count: Math.floor(Math.random() * 15) + 3,
        ratio: 4.0,
        avgAmount: 27636,
      },
      {
        paymentType: 'ETC',
        paymentName: '기타',
        sales: Math.floor(Math.random() * 80000) + 20000,
        count: Math.floor(Math.random() * 5) + 1,
        ratio: 1.0,
        avgAmount: 30400,
      },
    ],
  })),
};
