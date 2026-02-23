/**
 * 차트 공통 툴팁 스타일
 * recharts <Tooltip /> 컴포넌트에 스프레드하여 사용.
 *
 * 사용 예:
 *   <Tooltip {...TOOLTIP_PROPS} formatter={(value) => [...]} />
 */
export const TOOLTIP_PROPS = {
  contentStyle: {
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    boxShadow:
      '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
    padding: '10px 14px',
    fontSize: '12px',
    lineHeight: '1.6',
  },
  labelStyle: {
    fontWeight: 600,
    color: '#334155',
    marginBottom: '3px',
    fontSize: '11px',
  },
  itemStyle: {
    color: '#475569',
    fontSize: '12px',
    padding: '1px 0',
  },
  cursor: { fill: 'rgba(99, 102, 241, 0.04)' },
} as const;
