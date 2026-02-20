export type ApprovalStatus = 'APPROVED' | 'CANCELLED' | 'ERROR';

export interface CardCompanySummary {
  cardCompanyCode: string;
  cardCompanyName: string;
  approvedAmount: number;
  approvedCount: number;
}

export interface CardApproval {
  approvalId: string;
  approvedAt: string;
  cardCompanyCode: string;
  cardCompanyName: string;
  approvalNo: string;
  amount: number;
  installment: number;
  status: ApprovalStatus;
  storeId: string;
  storeName: string;
  maskedCardNo: string;
}

export const DUMMY_CARD_SUMMARY: CardCompanySummary[] = [
  {
    cardCompanyCode: 'SAMSUNG',
    cardCompanyName: '삼성카드',
    approvedAmount: 52000000,
    approvedCount: 1380,
  },
  {
    cardCompanyCode: 'BC',
    cardCompanyName: 'BC카드',
    approvedAmount: 31000000,
    approvedCount: 820,
  },
  {
    cardCompanyCode: 'HYUNDAI',
    cardCompanyName: '현대카드',
    approvedAmount: 18000000,
    approvedCount: 480,
  },
  {
    cardCompanyCode: 'SHINHAN',
    cardCompanyName: '신한카드',
    approvedAmount: 11000000,
    approvedCount: 340,
  },
  {
    cardCompanyCode: 'KB',
    cardCompanyName: 'KB국민카드',
    approvedAmount: 8000000,
    approvedCount: 220,
  },
  {
    cardCompanyCode: 'LOTTE',
    cardCompanyName: '롯데카드',
    approvedAmount: 4000000,
    approvedCount: 120,
  },
];

const CARD_COMPANIES = [
  { code: 'SAMSUNG', name: '삼성카드' },
  { code: 'BC', name: 'BC카드' },
  { code: 'HYUNDAI', name: '현대카드' },
  { code: 'SHINHAN', name: '신한카드' },
  { code: 'KB', name: 'KB국민카드' },
  { code: 'LOTTE', name: '롯데카드' },
];

const STORES = [
  { id: 'STORE-001', name: '강남점' },
  { id: 'STORE-002', name: '서초점' },
  { id: 'STORE-003', name: '송파점' },
  { id: 'STORE-004', name: '마포점' },
  { id: 'STORE-005', name: '종로점' },
];

const STATUSES: ApprovalStatus[] = [
  'APPROVED',
  'APPROVED',
  'APPROVED',
  'APPROVED',
  'CANCELLED',
  'APPROVED',
  'APPROVED',
  'APPROVED',
  'ERROR',
  'APPROVED',
];

export const DUMMY_APPROVALS: CardApproval[] = Array.from(
  { length: 200 },
  (_, i) => {
    const company = CARD_COMPANIES[i % CARD_COMPANIES.length];
    const store = STORES[i % STORES.length];
    const day = String(Math.floor(i / 7) + 1).padStart(2, '0');
    const hour = String(9 + (i % 12)).padStart(2, '0');
    const min = String((i * 7) % 60).padStart(2, '0');
    return {
      approvalId: `APV2025${String(i + 1).padStart(5, '0')}`,
      approvedAt: `2025-01-${day}T${hour}:${min}:00`,
      cardCompanyCode: company.code,
      cardCompanyName: company.name,
      approvalNo: String(10000000 + i),
      amount: Math.floor(Math.random() * 200000) + 5000,
      installment: [0, 0, 0, 3, 6][i % 5],
      status: STATUSES[i % STATUSES.length],
      storeId: store.id,
      storeName: store.name,
      maskedCardNo: `${String(400000 + i).slice(0, 6)}****${String(i).padStart(4, '0')}`,
    };
  }
);

export const CARD_OPTIONS = CARD_COMPANIES.map((c) => ({
  value: c.code,
  label: c.name,
}));
