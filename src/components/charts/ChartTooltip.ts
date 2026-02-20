/**
 * 차트 공통 툴팁 스타일
 * recharts <Tooltip /> 컴포넌트에 스프레드하여 사용.
 *
 * 사용 예:
 *   <Tooltip {...TOOLTIP_PROPS} formatter={(value) => [...]} />
 */
export const TOOLTIP_PROPS = {
  contentStyle: {
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow:
      '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
    padding: '8px 12px',
    fontSize: '12px',
    lineHeight: '1.6',
  },
  labelStyle: {
    fontWeight: 600,
    color: '#374151',
    marginBottom: '2px',
    fontSize: '11px',
  },
  itemStyle: {
    color: '#4b5563',
    fontSize: '12px',
    padding: '1px 0',
  },
  cursor: { fill: 'rgba(0, 0, 0, 0.04)' },
} as const;
