/**
 * 차트 공통 색상 상수
 * 결제수단 색상은 PaymentDonutChart / PaymentStackBarChart 모두 이 파일을 참조.
 */

/** 결제수단별 색상 — 순서: 카드/현금/포인트/기타 */
export const PAYMENT_COLOR_LIST = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'] as const;

/** 결제수단명 → 색상 매핑 */
export const PAYMENT_COLORS: Record<string, string> = {
  카드: '#3b82f6',
  현금: '#10b981',
  포인트: '#f59e0b',
  기타: '#8b5cf6',
};

/** 매핑에 없는 결제수단 fallback 색상 */
export const PAYMENT_COLOR_FALLBACK = '#94a3b8';

/** 프랜차이즈 랭킹 차트 — 파랑→보라 그라데이션 팔레트 */
export const FRANCHISE_RANK_COLORS = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a78bfa',
  '#c4b5fd',
  '#ddd6fe',
  '#e0e7ff',
  '#c7d2fe',
] as const;
