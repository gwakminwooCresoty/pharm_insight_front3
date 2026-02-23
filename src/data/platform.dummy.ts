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

export interface Store {
  storeId: string;
  storeName: string;
  franchiseId: string;
  franchiseName: string;
  address: string;
  latitude: number;
  longitude: number;
  contact: string;
  status: 'ACTIVE' | 'CLOSED';
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
    franchiseName: `${['가나', '다라', '마바', '사아', '자차', '카타', '파하'][i]}약국체인`,
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
    representativeName: ['김영수', '이민호', '박지영', '최동욱', '강지수', '윤혜영', '임준혁'][i],
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
    name: ['김민준', '이서연', '박도윤', '최하준', '정서현', '강지호', '윤예진', '임현우', '오지민', '한서윤',
      '신민서', '류지아', '황예원', '안도현', '송채원', '전지우', '배수빈', '조현서', '문지훈', '장다은'][i],
    email: `user${i + 7}@fran00${(i % 4) + 1}.com`,
    role: ['FRANCHISE_ADMIN', 'FRANCHISE_VIEWER', 'STORE_MANAGER', 'STORE_STAFF', 'REGION_MANAGER'][i % 5] as UserRole,
    franchiseId: `FRAN-00${(i % 4) + 1}`,
    franchiseName: ['○○약국 체인', '△△헬스약국', '□□메디팜', '◇◇케어약국'][i % 4],
    storeId: i % 5 >= 2 ? `STORE-00${(i % 5) + 1}` : null,
    storeName: i % 5 >= 2 ? ['강남점', '서초점', '송파점'][i % 3] : null,
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

export const DUMMY_STORES: Store[] = [
  // FRAN-001 (○○약국 체인) - 서울 강남 일대 매장들
  { storeId: 'STR-001', storeName: '강남본점', franchiseId: 'FRAN-001', franchiseName: '○○약국 체인', address: '서울 강남구 테헤란로 123', latitude: 37.4979, longitude: 127.0276, contact: '02-1234-5678', status: 'ACTIVE' },
  { storeId: 'STR-002', storeName: '역삼역점', franchiseId: 'FRAN-001', franchiseName: '○○약국 체인', address: '서울 강남구 테헤란로 234', latitude: 37.5006, longitude: 127.0364, contact: '02-1234-5679', status: 'ACTIVE' },
  { storeId: 'STR-003', storeName: '선릉점', franchiseId: 'FRAN-001', franchiseName: '○○약국 체인', address: '서울 강남구 테헤란로 345', latitude: 37.5045, longitude: 127.0490, contact: '02-1234-5680', status: 'ACTIVE' },
  { storeId: 'STR-004', storeName: '삼성역점', franchiseId: 'FRAN-001', franchiseName: '○○약국 체인', address: '서울 강남구 영동대로 513', latitude: 37.5110, longitude: 127.0593, contact: '02-1234-5681', status: 'ACTIVE' },
  { storeId: 'STR-005', storeName: '논현점', franchiseId: 'FRAN-001', franchiseName: '○○약국 체인', address: '서울 강남구 강남대로 502', latitude: 37.5111, longitude: 127.0213, contact: '02-1234-5682', status: 'ACTIVE' },
  { storeId: 'STR-006', storeName: '신사점', franchiseId: 'FRAN-001', franchiseName: '○○약국 체인', address: '서울 강남구 도산대로 123', latitude: 37.5163, longitude: 127.0200, contact: '02-1234-5683', status: 'ACTIVE' },
  { storeId: 'STR-007', storeName: '압구정점', franchiseId: 'FRAN-001', franchiseName: '○○약국 체인', address: '서울 강남구 압구정로 165', latitude: 37.5262, longitude: 127.0285, contact: '02-1234-5684', status: 'ACTIVE' },
  { storeId: 'STR-008', storeName: '청담점', franchiseId: 'FRAN-001', franchiseName: '○○약국 체인', address: '서울 강남구 압구정로 456', latitude: 37.5251, longitude: 127.0473, contact: '02-1234-5685', status: 'ACTIVE' },
  { storeId: 'STR-009', storeName: '대치점', franchiseId: 'FRAN-001', franchiseName: '○○약국 체인', address: '서울 강남구 남부순환로 2936', latitude: 37.4946, longitude: 127.0632, contact: '02-1234-5686', status: 'CLOSED' },
  { storeId: 'STR-010', storeName: '도곡점', franchiseId: 'FRAN-001', franchiseName: '○○약국 체인', address: '서울 강남구 남부순환로 2753', latitude: 37.4883, longitude: 127.0467, contact: '02-1234-5687', status: 'ACTIVE' },

  // FRAN-002 (△△헬스약국) - 부산/경남 거점
  { storeId: 'STR-011', storeName: '서면본점', franchiseId: 'FRAN-002', franchiseName: '△△헬스약국', address: '부산 부산진구 중앙대로 692', latitude: 35.1530, longitude: 129.0596, contact: '051-234-5678', status: 'ACTIVE' },
  { storeId: 'STR-012', storeName: '해운대점', franchiseId: 'FRAN-002', franchiseName: '△△헬스약국', address: '부산 해운대구 해운대해변로 280', latitude: 35.1610, longitude: 129.1620, contact: '051-234-5679', status: 'ACTIVE' },
  { storeId: 'STR-013', storeName: '남포점', franchiseId: 'FRAN-002', franchiseName: '△△헬스약국', address: '부산 중구 구덕로 44', latitude: 35.0975, longitude: 129.0300, contact: '051-234-5680', status: 'ACTIVE' },
  { storeId: 'STR-014', storeName: '동래점', franchiseId: 'FRAN-002', franchiseName: '△△헬스약국', address: '부산 동래구 명륜로 129', latitude: 35.2033, longitude: 129.0811, contact: '051-234-5681', status: 'ACTIVE' },
  { storeId: 'STR-015', storeName: '센텀점', franchiseId: 'FRAN-002', franchiseName: '△△헬스약국', address: '부산 해운대구 센텀남대로 35', latitude: 35.1689, longitude: 129.1317, contact: '051-234-5682', status: 'ACTIVE' },
  { storeId: 'STR-016', storeName: '창원상남점', franchiseId: 'FRAN-002', franchiseName: '△△헬스약국', address: '경남 창원시 성산구 마디미로 21', latitude: 35.2227, longitude: 128.6821, contact: '055-234-5683', status: 'ACTIVE' },
  { storeId: 'STR-017', storeName: '울산삼산점', franchiseId: 'FRAN-002', franchiseName: '△△헬스약국', address: '울산 남구 삼산중로 84', latitude: 35.5396, longitude: 129.3361, contact: '052-234-5684', status: 'CLOSED' },
  { storeId: 'STR-018', storeName: '진주평거점', franchiseId: 'FRAN-002', franchiseName: '△△헬스약국', address: '경남 진주시 진양호로 222', latitude: 35.1763, longitude: 128.0573, contact: '055-234-5685', status: 'ACTIVE' },

  // FRAN-003 (□□메디팜) - 대전/충청/세종 거점
  { storeId: 'STR-019', storeName: '둔산본점', franchiseId: 'FRAN-003', franchiseName: '□□메디팜', address: '대전 서구 둔산로 100', latitude: 36.3537, longitude: 127.3814, contact: '042-345-6789', status: 'ACTIVE' },
  { storeId: 'STR-020', storeName: '유성점', franchiseId: 'FRAN-003', franchiseName: '□□메디팜', address: '대전 유성구 대학로 81', latitude: 36.3621, longitude: 127.3456, contact: '042-345-6790', status: 'ACTIVE' },
  { storeId: 'STR-021', storeName: '은행점', franchiseId: 'FRAN-003', franchiseName: '□□메디팜', address: '대전 중구 중앙로 145', latitude: 36.3287, longitude: 127.4268, contact: '042-345-6791', status: 'ACTIVE' },
  { storeId: 'STR-022', storeName: '도안점', franchiseId: 'FRAN-003', franchiseName: '□□메디팜', address: '대전 서구 도안북로 88', latitude: 36.3150, longitude: 127.3361, contact: '042-345-6792', status: 'CLOSED' },
  { storeId: 'STR-023', storeName: '세종나성점', franchiseId: 'FRAN-003', franchiseName: '□□메디팜', address: '세종특별자치시 나성로 96', latitude: 36.4837, longitude: 127.2560, contact: '044-345-6793', status: 'ACTIVE' },
  { storeId: 'STR-024', storeName: '세종아름점', franchiseId: 'FRAN-003', franchiseName: '□□메디팜', address: '세종특별자치시 아름동 달빛로 43', latitude: 36.5134, longitude: 127.2465, contact: '044-345-6794', status: 'ACTIVE' },
  { storeId: 'STR-025', storeName: '청주지웰점', franchiseId: 'FRAN-003', franchiseName: '□□메디팜', address: '충북 청주시 흥덕구 대농로 47', latitude: 36.6387, longitude: 127.4320, contact: '043-345-6795', status: 'ACTIVE' },
  { storeId: 'STR-026', storeName: '천안불당점', franchiseId: 'FRAN-003', franchiseName: '□□메디팜', address: '충남 천안시 서북구 불당대로 123', latitude: 36.8166, longitude: 127.1143, contact: '041-345-6796', status: 'ACTIVE' },
];
