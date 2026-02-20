export type FranchiseStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type UserStatus = 'ACTIVE' | 'INACTIVE';
export type UserRole =
  | 'PLATFORM_ADMIN'
  | 'FRANCHISE_ADMIN'
  | 'FRANCHISE_VIEWER'
  | 'REGION_MANAGER'
  | 'STORE_MANAGER'
  | 'STORE_STAFF';

export interface FranchiseSummary {
  franchiseId: string;
  franchiseName: string;
  status: FranchiseStatus;
  storeCount: number;
  userCount: number;
  totalSales: number;
  totalCustomerCount: number;
  avgSpend: number;
  salesRank: number;
  salesGrowthRatio: number;
  contractStartDate: string;
  contractEndDate: string;
  bizRegNo: string;
  representativeName: string;
  createdAt: string;
}

export interface PlatformUser {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  franchiseId: string | null;
  franchiseName: string | null;
  storeId: string | null;
  storeName: string | null;
  status: UserStatus;
  lastLoginAt: string;
  createdAt: string;
}

export interface AnomalyStore {
  storeId: string;
  storeName: string;
  franchiseName: string;
  todaySales: number;
  yesterdaySales: number;
  dropRatio: number;
}

export const DUMMY_PLATFORM_KPI = {
  totalSales: 3840000000,
  totalCustomerCount: 78400,
  activeFranchiseCount: 12,
  activeStoreCount: 245,
  compareRatio: 3.8,
};

export const DUMMY_FRANCHISES: FranchiseSummary[] = [
  {
    franchiseId: 'FRAN-001',
    franchiseName: '○○약국 체인',
    status: 'ACTIVE',
    storeCount: 32,
    userCount: 145,
    totalSales: 880000000,
    totalCustomerCount: 18200,
    avgSpend: 48352,
    salesRank: 1,
    salesGrowthRatio: 3.2,
    contractStartDate: '2024-01-01',
    contractEndDate: '2026-12-31',
    bizRegNo: '123-45-67890',
    representativeName: '홍길동',
    createdAt: '2024-01-01T09:00:00',
  },
  {
    franchiseId: 'FRAN-002',
    franchiseName: '△△헬스약국',
    status: 'ACTIVE',
    storeCount: 24,
    userCount: 98,
    totalSales: 640000000,
    totalCustomerCount: 13500,
    avgSpend: 47407,
    salesRank: 2,
    salesGrowthRatio: 5.1,
    contractStartDate: '2024-03-01',
    contractEndDate: '2027-02-28',
    bizRegNo: '234-56-78901',
    representativeName: '김철수',
    createdAt: '2024-03-01T09:00:00',
  },
  {
    franchiseId: 'FRAN-003',
    franchiseName: '□□메디팜',
    status: 'ACTIVE',
    storeCount: 18,
    userCount: 74,
    totalSales: 480000000,
    totalCustomerCount: 10200,
    avgSpend: 47059,
    salesRank: 3,
    salesGrowthRatio: -1.2,
    contractStartDate: '2024-06-01',
    contractEndDate: '2026-05-31',
    bizRegNo: '345-67-89012',
    representativeName: '이영희',
    createdAt: '2024-06-01T09:00:00',
  },
  {
    franchiseId: 'FRAN-004',
    franchiseName: '◇◇케어약국',
    status: 'ACTIVE',
    storeCount: 15,
    userCount: 62,
    totalSales: 380000000,
    totalCustomerCount: 8400,
    avgSpend: 45238,
    salesRank: 4,
    salesGrowthRatio: 8.3,
    contractStartDate: '2024-09-01',
    contractEndDate: '2027-08-31',
    bizRegNo: '456-78-90123',
    representativeName: '박민준',
    createdAt: '2024-09-01T09:00:00',
  },
  {
    franchiseId: 'FRAN-005',
    franchiseName: '☆☆웰니스',
    status: 'SUSPENDED',
    storeCount: 8,
    userCount: 30,
    totalSales: 180000000,
    totalCustomerCount: 4100,
    avgSpend: 43902,
    salesRank: 5,
    salesGrowthRatio: -15.2,
    contractStartDate: '2023-07-01',
    contractEndDate: '2025-06-30',
    bizRegNo: '567-89-01234',
    representativeName: '최수진',
    createdAt: '2023-07-01T09:00:00',
  },
  ...Array.from({ length: 7 }, (_, i) => ({
    franchiseId: `FRAN-${String(i + 6).padStart(3, '0')}`,
    franchiseName: `${['가나','다라','마바','사아','자차','카타','파하'][i]}약국체인`,
    status: 'ACTIVE' as FranchiseStatus,
    storeCount: 5 + i * 2,
    userCount: 20 + i * 8,
    totalSales: (120 + i * 20) * 1000000,
    totalCustomerCount: 2800 + i * 400,
    avgSpend: 42000 + i * 1000,
    salesRank: i + 6,
    salesGrowthRatio: Number((Math.random() * 10 - 3).toFixed(1)),
    contractStartDate: '2024-01-01',
    contractEndDate: '2026-12-31',
    bizRegNo: `${600 + i}-12-34567`,
    representativeName: ['김영수','이민호','박지영','최동욱','강지수','윤혜영','임준혁'][i],
    createdAt: '2024-01-01T09:00:00',
  })),
];

export const DUMMY_PLATFORM_USERS: PlatformUser[] = [
  {
    userId: 'USER-001',
    name: '플랫폼 관리자',
    email: 'platform@pharminsight.com',
    role: 'PLATFORM_ADMIN',
    franchiseId: null,
    franchiseName: null,
    storeId: null,
    storeName: null,
    status: 'ACTIVE',
    lastLoginAt: '2025-02-20T08:30:00',
    createdAt: '2024-01-01T09:00:00',
  },
  {
    userId: 'USER-002',
    name: '○○약국 프랜차이즈 관리자',
    email: 'fadmin@fran001.com',
    role: 'FRANCHISE_ADMIN',
    franchiseId: 'FRAN-001',
    franchiseName: '○○약국 체인',
    storeId: null,
    storeName: null,
    status: 'ACTIVE',
    lastLoginAt: '2025-02-19T17:45:00',
    createdAt: '2024-01-15T09:00:00',
  },
  {
    userId: 'USER-003',
    name: '○○약국 프랜차이즈 열람자',
    email: 'fviewer@fran001.com',
    role: 'FRANCHISE_VIEWER',
    franchiseId: 'FRAN-001',
    franchiseName: '○○약국 체인',
    storeId: null,
    storeName: null,
    status: 'ACTIVE',
    lastLoginAt: '2025-02-18T14:20:00',
    createdAt: '2024-02-01T09:00:00',
  },
  {
    userId: 'USER-004',
    name: '강남지역 관리자',
    email: 'region@fran001.com',
    role: 'REGION_MANAGER',
    franchiseId: 'FRAN-001',
    franchiseName: '○○약국 체인',
    storeId: null,
    storeName: null,
    status: 'ACTIVE',
    lastLoginAt: '2025-02-20T09:00:00',
    createdAt: '2024-03-01T09:00:00',
  },
  {
    userId: 'USER-005',
    name: '강남점 관리자',
    email: 'store@fran001.com',
    role: 'STORE_MANAGER',
    franchiseId: 'FRAN-001',
    franchiseName: '○○약국 체인',
    storeId: 'STORE-001',
    storeName: '강남점',
    status: 'ACTIVE',
    lastLoginAt: '2025-02-20T10:15:00',
    createdAt: '2024-04-01T09:00:00',
  },
  {
    userId: 'USER-006',
    name: '강남점 직원',
    email: 'staff@fran001.com',
    role: 'STORE_STAFF',
    franchiseId: 'FRAN-001',
    franchiseName: '○○약국 체인',
    storeId: 'STORE-001',
    storeName: '강남점',
    status: 'ACTIVE',
    lastLoginAt: '2025-02-20T08:00:00',
    createdAt: '2024-05-01T09:00:00',
  },
  ...Array.from({ length: 20 }, (_, i) => ({
    userId: `USER-${String(i + 7).padStart(3, '0')}`,
    name: ['김민준','이서연','박도윤','최하준','정서현','강지호','윤예진','임현우','오지민','한서윤',
            '신민서','류지아','황예원','안도현','송채원','전지우','배수빈','조현서','문지훈','장다은'][i],
    email: `user${i + 7}@fran00${(i % 4) + 1}.com`,
    role: ['FRANCHISE_ADMIN','FRANCHISE_VIEWER','STORE_MANAGER','STORE_STAFF','REGION_MANAGER'][i % 5] as UserRole,
    franchiseId: `FRAN-00${(i % 4) + 1}`,
    franchiseName: ['○○약국 체인','△△헬스약국','□□메디팜','◇◇케어약국'][i % 4],
    storeId: i % 5 >= 2 ? `STORE-00${(i % 5) + 1}` : null,
    storeName: i % 5 >= 2 ? ['강남점','서초점','송파점'][i % 3] : null,
    status: i % 10 === 0 ? 'INACTIVE' as UserStatus : 'ACTIVE' as UserStatus,
    lastLoginAt: `2025-02-${String(15 + (i % 5)).padStart(2, '0')}T${String(8 + (i % 10)).padStart(2, '0')}:00:00`,
    createdAt: `2024-0${(i % 9) + 1}-01T09:00:00`,
  })),
];

export const DUMMY_ANOMALIES: AnomalyStore[] = [
  {
    storeId: 'STORE-023',
    storeName: '대구 동성로점',
    franchiseName: '△△헬스약국',
    todaySales: 890000,
    yesterdaySales: 1350000,
    dropRatio: -34.1,
  },
  {
    storeId: 'STORE-047',
    storeName: '인천 부평점',
    franchiseName: '□□메디팜',
    todaySales: 420000,
    yesterdaySales: 680000,
    dropRatio: -38.2,
  },
];

export const DUMMY_TREND_PLATFORM = Array.from({ length: 30 }, (_, i) => ({
  date: `01/${String(i + 1).padStart(2, '0')}`,
  totalSales: Math.floor(Math.random() * 50000000) + 100000000,
  fran001: Math.floor(Math.random() * 10000000) + 25000000,
  fran002: Math.floor(Math.random() * 8000000) + 18000000,
  fran003: Math.floor(Math.random() * 6000000) + 12000000,
  others: Math.floor(Math.random() * 20000000) + 40000000,
}));
