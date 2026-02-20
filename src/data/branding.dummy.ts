/**
 * 플랫폼 브랜딩 설정
 *
 * API 연동 시: GET /api/platform/branding
 * 현재는 더미 데이터로 관리.
 */
export interface BrandingConfig {
  /** 플랫폼/서비스 브랜드명 — 사이드바, 로그인 제목, 브라우저 탭에 사용 */
  serviceName: string;
  /** 로그인 페이지 태그라인 첫 줄 (예: "○○약국 체인을 위한") */
  loginTagline: string;
  /** 푸터에 표시할 버전 */
  version: string;
  /** 푸터에 표시할 연도 */
  year: string;
}

export const BRANDING: BrandingConfig = {
  serviceName: '슈퍼팜',
  loginTagline: '슈퍼팜을 위한',
  version: 'v2.0',
  year: '2025',
};
