interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export default function Table<T>({
  columns,
  data,
  rowKey,
  rowClassName,
  onRowClick,
  emptyMessage = '데이터가 없습니다.',
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-slate-200 bg-slate-50/80">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors duration-[var(--transition-fast)] hover:bg-primary-50/40 ${idx % 2 === 1 ? 'bg-slate-50/40' : ''} ${onRowClick ? 'cursor-pointer' : ''} ${rowClassName?.(row) ?? ''}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 ${col.className ?? ''}`}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
