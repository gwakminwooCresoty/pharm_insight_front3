# PharmInsight POS 기능정의서

> **버전** v2.0 · **작성일** 2025-02-20 · **상태** 멀티 테넌시 구조 반영  
> **주요 변경** 멀티 프랜차이즈 URL 구조 · 역할 기반 접근 제어(RBAC) · 플랫폼 관리자 API · Spring Pageable 페이지네이션

---

## 목차

1. [문서 개요](#1-문서-개요)
2. [멀티 테넌시 아키텍처](#2-멀티-테넌시-아키텍처)
   - 2-1. [프랜차이즈 계층 구조](#2-1-프랜차이즈-계층-구조)
   - 2-2. [역할 정의 (RBAC)](#2-2-역할-정의-rbac)
   - 2-3. [역할별 기능 접근 매트릭스](#2-3-역할별-기능-접근-매트릭스)
   - 2-4. [API URL 네이밍 전략](#2-4-api-url-네이밍-전략)
   - 2-5. [JWT 토큰 구조](#2-5-jwt-토큰-구조)
   - 2-6. [프랜차이즈 격리 메커니즘](#2-6-프랜차이즈-격리-메커니즘)
3. [Spring Pageable 공통 규격](#3-spring-pageable-공통-규격)
4. [기능 목록](#4-기능-목록)
5. [기능별 상세 정의](#5-기능별-상세-정의)
   - 5-1. [POS 실적 통합 조회](#5-1-pos-실적-통합-조회-위치실적)
   - 5-2. [CR정산서 (결제수단별 실적)](#5-2-일일결산-cr정산서-결제수단별-실적)
   - 5-3. [카드승인 조회](#5-3-카드승인-조회-카드사별-승인-내역)
6. [플랫폼 관리자 전용 API](#6-플랫폼-관리자-전용-api)
   - 6-1. [전체 프랜차이즈 현황 대시보드](#6-1-전체-프랜차이즈-현황-대시보드)
   - 6-2. [프랜차이즈 관리](#6-2-프랜차이즈-관리)
   - 6-3. [사용자 및 권한 관리](#6-3-사용자-및-권한-관리)
7. [API 목록 요약](#7-api-목록-요약)
8. [공통 사항](#8-공통-사항)
9. [변경 이력](#9-변경-이력)

---

## 1. 문서 개요

| 항목 | 내용 |
|------|------|
| 문서명 | PharmInsight POS 기능정의서 (API + 화면 설계) |
| 버전 | v2.0 |
| 작성일 | 2025-02-20 |
| 대상 시스템 | PharmInsight — 약국 체인 매장 POS 분석 플랫폼 (캣포스 연동) |
| 작성 근거 | 1차 요구사항 + 멀티 테넌시 구조 / RBAC / Spring Pageable 반영 |
| 기술 스택 | Java 21, Spring Boot 3.x, PostgreSQL, React 19, REST API |
| 전버전 대비 변경 | v1.0 단일 프랜차이즈 구조 → 멀티 프랜차이즈 URL 체계, RBAC, 플랫폼 관리자 API, Spring Pageable 규격 전면 반영 |

---

## 2. 멀티 테넌시 아키텍처

### 2-1. 프랜차이즈 계층 구조

PharmInsight는 **3계층 프랜차이즈 구조**로 운영된다. 각 계층은 완전히 격리되며, 상위 계층은 하위 계층을 조망할 수 있다.

```
Platform  (플랫폼 전체)
├── Franchise A  (프랜차이즈 / 브랜드 단위 — 프랜차이즈 격리 기본 단위)
│   ├── Region A-1  (지역 본부, 선택적 계층)
│   │   ├── Store A-1-1  (개별 매장 — 캣포스 POS 연동)
│   │   └── Store A-1-2
│   └── Store A-2  (지역 없이 프랜차이즈 직속)
└── Franchise B
    └── Store B-1
```

| 계층 | 식별자 | 설명 |
|------|--------|------|
| Platform | — | 플랫폼 전체. 모든 프랜차이즈를 조망 |
| Franchise | `franchiseId` | 개별 프랜차이즈(브랜드). **데이터 격리의 기본 단위** |
| Region | `regionId` | 지역 본부 (선택적 계층. 프랜차이즈 설정으로 활성화) |
| Store | `storeId` | 개별 약국 매장. 캣포스 POS와 직접 연동 |

> **핵심 원칙**: `franchiseId`가 프랜차이즈 격리의 기본 단위이다. 모든 데이터는 `franchise_id` 컬럼으로 파티셔닝되며, 어떤 경로로도 타 프랜차이즈 데이터에 접근할 수 없다.

---

### 2-2. 역할 정의 (RBAC)

| 역할 코드 | 역할명 | 소속 계층 | 설명 |
|-----------|--------|-----------|------|
| `PLATFORM_ADMIN` | 플랫폼 관리자 | Platform | 전체 프랜차이즈 조망 및 플랫폼 운영 |
| `FRANCHISE_ADMIN` | 프랜차이즈 관리자 | Franchise | 소속 프랜차이즈 전체 매장 관리 |
| `FRANCHISE_VIEWER` | 프랜차이즈 열람자 | Franchise | 소속 프랜차이즈 데이터 조회만 가능 |
| `REGION_MANAGER` | 지역 관리자 | Region | 소속 지역 내 매장만 관리 |
| `STORE_MANAGER` | 매장 관리자 | Store | 소속 매장 데이터 관리 |
| `STORE_STAFF` | 매장 직원 | Store | 소속 매장 제한된 기능만 조회 |

---

### 2-3. 역할별 기능 접근 매트릭스

| 기능 | PLATFORM_ADMIN | FRANCHISE_ADMIN | FRANCHISE_VIEWER | REGION_MANAGER | STORE_MANAGER | STORE_STAFF |
|------|:--------------:|:---------------:|:----------------:|:--------------:|:-------------:|:-----------:|
| POS 실적 (전체 프랜차이즈 비교) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| POS 실적 (프랜차이즈 내 전체) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| POS 실적 (매장 간 비교) | ✅ | ✅ | ✅ | ✅ 지역 내 | ❌ | ❌ |
| CR정산서 조회 | ✅ | ✅ | ✅ | ✅ 지역 내 | ✅ | ❌ |
| 카드승인 내역 조회 | ✅ | ✅ | ✅ | ✅ 지역 내 | ✅ | ❌ |
| 단품 실적 상세 조회 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 데이터 다운로드 (엑셀/PDF) | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| 프랜차이즈 관리 (생성·수정·삭제) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 사용자·권한 관리 | ✅ | ✅ 프랜차이즈 내 | ❌ | ❌ | ❌ | ❌ |
| 플랫폼 전체 대시보드 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

### 2-4. API URL 네이밍 전략

역할에 따라 **3가지 URL Prefix**를 사용한다.

```
# 1. 플랫폼 관리자 전용 — 모든 프랜차이즈 접근 가능
/api/v1/platform/...

# 2. 프랜차이즈 범위 — franchiseId로 프랜차이즈 격리
/api/v1/franchises/{franchiseId}/...

# 3. 매장 범위 — 단일 매장 접근
/api/v1/franchises/{franchiseId}/stores/{storeId}/...
```

**URL 접근 제어 원칙**

| 역할 | 접근 가능 Prefix | 검증 조건 |
|------|-----------------|-----------|
| `PLATFORM_ADMIN` | `/platform/` | 별도 검증 없음 (전체 허용) |
| `FRANCHISE_ADMIN` / `FRANCHISE_VIEWER` | `/franchises/{franchiseId}/` | URL의 `{franchiseId}` == JWT의 `franchiseId` |
| `REGION_MANAGER` | `/franchises/{franchiseId}/` | 위 동일. 단, 응답 데이터는 소속 `regionId` 매장으로 서버 자동 필터링 |
| `STORE_MANAGER` / `STORE_STAFF` | `/franchises/{franchiseId}/stores/{storeId}/` | URL의 `{storeId}` == JWT의 `storeId`. 불일치 시 403 |

---

### 2-5. JWT 토큰 구조

모든 API 요청 헤더에 `Authorization: Bearer {JWT}` 포함. JWT Payload에 아래 클레임이 포함된다.

```jsonc
{
  "sub": "user-uuid-1234",
  "role": "FRANCHISE_ADMIN",       // 역할 코드
  "franchiseId": "FRAN-001",       // 소속 프랜차이즈 ID (PLATFORM_ADMIN은 null)
  "regionId": "REGION-01",         // 소속 지역 ID (해당 없으면 null)
  "storeId": null,                 // 소속 매장 ID (Store 역할만 값 존재)
  "permissions": [                 // 세부 기능 권한 목록
    "POS_STATS_READ",
    "SETTLEMENT_READ",
    "CARD_APPROVAL_READ",
    "EXPORT_DATA"
  ],
  "iat": 1740000000,
  "exp": 1740086400
}
```

**Permission 코드 정의**

| Permission | 설명 | 기본 부여 역할 |
|------------|------|---------------|
| `POS_STATS_READ` | POS 실적 조회 | 전 역할 |
| `SETTLEMENT_READ` | CR정산서 조회 | `FRANCHISE_ADMIN` 이상, `STORE_MANAGER` |
| `CARD_APPROVAL_READ` | 카드승인 내역 조회 | `FRANCHISE_ADMIN` 이상, `STORE_MANAGER` |
| `EXPORT_DATA` | 데이터 다운로드 (엑셀/PDF) | `FRANCHISE_ADMIN`, `REGION_MANAGER`, `STORE_MANAGER` |
| `USER_MANAGE` | 사용자·권한 관리 | `PLATFORM_ADMIN`, `FRANCHISE_ADMIN` |
| `FRANCHISE_MANAGE` | 프랜차이즈 관리 | `PLATFORM_ADMIN` 전용 |
| `PLATFORM_DASHBOARD` | 플랫폼 전체 대시보드 | `PLATFORM_ADMIN` 전용 |

---

### 2-6. 프랜차이즈 격리 메커니즘

```
클라이언트 요청
    │
    ▼
[1] JWT 파싱
    └─ franchiseId / storeId / role / permissions 추출
    │
    ▼
[2] URL Path Variable 검증 (Spring Security Filter)
    ├─ FRANCHISE_* : URL {franchiseId} == JWT.franchiseId  →  불일치 시 403
    ├─ STORE_*     : URL {storeId}    == JWT.storeId       →  불일치 시 403
    └─ PLATFORM_ADMIN : 모든 franchiseId 허용
    │
    ▼
[3] Permission 검증
    └─ JWT.permissions에 해당 API 권한 포함 여부 확인  →  미포함 시 403
    │
    ▼
[4] DB 쿼리 시 franchise_id 자동 주입 (Spring AOP — @TenantFilter)
    └─ 모든 Repository 쿼리에 WHERE franchise_id = ? 자동 삽입
    │
    ▼
[5] REGION_MANAGER 추가 필터
    └─ JWT.regionId 기반 storeIds 자동 필터링
    │
    ▼
응답 반환
```

> **Spring AOP 적용**: `@TenantFilter` 커스텀 어노테이션을 통해 모든 Repository 쿼리에 `franchise_id` 조건이 자동 삽입된다. 개발자가 조건을 누락해도 격리가 보장되는 구조이다.

---

## 3. Spring Pageable 공통 규격

페이지네이션이 필요한 모든 API는 Spring Data의 `Pageable` 인터페이스 규격을 따른다.

### Request — Pageable 파라미터

Spring `PageableHandlerMethodArgumentResolver` 기본 규격을 사용한다.

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | Integer | `0` | 페이지 번호 (**0-based**). 첫 페이지 = 0 |
| `size` | Integer | `20` | 페이지 당 데이터 건수. 최대값은 API별 지정 |
| `sort` | String | API별 지정 | 정렬 조건. 형식: `필드명,asc\|desc`. 복수 지정 가능 |

**호출 예시**

```
# 첫 번째 페이지, 20건, 승인일시 내림차순
GET /api/v1/franchises/FRAN-001/pos/card/approvals
    ?startDate=20250201&endDate=20250220
    &page=0&size=20&sort=approvedAt,desc

# 두 번째 페이지, 다중 정렬 (금액 오름차순 + 승인일시 내림차순)
GET /api/v1/franchises/FRAN-001/pos/card/approvals
    ?startDate=20250201&endDate=20250220
    &page=1&size=20&sort=amount,asc&sort=approvedAt,desc
```

### Response — Page\<T\> 공통 구조

Spring `Page<T>` 직렬화 기본 구조를 따른다.

```jsonc
{
  "success": true,
  "code": "SUCCESS",
  "data": {
    // API별 비페이징 필드 (summary, cardSummary 등) ...

    // 페이징 영역
    "content": [ /* 실제 데이터 목록 */ ],
    "pageable": {
      "pageNumber": 0,           // 현재 페이지 (0-based)
      "pageSize": 20,            // 페이지 크기
      "sort": {
        "sorted": true,
        "orders": [
          { "property": "approvedAt", "direction": "DESC" }
        ]
      },
      "offset": 0,
      "unpaged": false
    },
    "totalElements": 4180,       // 전체 데이터 건수
    "totalPages": 209,           // 전체 페이지 수
    "numberOfElements": 20,      // 현재 페이지 실제 건수
    "first": true,               // 첫 페이지 여부
    "last": false,               // 마지막 페이지 여부
    "empty": false               // 데이터 없음 여부
  }
}
```

### API별 Pageable 적용 여부 및 기본값

| API ID | 페이지네이션 | 기본 size | 최대 size | 기본 sort |
|--------|:-----------:|-----------|-----------|-----------|
| API-POS-001 / 001-S | ✅ 단품 목록 | 20 | 100 | `sales,desc` |
| API-POS-002 | ❌ 단건 상세 | — | — | — |
| API-CR-001 / 001-S | ❌ 집계 결과 | — | — | — |
| API-CARD-001 / 001-S | ✅ 승인 내역 | 20 | 100 | `approvedAt,desc` |
| API-PLAT-001 | ✅ 프랜차이즈 목록 | 10 | 50 | `totalSales,desc` |
| API-PLAT-002-L | ✅ | 20 | 100 | `createdAt,desc` |
| API-PLAT-003-L / L-F | ✅ | 20 | 100 | `createdAt,desc` |

> `size` 최대값 초과 요청 시 `400 Bad Request` 반환. 메시지: `"size must not exceed {max}"`

---

## 4. 기능 목록

| No | 구분 | 기능 ID | 기능명 | 접근 가능 역할 | 화면 위치 |
|----|------|---------|--------|---------------|-----------|
| 1 | 위치실적 | FUNC-POS-001 | POS 실적 통합 조회 | 전 역할 (범위 자동 제한) | 주제통계 > 상품별/일자별 |
| 2 | 위치실적 | FUNC-POS-002 | 단품 실적 상세 조회 | 전 역할 | 주제통계 > 상품별통계 |
| 3 | 일일결산 | FUNC-CR-001 | CR정산서 (결제수단별) | `FRANCHISE_ADMIN` 이상, `STORE_MANAGER` | HOME > 주제통계 > 결제수단별 |
| 4 | 카드승인 | FUNC-CARD-001 | 카드사별 승인 내역 조회 | `FRANCHISE_ADMIN` 이상, `STORE_MANAGER` | 승인내역 |
| 5 | 플랫폼 | FUNC-PLAT-001 | 전체 프랜차이즈 현황 대시보드 | `PLATFORM_ADMIN` | 플랫폼 관리 > 대시보드 |
| 6 | 플랫폼 | FUNC-PLAT-002 | 프랜차이즈 관리 (CRUD) | `PLATFORM_ADMIN` | 플랫폼 관리 > 프랜차이즈 |
| 7 | 플랫폼 | FUNC-PLAT-003 | 사용자 및 권한 관리 | `PLATFORM_ADMIN`, `FRANCHISE_ADMIN` | 관리 > 사용자 |

---

## 5. 기능별 상세 정의

---

### 5-1. POS 실적 통합 조회 (위치실적)

#### 기능 개요

| 항목 | 내용 |
|------|------|
| 기능 ID | FUNC-POS-001 |
| 기능명 | POS 실적 통합 조회 (OTC 포함) |
| 화면 위치 | 주제통계 > 상품별통계 / 기간통계 > 일자별통계 |
| 캣포스 연동 | 캣포스 POS 매출 데이터 API 연동 (OTC 外 포함) |
| 활용 목적 | 단품 기준 판매량/매출 관리, 일마감 실적 관리, 단품별 고객 선호도 분석, 기간 비교 실적 분석 |
| 접근 역할 | 전 역할 (단, 조회 범위는 역할에 따라 자동 제한) |

#### 역할별 조회 범위

| 역할 | 조회 가능 범위 | 매장 선택 UI |
|------|--------------|--------------|
| `PLATFORM_ADMIN` | 전체 프랜차이즈 + 전체 매장 | 프랜차이즈 선택 → 매장 선택 2단계 |
| `FRANCHISE_ADMIN` / `FRANCHISE_VIEWER` | 소속 프랜차이즈 내 전체 매장 | 매장 MultiSelect |
| `REGION_MANAGER` | 소속 지역 내 매장만 | 지역 내 매장 MultiSelect |
| `STORE_MANAGER` / `STORE_STAFF` | 소속 매장 단일 고정 | 매장 선택 UI 미노출 (고정) |

#### 조회 조건 (검색 필터)

| No | 필터명 | 입력 유형 | 설명 |
|----|--------|-----------|------|
| 1 | 조회 기간 | DateRangePicker | 시작일 ~ 종료일 |
| 2 | 조회 축 | Radio Button | `시간대별` / `일자별` / `요일별` / `기간별` |
| 3 | 매장 선택 | MultiSelect Dropdown | 역할에 따라 선택 범위 자동 제한 |
| 4 | 상품 분류 | Dropdown | 전체 / OTC / 처방의약품 / 기타 |
| 5 | 비교 기간 | DateRangePicker | 기간 비교 분석 시 사용 (선택) |

#### 조회 지표

| No | 지표명 | 단위 | 설명 |
|----|--------|------|------|
| 1 | 매출액 | 원 (KRW) | 조회 기간 내 총 매출 합계 |
| 2 | 객수 | 명 | 방문 고객 수 (영수증 건수 기준) |
| 3 | 객단가 | 원 (KRW) | 매출액 ÷ 객수 |
| 4 | 단품 판매수량 | 개 | 단품 기준 판매 수량 |
| 5 | 단품 매출액 | 원 (KRW) | 단품 기준 매출액 합계 |
| 6 | 전기 대비 증감 | %, 원 | 비교 기간 선택 시 증감율 표시 |

#### 화면 레이아웃 설계

| 구성 요소 | 설명 |
|-----------|------|
| ① 상단 필터 영역 | 조회기간, 조회축, 매장선택(역할별 제한), 상품분류. [조회] 버튼 실행 |
| ② KPI 요약 카드 | 매출액 / 객수 / 객단가 카드 배치. 전기 대비 증감 배지 표시 |
| ③ 트렌드 차트 | 선택 조회축 기준 매출액 추이 라인/바 차트. 기간비교 시 2개 시계열 |
| ④ 단품 순위 테이블 | 단품명 / 판매수량 / 매출액 / 구성비. Spring Pageable 페이지네이션 적용. `EXPORT_DATA` 권한 보유 시 다운로드 버튼 노출 |
| ⑤ 탭 구조 | [상품별통계 탭] / [일자별통계 탭] 전환 |
| ⑥ 매장 비교 뷰 | `FRANCHISE_ADMIN` 이상만 노출. 선택 매장 간 실적 나란히 비교 |

#### API 정의

---

**API-POS-001 · 프랜차이즈 POS 실적 통합 조회**

> 적용 역할: `FRANCHISE_ADMIN`, `FRANCHISE_VIEWER`, `REGION_MANAGER`  
> `REGION_MANAGER` 호출 시 서버에서 소속 지역 매장으로 자동 필터링

```
GET /api/v1/franchises/{franchiseId}/pos/sales/statistics
Authorization: Bearer {JWT}
```

**Request Parameters**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|----------|------|------|:----:|------|
| `franchiseId` | Path | String | Y | 프랜차이즈 ID (JWT와 일치 검증) |
| `startDate` | Query | String (YYYYMMDD) | Y | 조회 시작일 |
| `endDate` | Query | String (YYYYMMDD) | Y | 조회 종료일 |
| `axisType` | Query | Enum | Y | `HOUR` / `DATE` / `WEEKDAY` / `PERIOD` |
| `storeIds` | Query | List\<String\> | N | 매장 ID 목록 (미입력 시 접근 가능 전체) |
| `categoryCode` | Query | String | N | `ALL` / `OTC` / `RX` / `ETC` (default: `ALL`) |
| `compareStartDate` | Query | String (YYYYMMDD) | N | 비교 기간 시작일 |
| `compareEndDate` | Query | String (YYYYMMDD) | N | 비교 기간 종료일 |
| `page` | Query | Integer | N | 단품 목록 페이지. **0-based**, default: `0` |
| `size` | Query | Integer | N | default: `20`, max: `100` |
| `sort` | Query | String | N | default: `sales,desc`. 허용 필드: `sales`, `qty`, `ratio` |

**Response Body**

```jsonc
{
  "success": true,
  "code": "SUCCESS",
  "data": {
    "franchiseId": "FRAN-001",
    "franchiseName": "○○약국 체인",
    // 비페이징 집계 요약
    "summary": {
      "totalSales": 152000000,
      "customerCount": 3120,
      "avgSpend": 48717,
      "compareRatio": 5.2       // 전기 대비 증감율 (%). compareStartDate 입력 시에만 반환
    },
    "trend": [
      {
        "axis": "09",           // 조회축 레이블 (시간대/일자/요일)
        "sales": 12000000,
        "customers": 240,
        "compareSales": 11400000 // compareStartDate 입력 시에만 반환
      }
    ],
    // 단품 목록 — Spring Page<T> 구조
    "content": [
      {
        "itemCode": "ITEM001",
        "itemName": "타이레놀 500mg",
        "qty": 1520,
        "sales": 7600000,
        "ratio": 5.0
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20,
      "sort": { "sorted": true, "orders": [{ "property": "sales", "direction": "DESC" }] },
      "offset": 0,
      "unpaged": false
    },
    "totalElements": 320,
    "totalPages": 16,
    "numberOfElements": 20,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

---

**API-POS-001-S · 매장 단위 POS 실적 조회**

> 적용 역할: `STORE_MANAGER`, `STORE_STAFF`  
> JWT의 `storeId`와 Path `{storeId}` 불일치 시 403

```
GET /api/v1/franchises/{franchiseId}/stores/{storeId}/pos/sales/statistics
Authorization: Bearer {JWT}
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|----------|------|------|:----:|------|
| `franchiseId` | Path | String | Y | 프랜차이즈 ID |
| `storeId` | Path | String | Y | 매장 ID (JWT storeId와 일치 검증) |
| `startDate` | Query | String (YYYYMMDD) | Y | 조회 시작일 |
| `endDate` | Query | String (YYYYMMDD) | Y | 조회 종료일 |
| `axisType` | Query | Enum | Y | `HOUR` / `DATE` / `WEEKDAY` / `PERIOD` |
| `categoryCode` | Query | String | N | `ALL` / `OTC` / `RX` / `ETC` |
| `compareStartDate` | Query | String (YYYYMMDD) | N | 비교 기간 시작일 |
| `compareEndDate` | Query | String (YYYYMMDD) | N | 비교 기간 종료일 |
| `page` | Query | Integer | N | **0-based**, default: `0` |
| `size` | Query | Integer | N | default: `20`, max: `100` |
| `sort` | Query | String | N | default: `sales,desc` |

Response 구조는 API-POS-001과 동일. `franchiseName` 대신 `storeId`, `storeName` 필드 포함.

---

**API-POS-002 · 단품 실적 상세 조회**

> 적용 역할: 전 역할 / 단건 상세 조회로 페이지네이션 미적용

```
GET /api/v1/franchises/{franchiseId}/pos/items/{itemCode}/detail
Authorization: Bearer {JWT}
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|----------|------|------|:----:|------|
| `franchiseId` | Path | String | Y | 프랜차이즈 ID |
| `itemCode` | Path | String | Y | 단품 코드 |
| `startDate` | Query | String (YYYYMMDD) | Y | 조회 시작일 |
| `endDate` | Query | String (YYYYMMDD) | Y | 조회 종료일 |
| `storeIds` | Query | List\<String\> | N | 매장 ID 목록 (역할별 자동 제한) |

**Response Body**

```jsonc
{
  "success": true,
  "code": "SUCCESS",
  "data": {
    "itemCode": "ITEM001",
    "itemName": "타이레놀 500mg",
    "category": "OTC",
    "totalQty": 1520,
    "totalSales": 7600000,
    "avgPrice": 5000,
    "storeBreakdown": [           // 매장별 판매 현황 (비페이징)
      {
        "storeId": "STORE-001",
        "storeName": "강남점",
        "qty": 320,
        "sales": 1600000,
        "ratio": 21.1
      }
    ]
  }
}
```

---

### 5-2. 일일결산 CR정산서 (결제수단별 실적)

#### 기능 개요

| 항목 | 내용 |
|------|------|
| 기능 ID | FUNC-CR-001 |
| 기능명 | CR정산서 — 결제수단별 실적 조회 |
| 화면 위치 | HOME > 주제통계 > 결제수단별 |
| 조회 주기 | 데일리 / 기간별 |
| 활용 목적 | 결제수단별 매출 구조 분석 (현금/카드/포인트 등 비중 파악) |
| 접근 역할 | `FRANCHISE_ADMIN`, `FRANCHISE_VIEWER`, `REGION_MANAGER`, `STORE_MANAGER` |
| 미접근 역할 | `STORE_STAFF` — 메뉴 자체 미노출 |
| 페이지네이션 | ❌ 결제수단 유형은 고정 분류이므로 집계 결과로 반환 |

#### 역할별 조회 범위

| 역할 | 조회 범위 |
|------|-----------|
| `FRANCHISE_ADMIN` / `FRANCHISE_VIEWER` | 소속 프랜차이즈 전체 매장 |
| `REGION_MANAGER` | 소속 지역 내 매장 (서버 자동 필터링) |
| `STORE_MANAGER` | 소속 매장 1개 고정 |

#### 조회 조건 (검색 필터)

| No | 필터명 | 입력 유형 | 설명 |
|----|--------|-----------|------|
| 1 | 조회 기간 | DateRangePicker | 데일리(단일일) 또는 기간 선택 |
| 2 | 매장 선택 | MultiSelect Dropdown | 역할에 따라 범위 자동 제한 |
| 3 | 결제수단 필터 | CheckBox Group | 전체 / 카드 / 현금 / 포인트 / 기타 (복수 선택) |

#### 조회 지표

| No | 지표명 | 단위 | 설명 |
|----|--------|------|------|
| 1 | 결제수단별 매출액 | 원 (KRW) | 결제수단 유형별 총 매출 합계 |
| 2 | 결제 건수 | 건 | 결제수단별 거래 건수 |
| 3 | 구성비 | % | 전체 매출 대비 결제수단별 비중 |
| 4 | 건당 평균 금액 | 원 (KRW) | 매출액 ÷ 건수 |

#### 화면 레이아웃 설계

| 구성 요소 | 설명 |
|-----------|------|
| ① 상단 필터 영역 | 조회기간(데일리/기간 토글), 매장선택(역할별 제한), 결제수단 필터 |
| ② 결제수단 파이차트 | 결제수단별 구성비 도넛 차트. 범례에 금액/건수 표시 |
| ③ 정산서 테이블 | 결제수단 / 매출액 / 건수 / 구성비 / 건당평균. 합계 행 하단 고정 |
| ④ 기간별 추이 차트 | 기간 조회 시 활성화. 결제수단별 스택 바 차트로 일별 추이 표시 |
| ⑤ 다운로드 | `EXPORT_DATA` 권한 보유 시에만 버튼 노출. 엑셀/PDF 선택 |

#### API 정의

---

**API-CR-001 · 프랜차이즈 결제수단별 정산 조회**

> 적용 역할: `FRANCHISE_ADMIN`, `FRANCHISE_VIEWER`, `REGION_MANAGER`

```
GET /api/v1/franchises/{franchiseId}/pos/settlement/payment-method
Authorization: Bearer {JWT}
```

**Request Parameters**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|----------|------|------|:----:|------|
| `franchiseId` | Path | String | Y | 프랜차이즈 ID |
| `startDate` | Query | String (YYYYMMDD) | Y | 조회 시작일 |
| `endDate` | Query | String (YYYYMMDD) | Y | 조회 종료일 |
| `storeIds` | Query | List\<String\> | N | 매장 ID 목록 (미입력 시 접근 가능 전체) |
| `paymentTypes` | Query | List\<Enum\> | N | `CARD` / `CASH` / `POINT` / `ETC` (미입력 시 전체) |

**Response Body**

```jsonc
{
  "success": true,
  "code": "SUCCESS",
  "data": {
    "franchiseId": "FRAN-001",
    "totalSales": 152000000,
    "totalCount": 4180,
    "breakdown": [
      {
        "paymentType": "CARD",
        "paymentName": "카드",
        "sales": 114000000,
        "count": 3020,
        "ratio": 75.0,
        "avgAmount": 37748
      },
      {
        "paymentType": "CASH",
        "paymentName": "현금",
        "sales": 30400000,
        "count": 890,
        "ratio": 20.0,
        "avgAmount": 34157
      }
    ],
    "dailyTrend": [               // 기간 조회 시에만 반환
      {
        "date": "20250220",
        "breakdown": [ /* 동일 구조 */ ]
      }
    ]
  }
}
```

---

**API-CR-001-S · 매장 단위 결제수단별 정산 조회**

> 적용 역할: `STORE_MANAGER`

```
GET /api/v1/franchises/{franchiseId}/stores/{storeId}/pos/settlement/payment-method
Authorization: Bearer {JWT}
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|----------|------|------|:----:|------|
| `franchiseId` | Path | String | Y | 프랜차이즈 ID |
| `storeId` | Path | String | Y | 매장 ID |
| `startDate` | Query | String (YYYYMMDD) | Y | 조회 시작일 |
| `endDate` | Query | String (YYYYMMDD) | Y | 조회 종료일 |
| `paymentTypes` | Query | List\<Enum\> | N | `CARD` / `CASH` / `POINT` / `ETC` |

Response 구조는 API-CR-001과 동일. `storeId`, `storeName` 필드 추가.

---

### 5-3. 카드승인 조회 (카드사별 승인 내역)

#### 기능 개요

| 항목 | 내용 |
|------|------|
| 기능 ID | FUNC-CARD-001 |
| 기능명 | 카드사별 승인 내역 조회 |
| 화면 위치 | 승인내역 |
| 조회 주기 | 데일리 / 기간별 |
| 활용 목적 | 카드사별 매출·승인 관리 (취소/오류 건 포함 추적) |
| 접근 역할 | `FRANCHISE_ADMIN`, `FRANCHISE_VIEWER`, `REGION_MANAGER`, `STORE_MANAGER` |
| 미접근 역할 | `STORE_STAFF` — 메뉴 자체 미노출 |
| 페이지네이션 | ✅ Spring Pageable 적용 (승인 내역 `content`) |

#### 조회 조건 (검색 필터)

| No | 필터명 | 입력 유형 | 설명 |
|----|--------|-----------|------|
| 1 | 조회 기간 | DateRangePicker | 데일리(단일일) 또는 기간 선택 |
| 2 | 카드사 선택 | MultiSelect Dropdown | 전체 / BC, 삼성, 현대, 신한, KB, 롯데 등 |
| 3 | 매장 선택 | MultiSelect Dropdown | 역할에 따라 범위 자동 제한 |
| 4 | 승인 상태 | Radio Button | 전체 / 정상 / 취소 / 오류 |
| 5 | 승인번호 | Text Input | 승인번호 직접 검색 (부분 일치) |

#### 승인 내역 컬럼

| No | 컬럼명 | 타입 | 설명 |
|----|--------|------|------|
| 1 | 거래일시 | DateTime | `YYYY-MM-DD HH:mm:ss` |
| 2 | 카드사명 | String | 삼성카드, BC카드 등 |
| 3 | 승인번호 | String | VAN사 발급 승인번호 |
| 4 | 승인금액 | Long | 거래 승인 금액 (원) |
| 5 | 할부개월 | Integer | 일시불: 0 / 할부: 개월 수 |
| 6 | 상태 | Enum | `APPROVED` / `CANCELLED` / `ERROR` |
| 7 | 매장명 | String | 승인 발생 매장명 |
| 8 | 카드번호 (마스킹) | String | 앞 6자리 + `****` + 끝 4자리 |

#### 화면 레이아웃 설계

| 구성 요소 | 설명 |
|-----------|------|
| ① 상단 필터 영역 | 기간, 카드사, 매장(역할별 제한), 승인상태, 승인번호 필터 |
| ② 카드사별 요약 카드 | 카드사별 승인금액/건수 카드 컴포넌트. 클릭 시 해당 카드사 필터 자동 적용 |
| ③ 승인 내역 그리드 | 전체 컬럼. Spring Pageable 기반 20건/페이지. 상태별 색상 구분 (취소: 주황, 오류: 빨강) |
| ④ 집계 요약 영역 | 하단 고정: `totalElements` 건수 / 총 승인금액 / 총 취소금액 |
| ⑤ 다운로드 | `EXPORT_DATA` 권한 보유 시에만 버튼 노출. 전체 결과 엑셀 다운로드 |

#### API 정의

---

**API-CARD-001 · 프랜차이즈 카드사별 승인 내역 조회**

> 적용 역할: `FRANCHISE_ADMIN`, `FRANCHISE_VIEWER`, `REGION_MANAGER`

```
GET /api/v1/franchises/{franchiseId}/pos/card/approvals
Authorization: Bearer {JWT}
```

**Request Parameters**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|----------|------|------|:----:|------|
| `franchiseId` | Path | String | Y | 프랜차이즈 ID |
| `startDate` | Query | String (YYYYMMDD) | Y | 조회 시작일 |
| `endDate` | Query | String (YYYYMMDD) | Y | 조회 종료일 |
| `cardCompanyCodes` | Query | List\<String\> | N | 카드사 코드 목록 |
| `storeIds` | Query | List\<String\> | N | 매장 ID 목록 |
| `approvalStatus` | Query | Enum | N | `APPROVED` / `CANCELLED` / `ERROR` |
| `approvalNo` | Query | String | N | 승인번호 검색 (부분 일치) |
| `page` | Query | Integer | N | **0-based**, default: `0` |
| `size` | Query | Integer | N | default: `20`, max: `100` |
| `sort` | Query | String | N | default: `approvedAt,desc`. 복수 가능: `sort=amount,asc&sort=approvedAt,desc` |

**Response Body**

```jsonc
{
  "success": true,
  "code": "SUCCESS",
  "data": {
    "franchiseId": "FRAN-001",
    // 비페이징 집계 요약
    "summary": {
      "totalApprovedAmount": 148000000,
      "totalCancelledAmount": 4000000,
      "totalCount": 4180
    },
    "cardSummary": [
      {
        "cardCompanyCode": "SAMSUNG",
        "cardCompanyName": "삼성카드",
        "approvedAmount": 52000000,
        "approvedCount": 1380
      }
    ],
    // 승인 내역 목록 — Spring Page<T> 구조
    "content": [
      {
        "approvalId": "APV20250220001",
        "approvedAt": "2025-02-20T10:23:45",
        "cardCompanyName": "삼성카드",
        "approvalNo": "12345678",
        "amount": 38000,
        "installment": 0,
        "status": "APPROVED",
        "storeId": "STORE-001",
        "storeName": "강남점",
        "maskedCardNo": "123456****7890"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20,
      "sort": { "sorted": true, "orders": [{ "property": "approvedAt", "direction": "DESC" }] },
      "offset": 0,
      "unpaged": false
    },
    "totalElements": 4180,
    "totalPages": 209,
    "numberOfElements": 20,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

---

**API-CARD-001-S · 매장 단위 카드사별 승인 내역 조회**

> 적용 역할: `STORE_MANAGER`

```
GET /api/v1/franchises/{franchiseId}/stores/{storeId}/pos/card/approvals
Authorization: Bearer {JWT}
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|----------|------|------|:----:|------|
| `franchiseId` | Path | String | Y | 프랜차이즈 ID |
| `storeId` | Path | String | Y | 매장 ID |
| `startDate` | Query | String (YYYYMMDD) | Y | 조회 시작일 |
| `endDate` | Query | String (YYYYMMDD) | Y | 조회 종료일 |
| `cardCompanyCodes` | Query | List\<String\> | N | 카드사 코드 목록 |
| `approvalStatus` | Query | Enum | N | `APPROVED` / `CANCELLED` / `ERROR` |
| `approvalNo` | Query | String | N | 승인번호 검색 (부분 일치) |
| `page` | Query | Integer | N | **0-based**, default: `0` |
| `size` | Query | Integer | N | default: `20`, max: `100` |
| `sort` | Query | String | N | default: `approvedAt,desc` |

Response 구조는 API-CARD-001과 동일. `storeIds` 파라미터 없음. `storeId`, `storeName` 고정값으로 응답.

---

## 6. 플랫폼 관리자 전용 API

> 모든 `/platform/` API는 `PLATFORM_ADMIN` 역할만 접근 가능.  
> 다른 역할이 호출 시 **403 Forbidden** 반환.

---

### 6-1. 전체 프랜차이즈 현황 대시보드

#### 기능 개요

| 항목 | 내용 |
|------|------|
| 기능 ID | FUNC-PLAT-001 |
| 기능명 | 전체 프랜차이즈 현황 대시보드 |
| 화면 위치 | 플랫폼 관리 > 대시보드 |
| 접근 역할 | `PLATFORM_ADMIN` 전용 |
| 활용 목적 | 플랫폼 전체 매출 현황, 프랜차이즈별 비교, 이상 징후 모니터링 |
| 페이지네이션 | ✅ 프랜차이즈 목록 Spring Pageable 적용 |

#### 화면 레이아웃

| 구성 요소 | 설명 |
|-----------|------|
| ① 플랫폼 KPI 카드 | 전체 매출 / 전체 객수 / 활성 프랜차이즈 수 / 활성 매장 수 |
| ② 프랜차이즈별 매출 랭킹 | 프랜차이즈별 매출액 바 차트 + 순위 테이블. 페이지네이션 적용 |
| ③ 기간별 플랫폼 트렌드 | 전체 매출 추이 라인 차트 (프랜차이즈 색상 구분 스택) |
| ④ 이상 징후 알림 | 전일 대비 매출 급감(-30% 이상) 매장 자동 감지 및 하이라이트 |

#### API 정의

---

**API-PLAT-001 · 플랫폼 전체 매출 현황 조회**

```
GET /api/v1/platform/dashboard/sales
Authorization: Bearer {JWT}   (role: PLATFORM_ADMIN)
```

**Request Parameters**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|----------|------|------|:----:|------|
| `startDate` | Query | String (YYYYMMDD) | Y | 조회 시작일 |
| `endDate` | Query | String (YYYYMMDD) | Y | 조회 종료일 |
| `page` | Query | Integer | N | 프랜차이즈 목록 페이지. **0-based**, default: `0` |
| `size` | Query | Integer | N | default: `10`, max: `50` |
| `sort` | Query | String | N | default: `totalSales,desc` |

**Response Body**

```jsonc
{
  "success": true,
  "code": "SUCCESS",
  "data": {
    // 플랫폼 전체 KPI (비페이징)
    "platformSummary": {
      "totalSales": 3840000000,
      "totalCustomerCount": 78400,
      "activeFranchiseCount": 12,
      "activeStoreCount": 245
    },
    "trend": [
      {
        "date": "20250220",
        "totalSales": 192000000,
        "franchiseBreakdown": [
          { "franchiseId": "FRAN-001", "franchiseName": "○○약국", "sales": 55000000 }
        ]
      }
    ],
    // 프랜차이즈 목록 — Spring Page<T> 구조
    "content": [
      {
        "franchiseId": "FRAN-001",
        "franchiseName": "○○약국 체인",
        "storeCount": 32,
        "totalSales": 880000000,
        "totalCustomerCount": 18200,
        "avgSpend": 48352,
        "salesRank": 1,
        "salesGrowthRatio": 3.2
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": { "sorted": true, "orders": [{ "property": "totalSales", "direction": "DESC" }] },
      "offset": 0,
      "unpaged": false
    },
    "totalElements": 12,
    "totalPages": 2,
    "numberOfElements": 10,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

---

**API-PLAT-001-D · 특정 프랜차이즈 상세 조회 (플랫폼 관리자)**

```
GET /api/v1/platform/franchises/{franchiseId}/summary
Authorization: Bearer {JWT}   (role: PLATFORM_ADMIN)
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|----------|------|------|:----:|------|
| `franchiseId` | Path | String | Y | 조회할 프랜차이즈 ID |
| `startDate` | Query | String (YYYYMMDD) | Y | 조회 시작일 |
| `endDate` | Query | String (YYYYMMDD) | Y | 조회 종료일 |

Response: 해당 프랜차이즈 매출 요약 + 매장별 세부 현황 (비페이징)

---

### 6-2. 프랜차이즈 관리

#### 기능 개요

| 항목 | 내용 |
|------|------|
| 기능 ID | FUNC-PLAT-002 |
| 기능명 | 프랜차이즈 관리 (프랜차이즈 CRUD) |
| 화면 위치 | 플랫폼 관리 > 프랜차이즈 |
| 접근 역할 | `PLATFORM_ADMIN` 전용 |
| 페이지네이션 | ✅ 목록 조회 Spring Pageable 적용 |

#### API 정의

---

**API-PLAT-002-L · 프랜차이즈 목록 조회**

```
GET /api/v1/platform/franchises
Authorization: Bearer {JWT}   (role: PLATFORM_ADMIN)
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|----------|------|------|:----:|------|
| `status` | Query | Enum | N | `ACTIVE` / `INACTIVE` / `SUSPENDED` (미입력 시 전체) |
| `keyword` | Query | String | N | 프랜차이즈명 검색 (부분 일치) |
| `page` | Query | Integer | N | **0-based**, default: `0` |
| `size` | Query | Integer | N | default: `20`, max: `100` |
| `sort` | Query | String | N | default: `createdAt,desc` |

**Response Body**

```jsonc
{
  "success": true,
  "code": "SUCCESS",
  "data": {
    "content": [
      {
        "franchiseId": "FRAN-001",
        "franchiseName": "○○약국 체인",
        "status": "ACTIVE",
        "storeCount": 32,
        "userCount": 145,
        "contractStartDate": "2024-01-01",
        "contractEndDate": "2026-12-31",
        "createdAt": "2024-01-01T09:00:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20,
      "sort": { "sorted": true, "orders": [{ "property": "createdAt", "direction": "DESC" }] },
      "offset": 0,
      "unpaged": false
    },
    "totalElements": 12,
    "totalPages": 1,
    "numberOfElements": 12,
    "first": true,
    "last": true,
    "empty": false
  }
}
```

---

**API-PLAT-002-C · 프랜차이즈 생성**

```
POST /api/v1/platform/franchises
Authorization: Bearer {JWT}   (role: PLATFORM_ADMIN)
Content-Type: application/json
```

```jsonc
// Request Body
{
  "franchiseName": "△△약국 체인",
  "bizRegNo": "123-45-67890",
  "representativeName": "홍길동",
  "contractStartDate": "2025-03-01",
  "contractEndDate": "2027-02-28",
  "maxStoreCount": 50,
  "enableRegionLayer": true,        // 지역 계층 활성화 여부
  "adminEmail": "admin@franchise.com" // 최초 FRANCHISE_ADMIN 계정 이메일
}
```

Response: 생성된 `franchiseId` 및 전체 필드 반환 (HTTP 201 Created)

---

**API-PLAT-002-U · 프랜차이즈 수정**

```
PATCH /api/v1/platform/franchises/{franchiseId}
Authorization: Bearer {JWT}   (role: PLATFORM_ADMIN)
Content-Type: application/json
```

변경할 필드만 포함하여 전송. `franchiseId`, `bizRegNo`는 수정 불가.

---

**API-PLAT-002-STATUS · 프랜차이즈 상태 변경**

```
PATCH /api/v1/platform/franchises/{franchiseId}/status
Authorization: Bearer {JWT}   (role: PLATFORM_ADMIN)
Content-Type: application/json
```

```jsonc
// Request Body
{
  "status": "SUSPENDED",   // ACTIVE / INACTIVE / SUSPENDED
  "reason": "계약 미갱신"
}
```

> `SUSPENDED` 상태 시 해당 프랜차이즈의 모든 사용자 로그인 차단 및 API 접근 403 처리.

---

### 6-3. 사용자 및 권한 관리

#### 기능 개요

| 항목 | 내용 |
|------|------|
| 기능 ID | FUNC-PLAT-003 |
| 기능명 | 사용자 및 권한 관리 |
| 화면 위치 | 관리 > 사용자 |
| 접근 역할 | `PLATFORM_ADMIN` (전체 조회), `FRANCHISE_ADMIN` (소속 프랜차이즈 내) |
| 페이지네이션 | ✅ Spring Pageable 적용 |

#### API 정의

---

**API-PLAT-003-L · 전체 사용자 목록 조회 (플랫폼 관리자)**

```
GET /api/v1/platform/users
Authorization: Bearer {JWT}   (role: PLATFORM_ADMIN)
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|----------|------|------|:----:|------|
| `franchiseId` | Query | String | N | 특정 프랜차이즈 사용자만 필터 |
| `role` | Query | Enum | N | 역할로 필터 |
| `keyword` | Query | String | N | 이름/이메일 검색 |
| `page` | Query | Integer | N | **0-based**, default: `0` |
| `size` | Query | Integer | N | default: `20`, max: `100` |
| `sort` | Query | String | N | default: `createdAt,desc` |

**Response Body**

```jsonc
{
  "success": true,
  "code": "SUCCESS",
  "data": {
    "content": [
      {
        "userId": "USER-001",
        "name": "홍길동",
        "email": "user@franchise.com",
        "role": "FRANCHISE_ADMIN",
        "franchiseId": "FRAN-001",
        "franchiseName": "○○약국 체인",
        "storeId": null,
        "storeName": null,
        "status": "ACTIVE",
        "lastLoginAt": "2025-02-20T08:30:00",
        "createdAt": "2024-06-01T09:00:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20,
      "sort": { "sorted": true, "orders": [{ "property": "createdAt", "direction": "DESC" }] },
      "offset": 0,
      "unpaged": false
    },
    "totalElements": 145,
    "totalPages": 8,
    "numberOfElements": 20,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

---

**API-PLAT-003-L-F · 프랜차이즈 내 사용자 목록 조회**

> 소속 프랜차이즈 내 사용자만 조회. 서버에서 `franchiseId` 자동 필터링.

```
GET /api/v1/franchises/{franchiseId}/users
Authorization: Bearer {JWT}   (role: FRANCHISE_ADMIN)
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|----------|------|------|:----:|------|
| `franchiseId` | Path | String | Y | 프랜차이즈 ID (JWT와 일치 검증) |
| `role` | Query | Enum | N | 역할 필터 (`PLATFORM_ADMIN` 제외 역할만 노출) |
| `storeId` | Query | String | N | 특정 매장 사용자만 필터 |
| `keyword` | Query | String | N | 이름/이메일 검색 |
| `page` | Query | Integer | N | **0-based**, default: `0` |
| `size` | Query | Integer | N | default: `20`, max: `100` |
| `sort` | Query | String | N | default: `createdAt,desc` |

Response 구조는 API-PLAT-003-L과 동일. `franchiseId` 고정값.

---

**API-PLAT-003-C · 사용자 초대**

```
POST /api/v1/franchises/{franchiseId}/users/invite
Authorization: Bearer {JWT}   (role: PLATFORM_ADMIN or FRANCHISE_ADMIN)
Content-Type: application/json
```

```jsonc
// Request Body
{
  "email": "newuser@franchise.com",
  "name": "김철수",
  "role": "STORE_MANAGER",
  "storeId": "STORE-005",       // STORE_* 역할만 필수
  "regionId": null,             // REGION_MANAGER만 필수
  "permissions": ["EXPORT_DATA"] // 기본 권한 외 추가 권한 (선택)
}
```

> 초대 이메일 발송 후, 사용자가 링크를 통해 비밀번호 설정 완료 시 계정 활성화. (HTTP 201 Created)

---

**API-PLAT-003-ROLE · 사용자 권한 수정**

```
PATCH /api/v1/franchises/{franchiseId}/users/{userId}/role
Authorization: Bearer {JWT}   (role: PLATFORM_ADMIN or FRANCHISE_ADMIN)
Content-Type: application/json
```

```jsonc
// Request Body
{
  "role": "STORE_MANAGER",
  "storeId": "STORE-010",
  "permissions": ["POS_STATS_READ", "SETTLEMENT_READ", "EXPORT_DATA"]
}
```

---

**API-PLAT-003-STATUS · 사용자 상태 변경**

```
PATCH /api/v1/franchises/{franchiseId}/users/{userId}/status
Authorization: Bearer {JWT}   (role: PLATFORM_ADMIN or FRANCHISE_ADMIN)
Content-Type: application/json
```

```jsonc
// Request Body
{
  "status": "INACTIVE",   // ACTIVE / INACTIVE
  "reason": "퇴직"
}
```

---

## 7. API 목록 요약

### 업무 기능 API

| API ID | Method | Endpoint | 접근 역할 | 페이징 |
|--------|:------:|----------|-----------|:------:|
| API-POS-001 | GET | `/api/v1/franchises/{franchiseId}/pos/sales/statistics` | `FRANCHISE_*`, `REGION_MANAGER` | ✅ |
| API-POS-001-S | GET | `/api/v1/franchises/{franchiseId}/stores/{storeId}/pos/sales/statistics` | `STORE_*` | ✅ |
| API-POS-002 | GET | `/api/v1/franchises/{franchiseId}/pos/items/{itemCode}/detail` | 전 역할 | ❌ |
| API-CR-001 | GET | `/api/v1/franchises/{franchiseId}/pos/settlement/payment-method` | `FRANCHISE_*`, `REGION_MANAGER` | ❌ |
| API-CR-001-S | GET | `/api/v1/franchises/{franchiseId}/stores/{storeId}/pos/settlement/payment-method` | `STORE_MANAGER` | ❌ |
| API-CARD-001 | GET | `/api/v1/franchises/{franchiseId}/pos/card/approvals` | `FRANCHISE_*`, `REGION_MANAGER` | ✅ |
| API-CARD-001-S | GET | `/api/v1/franchises/{franchiseId}/stores/{storeId}/pos/card/approvals` | `STORE_MANAGER` | ✅ |

### 플랫폼 관리자 API

| API ID | Method | Endpoint | 설명 | 페이징 |
|--------|:------:|----------|------|:------:|
| API-PLAT-001 | GET | `/api/v1/platform/dashboard/sales` | 플랫폼 전체 매출 현황 | ✅ |
| API-PLAT-001-D | GET | `/api/v1/platform/franchises/{franchiseId}/summary` | 특정 프랜차이즈 상세 | ❌ |
| API-PLAT-002-L | GET | `/api/v1/platform/franchises` | 프랜차이즈 목록 | ✅ |
| API-PLAT-002-C | POST | `/api/v1/platform/franchises` | 프랜차이즈 생성 | — |
| API-PLAT-002-U | PATCH | `/api/v1/platform/franchises/{franchiseId}` | 프랜차이즈 수정 | — |
| API-PLAT-002-STATUS | PATCH | `/api/v1/platform/franchises/{franchiseId}/status` | 상태 변경 | — |
| API-PLAT-003-L | GET | `/api/v1/platform/users` | 전체 사용자 목록 | ✅ |
| API-PLAT-003-L-F | GET | `/api/v1/franchises/{franchiseId}/users` | 프랜차이즈 내 사용자 목록 | ✅ |
| API-PLAT-003-C | POST | `/api/v1/franchises/{franchiseId}/users/invite` | 사용자 초대 | — |
| API-PLAT-003-ROLE | PATCH | `/api/v1/franchises/{franchiseId}/users/{userId}/role` | 권한 수정 | — |
| API-PLAT-003-STATUS | PATCH | `/api/v1/franchises/{franchiseId}/users/{userId}/status` | 사용자 상태 변경 | — |

---

## 8. 공통 사항

### 8-1. 공통 Response 형식

```jsonc
{
  "success": true,
  "code": "SUCCESS",
  "message": "정상 처리되었습니다.",
  "data": { /* API별 상이 */ },
  "timestamp": "2025-02-20T10:23:45.123Z"
}
```

### 8-2. HTTP 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| 200 OK | 정상 처리 |
| 201 Created | 리소스 생성 성공 (POST) |
| 400 Bad Request | 요청 파라미터 오류 (필수값 누락, 형식 오류, size 초과 등) |
| 401 Unauthorized | 인증 실패 (토큰 없음 또는 만료) |
| 403 Forbidden | 권한 없음 (타 프랜차이즈 접근, 역할 미충족, storeId 불일치) |
| 404 Not Found | 리소스 없음 |
| 409 Conflict | 중복 리소스 (이미 존재하는 이메일 등) |
| 500 Internal Server Error | 서버 내부 오류 |

### 8-3. 오류 코드 정의

| 오류 코드 | HTTP | 설명 |
|-----------|------|------|
| `FRANCHISE_NOT_FOUND` | 404 | 존재하지 않는 프랜차이즈 |
| `FRANCHISE_MISMATCH` | 403 | JWT franchiseId와 URL franchiseId 불일치 |
| `STORE_MISMATCH` | 403 | JWT storeId와 URL storeId 불일치 |
| `PERMISSION_DENIED` | 403 | 해당 기능에 대한 권한 없음 |
| `FRANCHISE_SUSPENDED` | 403 | 정지된 프랜차이즈 접근 시도 |
| `TOKEN_EXPIRED` | 401 | JWT 토큰 만료 |
| `INVALID_DATE_RANGE` | 400 | 종료일이 시작일보다 이전 |
| `PAGE_SIZE_EXCEEDED` | 400 | size 최대값 초과 |
| `USER_ALREADY_EXISTS` | 409 | 이미 존재하는 사용자 이메일 |

### 8-4. 보안 및 운영 정책

| 정책 | 설명 |
|------|------|
| 프랜차이즈 격리 | `@TenantFilter` AOP로 모든 쿼리에 `franchise_id` 자동 주입. 코드 레벨 누락 방지 |
| 카드번호 마스킹 | 앞 6자리 + `****` + 끝 4자리. 전체 번호 저장/조회 불가 (PCI-DSS 준수) |
| 개인정보 처리 | 고객 식별 정보 익명화. 매출 분석 목적 한정 사용 |
| 데이터 캐싱 | 조회성 API Redis TTL 5분 캐싱 (집계 데이터). 실시간 데이터 제외 |
| Rate Limiting | 프랜차이즈별 분당 200 요청 / 매장별 분당 60 요청 제한 |
| 토큰 만료 | Access Token 1시간, Refresh Token 7일. Refresh Token Rotation 적용 |
| 감사 로그 | 모든 관리자 작업(생성/수정/삭제/상태변경)은 `audit_log` 테이블에 기록 |

---

## 9. 변경 이력

| 버전 | 일자 | 변경 내용 |
|------|------|-----------|
| v1.0 | 2025-02-20 | 최초 작성 (1차 요구사항 기반: POS실적 / CR정산서 / 카드승인) |
| v2.0 | 2025-02-20 | 멀티 테넌시 URL 구조 전면 개편, RBAC 역할/권한 체계 정의, 플랫폼 관리자 API 신규 추가, Spring Pageable 페이지네이션 규격 통일, 오류 코드 및 보안 정책 보강 |