export function formatKRW(value: number): string {
  return value.toLocaleString('ko-KR') + '원';
}

export function formatNumber(value: number): string {
  return value.toLocaleString('ko-KR');
}

export function formatRatio(value: number): string {
  return value.toFixed(1) + '%';
}

export function formatDate(dateStr: string): string {
  if (dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }
  return dateStr;
}

export function formatDateTime(isoStr: string): string {
  return isoStr.replace('T', ' ');
}
