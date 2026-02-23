import { usePageFilters } from '@/hooks/usePageMeta';

export default function FilterBar() {
  const filtersNode = usePageFilters();
  if (!filtersNode) return null;

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-3 shrink-0">
      {filtersNode}
    </div>
  );
}
