import { usePageFooter } from '@/hooks/usePageMeta';

export default function FooterBar() {
  const footerNode = usePageFooter();
  if (!footerNode) return null;

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-3 shrink-0 shadow-[0_-1px_4px_rgba(0,0,0,0.06)]">
      {footerNode}
    </div>
  );
}
