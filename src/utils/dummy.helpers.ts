export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  pageNumber: number;
  pageSize: number;
}

export function paginateArray<T>(
  items: T[],
  page: number,
  size: number
): PageResult<T> {
  const totalElements = items.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const safePage = Math.min(page, totalPages - 1);
  const content = items.slice(safePage * size, (safePage + 1) * size);
  return {
    content,
    totalElements,
    totalPages,
    numberOfElements: content.length,
    first: safePage === 0,
    last: safePage >= totalPages - 1,
    pageNumber: safePage,
    pageSize: size,
  };
}
