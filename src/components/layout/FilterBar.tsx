import { usePageFilters } from '@/hooks/usePageMeta';

export default function FilterBar() {
  const filtersNode = usePageFilters();
  if (!filtersNode) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 px-6 py-3 shrink-0 min-h-[52px]">
      {filtersNode}
    </div>
  );
}
