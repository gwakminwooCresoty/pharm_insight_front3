# PharmInsight — 프로젝트 컨텍스트

> 약국 체인 POS 분석 플랫폼 프로토타입 (PharmInsight v2.0)
> 현재 상태: **프론트엔드 프로토타입 완성** — API 연동 없이 전체 더미 데이터로 구동

---

## 0. Claude 작업 규칙

> **이 섹션은 Claude(AI 어시스턴트)를 위한 지시사항입니다.**

- **CLAUDE.md 자동 갱신**: 코드·구조·설계 결정을 변경할 때마다 이 파일을 즉시 갱신한다. 사용자가 별도로 요청하지 않아도 자동으로 수행한다.
- 갱신 범위: 신규 파일 추가 → 섹션 3(파일 구조), API 변경 → 섹션 12, 설계 결정 추가 → 섹션 13, 페이지 로직 변경 → 섹션 10.
- 갱신 시점: 해당 변경 작업 완료 직후 (별도 커밋 불필요, 파일 수정만).

---

## 1. 기술 스택

| 구분 | 스택 | 비고 |
|---|---|---|
| 번들러 | **Rsbuild** v1.7 | Vite/webpack 아님. config: `rsbuild.config.ts` |
| UI 프레임워크 | **React** 19 + **TypeScript** 5 | strict 모드 (`noUnusedLocals`, `noUnusedParameters`) |
| 스타일 | **Tailwind CSS** 4 | `@import 'tailwindcss'` 방식, 설정 파일 없음 |
| 상태관리 | **Zustand** 5 + `persist` | localStorage 키: `pharminsight-auth` |
| 라우팅 | **react-router-dom** 7 | `createBrowserRouter` + `RouterProvider` |
| 차트 | **recharts** 3 | `ResponsiveContainer` 필수 래퍼 |
| 폼 | **react-hook-form** 7 | TenantManagePage, UserManagePage에서 사용 |
| 아이콘 | **lucide-react** 0.575 | 이모지 일절 미사용, SVG 아이콘만 사용 |
| 패키지 매니저 | **Bun** | `bun add`, `bun run build` |

### 경로 별칭

```ts
// rsbuild.config.ts
resolve: { alias: { '@': './src' } }

// tsconfig.json
"baseUrl": ".", "paths": { "@/*": ["./src/*"] }
```

`@/` → `./src/`로 해석. 모든 import는 이 별칭 사용.

---

## 2. 멀티 테넌시 구조

```
Platform (플랫폼)
  └─ Franchise (프랜차이즈)  예: ○○약국 체인
       └─ Region (지역)       예: 강남지역
            └─ Store (매장)   예: 강남점
```

### RBAC — 6가지 역할

| 역할 | 한국어 | 접근 가능 데이터 범위 |
|---|---|---|
| `PLATFORM_ADMIN` | 플랫폼 관리자 | 전체 (모든 프랜차이즈) |
| `FRANCHISE_ADMIN` | 프랜차이즈 관리자 | 소속 프랜차이즈 전체 |
| `FRANCHISE_VIEWER` | 프랜차이즈 열람자 | 소속 프랜차이즈 (조회만) |
| `REGION_MANAGER` | 지역 관리자 | 소속 지역 매장들 |
| `STORE_MANAGER` | 매장 관리자 | 소속 매장 |
| `STORE_STAFF` | 매장 직원 | 소속 매장 (POS 조회만) |

### 권한(Permission) 목록

```ts
type Permission =
  | 'POS_STATS_READ'     // POS 실적 조회
  | 'SETTLEMENT_READ'   // CR정산서
  | 'CARD_APPROVAL_READ'// 카드승인 조회
  | 'EXPORT_DATA'       // 엑셀 다운로드
  | 'USER_MANAGE'       // 사용자 관리
  | 'TENANT_MANAGE'     // 테넌트 관리
  | 'PLATFORM_DASHBOARD'; // 플랫폼 대시보드
```

---

## 3. 파일 구조

```
src/
├── App.tsx                    # RouterProvider 진입점
├── App.css                    # 전역 스타일 (tailwindcss import + body 리셋)
├── index.tsx                  # React 마운트
│
├── types/
│   └── auth.ts                # AuthUser, UserRole, Permission 타입
│
├── store/
│   └── authStore.ts           # Zustand auth 스토어 (persist)
│
├── hooks/
│   └── useAuth.ts             # useAuthStore 래퍼: { currentUser, isAuthenticated, login, logout, can() }
│
├── utils/
│   ├── permissions.ts         # ROLE_LABELS, hasPermission(), canAccessMenu(), shouldShowStoreSelector()
│   ├── formatters.ts          # formatKRW(), formatNumber(), formatRatio(), formatDate(), formatDateTime()
│   ├── chartColors.ts         # 차트 공용 색상 상수 (PAYMENT_COLOR_LIST, PAYMENT_COLORS, FRANCHISE_RANK_COLORS)
│   └── dummy.helpers.ts       # paginateArray<T>() — Spring Page 규칙 (0-based)
│
├── router/
│   └── index.tsx              # createBrowserRouter, PrivateRoute, RoleGuard
│
├── data/                      # 모든 더미 데이터 (API 연동 시 이 파일들을 교체)
│   ├── branding.dummy.ts      # BRANDING 설정 (serviceName, loginTagline, version, year)
│   ├── auth.dummy.ts          # DUMMY_ACCOUNTS (6개 계정, 비밀번호 test1234)
│   ├── pos.dummy.ts           # POS 실적, 트렌드, 단품 100개
│   ├── settlement.dummy.ts    # 정산서 결제수단별 데이터
│   ├── card.dummy.ts          # 카드사별 요약, 승인내역 200건
│   └── platform.dummy.ts      # 플랫폼 KPI, 프랜차이즈 12개, 사용자 26명
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx      # Sidebar + TopHeader + <Outlet /> 래퍼, max-w-[1280px]
│   │   ├── Sidebar.tsx        # w-48, slate-900 배경, lucide 아이콘, SVG 로고마크
│   │   ├── TopHeader.tsx      # h-12, 현재 페이지 타이틀, 사용자 정보, 로그아웃
│   │   └── PageContainer.tsx  # 페이지 타이틀 + gap-4 수직 스택
│   │
│   ├── ui/
│   │   ├── Button.tsx         # variant: primary|secondary|danger|ghost / size: sm|md|lg
│   │   ├── Badge.tsx          # color: green|red|yellow|blue|gray
│   │   ├── KpiCard.tsx        # label, value, compareRatio?, subLabel?, icon?: ReactNode
│   │   ├── Table.tsx          # 제네릭 Table<T>, columns[], rowKey, onRowClick, rowClassName
│   │   ├── Pagination.tsx     # 0-based page, Spring Page 규칙
│   │   ├── Modal.tsx          # open/close, title, size: sm|md|lg, body scroll lock
│   │   ├── DateRangePicker.tsx# startDate/endDate + label
│   │   └── MultiSelect.tsx    # 체크박스 드롭다운, "전체" 옵션 포함
│   │
│   └── charts/
│       ├── ChartTooltip.ts          # TOOLTIP_PROPS 공용 객체 — 모든 차트 Tooltip에 스프레드
│       ├── TrendLineChart.tsx       # ComposedChart: Bar(매출) + Line(비교기간)
│       ├── PaymentDonutChart.tsx    # PieChart innerRadius=70, outerRadius=105, 중앙 합계 CSS overlay
│       ├── PaymentStackBarChart.tsx # BarChart stackId="payment" 결제수단별
│       └── FranchiseRankBarChart.tsx# BarChart 프랜차이즈 랭킹, height=280, XAxis angle=-25°
│
└── pages/
    ├── LoginPage.tsx              # 테넌트 로그인 (/login): BRANDING 적용, PLATFORM_ADMIN 제외
    ├── PlatformLoginPage.tsx      # 플랫폼 관리자 전용 로그인 (/platform/login): 다크 전체화면
    ├── pos/
    │   ├── PosStatisticsPage.tsx  # POS 실적 통합 조회 (메인)
    │   └── ItemDetailPage.tsx     # 단품 실적 상세 (/pos/items/:itemCode)
    ├── settlement/
    │   └── SettlementPage.tsx     # CR정산서 — 결제수단별
    ├── card/
    │   └── CardApprovalPage.tsx   # 카드승인 조회
    └── platform/
        ├── PlatformDashboardPage.tsx # 플랫폼 전체 현황
        ├── TenantManagePage.tsx      # 테넌트(프랜차이즈) CRUD
        └── UserManagePage.tsx        # 사용자 관리 (초대, 역할 수정, 상태 토글)
```

---

## 4. 라우팅 구조

```
/login                   → LoginPage          (테넌트 로그인, 비로그인 접근 가능)
/platform/login          → PlatformLoginPage  (플랫폼 관리자 전용 로그인)
/                        → PrivateRoute → AppLayout
  /                      → redirect → /pos/statistics
  /pos/statistics        → PosStatisticsPage
  /pos/items/:itemCode   → ItemDetailPage
  /settlement            → RoleGuard(SETTLEMENT_READ) → SettlementPage
  /card/approvals        → RoleGuard(CARD_APPROVAL_READ) → CardApprovalPage
  /platform/dashboard    → RoleGuard(PLATFORM_DASHBOARD) → PlatformDashboardPage
  /platform/tenants      → RoleGuard(TENANT_MANAGE) → TenantManagePage
  /platform/users        → RoleGuard(USER_MANAGE) → UserManagePage
```

- **PrivateRoute**: 미인증 시 `/platform/*` 경로는 `/platform/login`으로, 나머지는 `/login`으로 redirect
- **RoleGuard**: 권한 없으면 403 메시지 표시 (페이지 교체, 리디렉션 아님)
- 사이드바 메뉴는 `canAccessMenu()`로 권한 없는 항목 숨김

---

## 5. 인증 플로우

### 로그인 진입점 분리
| 대상 | URL | 페이지 |
|---|---|---|
| 테넌트 사용자 (FRANCHISE_* / REGION_* / STORE_*) | `/login` | LoginPage |
| 플랫폼 관리자 (PLATFORM_ADMIN) | `/platform/login` | PlatformLoginPage |

- `LoginPage`: PLATFORM_ADMIN 계정 입력 시 오류 메시지로 `/platform/login` 안내. 로그인 성공 → `/`
- `PlatformLoginPage`: PLATFORM_ADMIN 이외 계정 거부. 로그인 성공 → `/platform/dashboard`

```ts
// 로그인
const { login } = useAuth();
login(user); // AuthUser 객체 → Zustand store에 persist

// 권한 확인
const { can } = useAuth();
can('EXPORT_DATA'); // boolean

// 매장 선택기 표시 모드
shouldShowStoreSelector(role)
// → 'hidden'          : STORE_MANAGER, STORE_STAFF (자기 매장 고정)
// → 'multi'           : REGION_MANAGER (지역 내 매장 선택)
// → 'franchise-multi' : FRANCHISE_ADMIN, FRANCHISE_VIEWER
// → 'platform'        : PLATFORM_ADMIN (전체)
```

---

## 6. 더미 데이터 구조

### branding.dummy.ts
```ts
// API 연동 시: GET /api/platform/branding
BRANDING: BrandingConfig  // { serviceName, loginTagline, version, year }
// serviceName  : 사이드바·로그인·브라우저 탭에 표시되는 서비스명 (예: '슈퍼팜')
// loginTagline : LoginPage 첫 줄 문구 (예: '슈퍼팜을 위한') — 조사 포함해서 직접 작성
// version, year: 푸터 표시용
```

### auth.dummy.ts
```ts
DUMMY_ACCOUNTS: DummyAccount[]  // 6개 계정, password: 'test1234'
// USER-001: PLATFORM_ADMIN (모든 권한)
// USER-002: FRANCHISE_ADMIN (FRAN-001, EXPORT/USER_MANAGE 포함)
// USER-003: FRANCHISE_VIEWER (FRAN-001, 조회만)
// USER-004: REGION_MANAGER (REGION-01, EXPORT 포함)
// USER-005: STORE_MANAGER (STORE-001, 강남점, EXPORT 포함)
// USER-006: STORE_STAFF (STORE-001, 강남점, POS_STATS_READ만)
```

### pos.dummy.ts
```ts
DUMMY_POS_SUMMARY: PosSummary         // { totalSales, customerCount, avgSpend, compareRatio }
DUMMY_TREND_HOUR: TrendPoint[]        // 9시~21시 (13개)
DUMMY_TREND_DATE: TrendPoint[]        // 01/01~01/30 (30개)
DUMMY_TREND_WEEKDAY: TrendPoint[]     // 월~일 (7개)
DUMMY_TREND_PERIOD: TrendPoint[]      // 기간별
DUMMY_ITEMS: ItemRank[]               // 단품 100개 (OTC/RX/ETC)
STORE_OPTIONS: { value, label }[]     // 매장 5개
REGION_STORE_MAP: Record<string, string[]>
```

### settlement.dummy.ts
```ts
DUMMY_SETTLEMENT: {
  breakdown: PaymentBreakdown[]  // CARD/CASH/POINT/ETC 4개
  dailyTrend: DailyPayment[]     // 30일치
}
```

### card.dummy.ts
```ts
DUMMY_CARD_SUMMARY: CardCompanySummary[]  // 삼성/BC/현대/신한/KB/롯데 6개
DUMMY_APPROVALS: CardApproval[]           // 200건 (APPROVED/CANCELLED/ERROR)
CARD_OPTIONS: { value, label }[]
```

### platform.dummy.ts
```ts
DUMMY_PLATFORM_KPI: { totalSales, totalCustomerCount, activeFranchiseCount, activeStoreCount, compareRatio }
DUMMY_FRANCHISES: FranchiseSummary[]  // 12개 프랜차이즈
DUMMY_PLATFORM_USERS: PlatformUser[] // 26명
DUMMY_ANOMALIES: AnomalyAlert[]      // 이상 징후 매장 (매출 -30% 이상)
DUMMY_TREND_PLATFORM: PlatformTrend[]// 30일 플랫폼 전체 트렌드
```

---

## 7. 공통 유틸리티

### formatters.ts
```ts
formatKRW(number)       // 152,000,000원
formatNumber(number)    // 3,120
formatRatio(number)     // 5.2%
formatDate(string)      // '20250101' → '2025-01-01'
formatDateTime(string)  // 'T' → ' '
```

### dummy.helpers.ts
```ts
paginateArray<T>(items, page, size): PageResult<T>
// page: 0-based (Spring Pageable 규칙)
// 반환: { content, totalElements, totalPages, numberOfElements, first, last, pageNumber, pageSize }
```

### chartColors.ts
```ts
// 결제수단 도넛/스택바 공용 색상
PAYMENT_COLOR_LIST: readonly string[]            // 인덱스 기반 (도넛 Cell)
PAYMENT_COLORS: Record<string, string>           // 이름 기반 { 카드, 현금, 포인트, 기타 }
PAYMENT_COLOR_FALLBACK: string                   // 매핑 없을 때 기본색

// 프랜차이즈 랭킹 바차트
FRANCHISE_RANK_COLORS: readonly string[]         // 8색 블루~인디고 계열
```

### ChartTooltip.ts (컴포넌트 아님, 상수 파일)
```ts
// 모든 recharts <Tooltip>에 스프레드해서 사용
import { TOOLTIP_PROPS } from '@/components/charts/ChartTooltip';
<Tooltip {...TOOLTIP_PROPS} formatter={...} />
// 또는 개별 props만 꺼내기 (cursor 제외 시):
<Tooltip
  contentStyle={TOOLTIP_PROPS.contentStyle}
  labelStyle={TOOLTIP_PROPS.labelStyle}
  itemStyle={TOOLTIP_PROPS.itemStyle}
  formatter={...}
/>
```

---

## 8. UI 컴포넌트 사용 패턴

### Button
```tsx
<Button>조회</Button>
<Button variant="secondary" size="sm">취소</Button>
<Button variant="danger">삭제</Button>
<Button variant="ghost">닫기</Button>
// variant: primary(기본, 파랑) | secondary(흰배경) | danger(빨강) | ghost(투명)
// size: sm | md(기본) | lg
// inline-flex items-center gap-1.5 → 아이콘 자동 정렬
```

### KpiCard
```tsx
<KpiCard
  label="매출액"
  value={formatKRW(152000000)}
  compareRatio={5.2}         // 양수: 초록▲, 음수: 빨강▼
  subLabel="전월 대비"       // 선택
  icon={<TrendingUp size={15} />}  // lucide 아이콘, ReactNode
/>
```

### Table (제네릭)
```tsx
<Table<MyType>
  columns={[
    { key: 'field', header: '컬럼명' },
    { key: 'field2', header: '금액', render: (row) => formatKRW(row.amount), className: 'text-right' },
  ]}
  data={items}
  rowKey={(row) => row.id}
  onRowClick={(row) => navigate(`/detail/${row.id}`)}  // 선택
  rowClassName={(row) => row.status === 'ERROR' ? 'bg-red-50' : ''}  // 선택
/>
```

### Modal
```tsx
const [open, setOpen] = useState(false);
<Modal open={open} onClose={() => setOpen(false)} title="모달 제목" size="md">
  {/* 내용 */}
</Modal>
// size: sm(max-w-sm) | md(max-w-md, 기본) | lg(max-w-2xl)
// 배경 클릭 → 닫힘, body overflow 자동 잠금
```

### Pagination
```tsx
<Pagination
  page={page}               // 0-based
  totalPages={result.totalPages}
  totalElements={result.totalElements}
  size={PAGE_SIZE}
  onPageChange={setPage}    // (page: number) => void
/>
```

---

## 9. 디자인 시스템

### 레이아웃
- **최대 너비**: `max-w-[1280px] mx-auto` (AppLayout에서 적용)
- **사이드바**: `w-48 bg-slate-900` 고정
- **헤더**: `h-12 bg-white border-b border-gray-100`
- **페이지 패딩**: `px-6 py-5`
- **섹션 간격**: `gap-4` (PageContainer flex-col)

### 카드/패널 스타일 (표준)
```
bg-white rounded-lg border border-gray-100 p-4 shadow-sm
```

### 섹션 헤딩 (표준)
```
text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3
```

### 색상 팔레트
| 용도 | 클래스 |
|---|---|
| 배경 | `bg-slate-50` |
| 카드 배경 | `bg-white` |
| 사이드바 | `bg-slate-900` |
| 주요 액션 | `bg-blue-600` |
| 성장(양수) | `text-emerald-500` |
| 감소(음수) | `text-red-400` |
| 경고 알림 | `bg-red-50 border-red-200` |
| 텍스트 주 | `text-gray-900` |
| 텍스트 보조 | `text-gray-500`, `text-gray-400` |

### 아이콘 (lucide-react)
- KPI 카드 아이콘: `size={15}` 전달
- 버튼 내 아이콘: `size={13}` (Button의 `gap-1.5`로 자동 간격)
- 경고/상태 아이콘: `size={16}`
- 이모지 사용 금지 — 전부 lucide-react SVG로 대체됨

### 로고마크
```tsx
// Sidebar.tsx와 LoginPage.tsx에 동일한 SVG 십자 로고
<div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="5.5" y="1" width="3" height="12" rx="1" fill="white" />
    <rect x="1" y="5.5" width="12" height="3" rx="1" fill="white" />
  </svg>
</div>
```

---

## 10. 페이지별 주요 로직

### PosStatisticsPage (`/pos/statistics`)
- `shouldShowStoreSelector(role)` → 매장 선택기 표시 여부 결정
- `axisType`: HOUR | DATE | WEEKDAY | PERIOD → `getTrendData()` 분기
- `category` 필터 → `DUMMY_ITEMS` filter → `paginateArray()`
- 단품 행 클릭 → `navigate('/pos/items/:itemCode')`
- `can('EXPORT_DATA')` → 엑셀 버튼 표시

### SettlementPage (`/settlement`)
- `viewMode`: daily | period → 기간별 추이 차트 조건부 렌더
- `selectedPayments` 필터 → `filteredBreakdown` → KPI 재계산

### CardApprovalPage (`/card/approvals`)
- 카드사 요약: `grid-cols-3`
- 승인내역 상태별 row 색상: `CANCELLED` → 주황, `ERROR` → 빨강
- `filtered` = 카드사 + 상태 + 날짜 + 매장 복합 필터

### PlatformDashboardPage (`/platform/dashboard`)
- `DUMMY_ANOMALIES` > 0 → 이상징후 알림 박스 표시
- `paginateArray(DUMMY_FRANCHISES, page, 10)` → 프랜차이즈 테이블

### TenantManagePage (`/platform/tenants`)
- react-hook-form으로 생성/수정 모달 구현
- 상태 변경(ACTIVE ↔ SUSPENDED) 확인 모달
- 로컬 state로 DUMMY_FRANCHISES 복사본 관리 (API 연동 전까지)

### UserManagePage (`/platform/users`)
- `FRANCHISE_ADMIN` 접속 시 자신의 franchiseId로 고정 필터
- 역할 선택에 따라 초대 모달의 storeId/regionId 필드 조건부 표시

---

## 11. 빌드 / 개발 명령어

```bash
bun run dev      # 개발 서버 (--open으로 브라우저 자동 열림)
bun run build    # 프로덕션 빌드 → dist/
bun run preview  # 빌드 결과 미리보기
bun run check    # Biome lint + format
```

**현재 빌드 결과** (경고 0건):
```
dist/static/css/index.css     33.5 kB
dist/static/js/index.js       76.3 kB   (앱 코드)
dist/static/js/lib-router.js  85.0 kB   (react-router)
dist/static/js/lib-react.js   189.7 kB  (react)
dist/static/js/[chunk].js     424.5 kB  (recharts 등)
Total: ~815 kB
```

---

## 12. API 연동 전환 가이드

현재 더미 데이터는 `src/data/*.dummy.ts`에 집중되어 있어, API 연동 시 해당 파일만 교체하면 됩니다.

```
src/data/branding.dummy.ts  → GET /api/platform/branding
src/data/pos.dummy.ts       → GET /api/pos/statistics, /api/pos/items
src/data/settlement.dummy.ts→ GET /api/settlement
src/data/card.dummy.ts      → GET /api/card/approvals
src/data/platform.dummy.ts  → GET /api/platform/dashboard, /api/franchises, /api/users
src/data/auth.dummy.ts      → POST /api/auth/login (JWT 반환)
                               POST /api/platform/auth/login (플랫폼 관리자 전용)
```

`paginateArray()` 함수는 Spring Page 응답 형식과 동일한 구조를 반환하도록 설계되어 있어, API 교체 후에도 `PageResult<T>` 타입과 `Pagination` 컴포넌트는 그대로 사용 가능합니다.

---

## 13. 주요 설계 결정 및 주의사항

1. **SWC nullish 연산 주의**: `??`와 `||` 혼용 시 괄호 필수
   ```ts
   // 잘못됨 (SWC 파싱 오류)
   const x = a ?? b || c;
   // 올바름
   const x = (a ?? b) || c;
   ```

2. **`source.alias` 사용 금지**: rsbuild에서 deprecated. `resolve.alias` 사용

3. **TypeScript strict**: `noUnusedLocals`, `noUnusedParameters` 활성화 — 미사용 변수는 빌드 오류 발생

4. **이모지 사용 금지**: 모든 아이콘은 lucide-react SVG로. 이모지는 올드하고 플랫폼별 렌더링 불일치 발생

5. **recharts `ResponsiveContainer`**: 차트 컴포넌트는 반드시 `width="100%"`로 감싸야 함

6. **router/index.tsx의 `🚫` 이모지**: RoleGuard 403 메시지에 이모지 1개 잔존. 개선 시 lucide `Ban` 아이콘으로 교체 권장

7. **브랜딩 설정 (`branding.dummy.ts`)**: `serviceName`과 `loginTagline`은 한 파일만 수정하면 LoginPage·Sidebar·브라우저 탭 전체 반영. `loginTagline`에는 조사(을/를)를 포함해 직접 작성 (예: `'슈퍼팜을 위한'`). `App.tsx`에서 `document.title = BRANDING.serviceName`으로 런타임 탭 제목 설정.

8. **플랫폼 관리자 로그인 분리**: `PLATFORM_ADMIN`은 `/platform/login`(PlatformLoginPage)에서만 인증. 일반 `/login`에서 PLATFORM_ADMIN credentials 입력 시 거부 메시지 표시. `PrivateRoute`는 `/platform/*` 경로 미인증 접근 시 `/platform/login`으로 분기.

9. **차트 색상 공유 패턴**: 결제수단 관련 차트(DonutChart, StackBarChart)는 `chartColors.ts`의 `PAYMENT_COLOR_LIST` / `PAYMENT_COLORS`를 사용. 새 차트 추가 시 로컬 색상 배열 정의 금지 — 반드시 `chartColors.ts`에 상수 추가 후 import.

10. **recharts 도넛 중앙 텍스트**: recharts `<Label>` 컴포넌트의 `content` 콜백에서 받는 `viewBox`는 recharts 버전에 따라 `cx/cy` 미보장. **SVG text 대신 CSS absolute overlay 방식 사용**:
    ```tsx
    // 올바름 — CSS overlay (PaymentDonutChart 참고)
    <div className="relative">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart><Pie cy="45%" .../></PieChart>
      </ResponsiveContainer>
      <div className="absolute pointer-events-none text-center"
           style={{ top: '126px', left: '50%', transform: 'translate(-50%, -50%)' }}>
        {/* top = height(280) × cy(0.45) = 126px */}
        <div>합계</div><div>{formatCenter(total)}</div>
      </div>
    </div>
    // 잘못됨 — viewBox.cx/cy fallback 0 → 좌상단 렌더링
    <Label content={(props) => <text x={props.viewBox?.cx ?? 0} .../>} />
    ```
