# PharmInsight POS 기능정의서

> **버전** v1.0 · **작성일** 2025-02-20 · **상태** 1차 요구사항 기반  
> **대상 기능** POS 실적 통합 조회 / 일일결산 CR정산서 / 카드승인 조회

---

## 목차

1. [문서 개요](#1-문서-개요)
2. [기능 목록](#2-기능-목록)
3. [기능별 상세 정의](#3-기능별-상세-정의)
   - 3-1. [POS 실적 통합 조회](#3-1-pos-실적-통합-조회-위치실적)
   - 3-2. [CR정산서 (결제수단별 실적)](#3-2-일일결산-cr정산서-결제수단별-실적)
   - 3-3. [카드승인 조회](#3-3-카드승인-조회-카드사별-승인-내역)
4. [API 목록 요약](#4-api-목록-요약)
5. [공통 사항](#5-공통-사항)
6. [변경 이력](#6-변경-이력)

---

## 1. 문서 개요

| 항목 | 내용 |
|------|------|
| 문서명 | PharmInsight POS 기능정의서 (API + 화면 설계) |
| 버전 | v1.0 |
| 작성일 | 2025-02-20 |
| 대상 시스템 | PharmInsight — 약국 체인 매장 POS 분석 플랫폼 (캣포스 연동) |
| 작성 근거 | 1차 요구사항 (POS 실적, 일일결산 CR정산서, 카드승인 조회) |
| 기술 스택 | Java 21, Spring Boot 3.x, PostgreSQL, React 19, REST API |

---

## 2. 기능 목록

| No | 구분 | 기능명 | 화면 위치 (캣포스) | 주요 지표 |
|----|------|--------|-------------------|-----------|
| 1 | 위치실적 | POS 실적 통합 조회 | 주제통계 > 상품별통계 / 기간통계 > 일자별통계 | 매출액, 객수, 객단가, 단품 매출 |
| 2 | 일일결산 | CR정산서 (결제수단별) | HOME > 주제통계 > 결제수단별 | 결제수단별 매출액, 건수, 구성비 |
| 3 | 카드승인 | 카드사별 승인 내역 조회 | 승인내역 | 전체/카드사별 승인 내역 |

---

## 3. 기능별 상세 정의

---

### 3-1. POS 실적 통합 조회 (위치실적)

#### 기능 개요

| 항목 | 내용 |
|------|------|
| 기능 ID | FUNC-POS-001 |
| 기능명 | POS 실적 통합 조회 (OTC 포함) |
| 화면 위치 | 주제통계 > 상품별통계 / 기간통계 > 일자별통계 |
| 캣포스 연동 | 캣포스 POS 매출 데이터 API 연동 (OTC 外 포함) |
| 활용 목적 | 단품 기준 판매량/매출 관리, 일마감 실적 관리, 단품별 고객 선호도 분석, 기간 비교 실적 분석 |

#### 조회 조건 (검색 필터)

| No | 필터명 | 입력 유형 | 설명 |
|----|--------|-----------|------|
| 1 | 조회 기간 | DateRangePicker | 시작일 ~ 종료일 선택 (데일리/기간 구분) |
| 2 | 조회 축 | Radio Button | 시간대별 / 일자별 / 요일별 / 기간별 (단일 선택) |
| 3 | 매장 선택 | MultiSelect Dropdown | 전체 또는 특정 매장 선택 (멀티 프랜차이즈) |
| 4 | 상품 분류 | Dropdown | 전체 / 일반의약품(OTC) / 처방의약품 / 기타 |
| 5 | 비교 기간 | DateRangePicker | 기간 비교 분석 시 사용 (선택 옵션) |

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
| ① 상단 필터 영역 | 조회기간, 조회축(시간대/일자/요일/기간), 매장선택, 상품분류 필터 배치. [조회] 버튼으로 실행 |
| ② KPI 요약 카드 | 매출액 / 객수 / 객단가를 카드 형태로 상단 배치. 전기 대비 증감 배지 표시 |
| ③ 트렌드 차트 | 선택한 조회축 기준 매출액 추이 라인/바 차트 (기간비교 시 2개 시계열 표시) |
| ④ 단품 순위 테이블 | 단품명 / 판매수량 / 매출액 / 구성비 컬럼. 판매수량 기준 정렬. 엑셀 다운로드 제공 |
| ⑤ 탭 구조 | [상품별통계 탭] / [일자별통계 탭] 전환 구조 |

#### API 정의

**API-POS-001 · POS 실적 통합 조회**

```
GET /api/v1/pos/sales/statistics
Authorization: Bearer {JWT}
```

**Request Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| startDate | String (YYYYMMDD) | Y | 조회 시작일 |
| endDate | String (YYYYMMDD) | Y | 조회 종료일 |
| axisType | Enum | Y | `HOUR` / `DATE` / `WEEKDAY` / `PERIOD` |
| storeIds | List\<String\> | N | 매장 ID 목록 (미입력 시 전체) |
| categoryCode | String | N | `ALL` / `OTC` / `RX` / `ETC` |
| compareStartDate | String (YYYYMMDD) | N | 비교 기간 시작일 |
| compareEndDate | String (YYYYMMDD) | N | 비교 기간 종료일 |
| page | Integer | N | 페이지 번호 (default: 1) |
| size | Integer | N | 페이지 크기 (default: 20, max: 100) |

**Response Body**

```jsonc
{
  "success": true,
  "code": "SUCCESS",
  "data": {
    "summary": {
      "totalSales": 15200000,       // 총 매출액 (원)
      "customerCount": 312,         // 총 객수
      "avgSpend": 48717             // 객단가 (원)
    },
    "trend": [
      {
        "axis": "09",               // 조회축 레이블 (시간대/일자/요일)
        "sales": 1200000,
        "customers": 24
      }
    ],
    "itemRanking": [
      {
        "itemCode": "ITEM001",
        "itemName": "타이레놀 500mg",
        "qty": 152,                 // 판매 수량
        "sales": 760000,            // 매출액
        "ratio": 5.0                // 구성비 (%)
      }
    ],
    "pagination": {
      "totalElements": 320,
      "totalPages": 16
    }
  }
}
```

---

**API-POS-002 · 단품 실적 상세 조회**

```
GET /api/v1/pos/items/{itemCode}/detail
Authorization: Bearer {JWT}
```

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| itemCode | String (Path) | Y | 단품 코드 |
| startDate | String (YYYYMMDD) | Y | 조회 시작일 |
| endDate | String (YYYYMMDD) | Y | 조회 종료일 |
| storeIds | List\<String\> | N | 매장 ID 목록 |

Response 주요 필드: `itemCode`, `itemName`, `category`, `totalQty`, `totalSales`, `avgPrice`, `storeBreakdown[]`

---

### 3-2. 일일결산 CR정산서 (결제수단별 실적)

#### 기능 개요

| 항목 | 내용 |
|------|------|
| 기능 ID | FUNC-CR-001 |
| 기능명 | CR정산서 — 결제수단별 실적 조회 |
| 화면 위치 | HOME > 주제통계 > 결제수단별 |
| 조회 주기 | 데일리 / 기간별 (선택) |
| 활용 목적 | 결제수단별 매출 구조 분석 (현금/카드/포인트 등 비중 파악) |

#### 조회 조건 (검색 필터)

| No | 필터명 | 입력 유형 | 설명 |
|----|--------|-----------|------|
| 1 | 조회 기간 | DateRangePicker | 데일리(단일일) 또는 기간 선택 |
| 2 | 매장 선택 | MultiSelect Dropdown | 전체 또는 특정 매장 선택 |
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
| ① 상단 필터 영역 | 조회기간(데일리/기간 토글), 매장선택, 결제수단 필터 배치 |
| ② 결제수단 파이차트 | 결제수단별 구성비 도넛 차트. 범례에 금액/건수 표시 |
| ③ 정산서 테이블 | 결제수단 / 매출액 / 건수 / 구성비 / 건당평균 컬럼. 합계 행 하단 고정 |
| ④ 기간별 추이 차트 | 기간 조회 시 활성화. 결제수단별 스택 바 차트로 일별 추이 표시 |
| ⑤ 다운로드 | CR 정산서 양식 엑셀/PDF 다운로드 버튼 제공 |

#### API 정의

**API-CR-001 · 결제수단별 정산 조회**

```
GET /api/v1/pos/settlement/payment-method
Authorization: Bearer {JWT}
```

**Request Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| startDate | String (YYYYMMDD) | Y | 조회 시작일 |
| endDate | String (YYYYMMDD) | Y | 조회 종료일 |
| storeIds | List\<String\> | N | 매장 ID 목록 (미입력 시 전체) |
| paymentTypes | List\<Enum\> | N | `CARD` / `CASH` / `POINT` / `ETC` (미입력 시 전체) |

**Response Body**

```jsonc
{
  "success": true,
  "code": "SUCCESS",
  "data": {
    "totalSales": 15200000,
    "totalCount": 418,
    "breakdown": [
      {
        "paymentType": "CARD",
        "paymentName": "카드",
        "sales": 11400000,
        "count": 302,
        "ratio": 75.0,              // 구성비 (%)
        "avgAmount": 37748          // 건당 평균 금액
      }
    ],
    "dailyTrend": [                 // 기간 조회 시에만 반환
      {
        "date": "20250220",
        "breakdown": [ /* 동일 구조 */ ]
      }
    ]
  }
}
```

---

### 3-3. 카드승인 조회 (카드사별 승인 내역)

#### 기능 개요

| 항목 | 내용 |
|------|------|
| 기능 ID | FUNC-CARD-001 |
| 기능명 | 카드사별 승인 내역 조회 |
| 화면 위치 | 승인내역 |
| 조회 주기 | 데일리 / 기간별 (선택) |
| 활용 목적 | 카드사별 매출·승인 관리 (취소/오류 건 포함 추적) |

#### 조회 조건 (검색 필터)

| No | 필터명 | 입력 유형 | 설명 |
|----|--------|-----------|------|
| 1 | 조회 기간 | DateRangePicker | 데일리(단일일) 또는 기간 선택 |
| 2 | 카드사 선택 | MultiSelect Dropdown | 전체 / 개별 카드사 (BC, 삼성, 현대, 신한, KB, 롯데 등) |
| 3 | 매장 선택 | MultiSelect Dropdown | 전체 또는 특정 매장 선택 |
| 4 | 승인 상태 | Radio Button | 전체 / 정상 / 취소 / 오류 |
| 5 | 승인번호 | Text Input | 승인번호 직접 검색 (부분 일치, 선택) |

#### 승인 내역 컬럼

| No | 컬럼명 | 타입 | 설명 |
|----|--------|------|------|
| 1 | 거래일시 | DateTime | 카드 승인 일시 (`YYYY-MM-DD HH:mm:ss`) |
| 2 | 카드사명 | String | 승인 카드사 (삼성카드, BC카드 등) |
| 3 | 승인번호 | String | VAN사 발급 승인번호 |
| 4 | 승인금액 | Long | 거래 승인 금액 (원) |
| 5 | 할부개월 | Integer | 일시불: 0, 할부: 개월 수 |
| 6 | 상태 | Enum | `APPROVED` / `CANCELLED` / `ERROR` |
| 7 | 매장명 | String | 승인 발생 매장명 |
| 8 | 카드번호 (마스킹) | String | 앞 6자리 + `****` + 끝 4자리 |

#### 화면 레이아웃 설계

| 구성 요소 | 설명 |
|-----------|------|
| ① 상단 필터 영역 | 기간, 카드사, 매장, 승인상태, 승인번호 검색 필터 배치 |
| ② 카드사별 요약 카드 | 카드사별 승인금액 합계/건수 카드 컴포넌트. 클릭 시 해당 카드사 필터 자동 적용 |
| ③ 승인 내역 그리드 | 거래일시/카드사/승인번호/금액/할부/상태/매장 컬럼. 20건/페이지 페이징. 상태별 색상 구분 |
| ④ 집계 요약 영역 | 하단 고정: 총 건수 / 총 승인금액 / 총 취소금액 표시 |
| ⑤ 다운로드 | 엑셀 다운로드 (전체 결과 또는 현재 페이지 선택) |

#### API 정의

**API-CARD-001 · 카드사별 승인 내역 조회**

```
GET /api/v1/pos/card/approvals
Authorization: Bearer {JWT}
```

**Request Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| startDate | String (YYYYMMDD) | Y | 조회 시작일 |
| endDate | String (YYYYMMDD) | Y | 조회 종료일 |
| cardCompanyCodes | List\<String\> | N | 카드사 코드 목록 (미입력 시 전체) |
| storeIds | List\<String\> | N | 매장 ID 목록 (미입력 시 전체) |
| approvalStatus | Enum | N | `APPROVED` / `CANCELLED` / `ERROR` (미입력 시 전체) |
| approvalNo | String | N | 승인번호 검색 (부분 일치) |
| page | Integer | N | 페이지 번호 (default: 1) |
| size | Integer | N | 페이지 크기 (default: 20, max: 100) |
| sortBy | String | N | `approvedAt` / `amount` (default: `approvedAt`) |
| sortOrder | Enum | N | `ASC` / `DESC` (default: `DESC`) |

**Response Body**

```jsonc
{
  "success": true,
  "code": "SUCCESS",
  "data": {
    "summary": {
      "totalApprovedAmount": 14800000,  // 총 승인금액
      "totalCancelledAmount": 400000,   // 총 취소금액
      "totalCount": 418
    },
    "cardSummary": [
      {
        "cardCompanyCode": "SAMSUNG",
        "cardCompanyName": "삼성카드",
        "approvedAmount": 5200000,
        "approvedCount": 138
      }
    ],
    "approvals": [
      {
        "approvalId": "APV20250220001",
        "approvedAt": "2025-02-20T10:23:45",
        "cardCompanyName": "삼성카드",
        "approvalNo": "12345678",
        "amount": 38000,
        "installment": 0,               // 0 = 일시불
        "status": "APPROVED",
        "storeName": "강남점",
        "maskedCardNo": "123456****7890"
      }
    ],
    "pagination": {
      "totalElements": 418,
      "totalPages": 21
    }
  }
}
```

---

## 4. API 목록 요약

| API ID | 기능 구분 | Method | Endpoint | 설명 |
|--------|-----------|:------:|----------|------|
| API-POS-001 | 위치실적 | GET | `/api/v1/pos/sales/statistics` | POS 실적 통합 조회 |
| API-POS-002 | 위치실적 | GET | `/api/v1/pos/items/{itemCode}/detail` | 단품 실적 상세 조회 |
| API-CR-001 | 일일결산 | GET | `/api/v1/pos/settlement/payment-method` | 결제수단별 정산 조회 |
| API-CARD-001 | 카드승인 | GET | `/api/v1/pos/card/approvals` | 카드사별 승인 내역 조회 |

---

## 5. 공통 사항

### 5-1. 공통 Response 형식

| 필드 | 타입 | 설명 |
|------|------|------|
| success | Boolean | API 처리 성공 여부 |
| code | String | 결과 코드 (`SUCCESS` / 오류 코드) |
| message | String | 결과 메시지 |
| data | Object | 실제 응답 데이터 (API별 상이) |
| timestamp | DateTime | 서버 응답 시각 (ISO 8601) |

### 5-2. HTTP 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| 200 OK | 정상 처리 |
| 400 Bad Request | 요청 파라미터 오류 (필수값 누락, 형식 오류 등) |
| 401 Unauthorized | 인증 실패 (토큰 없음 또는 만료) |
| 403 Forbidden | 권한 없음 (타 프랜차이즈 데이터 접근 시도 등) |
| 404 Not Found | 리소스 없음 |
| 500 Internal Server Error | 서버 내부 오류 |

### 5-3. 보안 및 멀티 프랜차이즈 정책

| 정책 | 설명 |
|------|------|
| 프랜차이즈 격리 | JWT 토큰 내 `franchiseId` 기반으로 데이터 자동 필터링. 타 프랜차이즈 데이터 접근 불가 |
| 카드번호 마스킹 | 앞 6자리 + `****` + 끝 4자리 형태로만 제공. 전체 번호 저장/조회 불가 |
| 개인정보 처리 | 고객 식별 정보 익명화 처리. 매출 분석 목적으로만 사용 |
| 데이터 캐싱 | 조회성 API Redis TTL 5분 캐싱 적용 (실시간 데이터 제외) |
| Rate Limiting | 프랜차이즈별 분당 100 요청 제한 |

---

## 6. 변경 이력

| 버전 | 일자 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v1.0 | 2025-02-20 | PharmInsight 개발팀 | 최초 작성 (1차 요구사항 기반: POS실적 / CR정산서 / 카드승인) |
