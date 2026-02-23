import { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface PageMeta {
  title: string;
  subtitle?: string;
}

// ── Setters context: useState 세터는 React가 안정성을 보장하므로 절대 변경되지 않는다.
//    페이지는 이 컨텍스트만 구독하므로, meta/filters/footer 업데이트 시 페이지가 재렌더되지 않는다.
interface PageMetaSettersContextValue {
  setMeta: React.Dispatch<React.SetStateAction<PageMeta>>;
  setFilters: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setFooter: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}

// ── Values context: 각 슬롯 값이 변경될 때 업데이트된다.
//    TopHeader, FilterBar, FooterBar만 이 컨텍스트를 구독한다.
interface PageMetaValuesContextValue {
  meta: PageMeta;
  filtersNode: React.ReactNode;
  footerNode: React.ReactNode;
}

const PageMetaSettersContext = createContext<PageMetaSettersContextValue | null>(null);
const PageMetaValuesContext = createContext<PageMetaValuesContextValue | null>(null);

export function PageMetaProvider({ children }: { children: React.ReactNode }) {
  const [meta, setMeta] = useState<PageMeta>({ title: '' });
  const [filtersNode, setFilters] = useState<React.ReactNode>(null);
  const [footerNode, setFooter] = useState<React.ReactNode>(null);

  const setters = useMemo(() => ({ setMeta, setFilters, setFooter }), [setMeta, setFilters, setFooter]);
  const values = useMemo(() => ({ meta, filtersNode, footerNode }), [meta, filtersNode, footerNode]);

  return (
    <PageMetaSettersContext.Provider value={setters}>
      <PageMetaValuesContext.Provider value={values}>
        {children}
      </PageMetaValuesContext.Provider>
    </PageMetaSettersContext.Provider>
  );
}

/** 페이지 컴포넌트 최상단에서 호출 — TopHeader에 title/subtitle을 전달한다. */
export function useSetPageMeta(title: string, subtitle?: string) {
  const setMeta = useContext(PageMetaSettersContext)?.setMeta;
  useEffect(() => {
    setMeta?.({ title, subtitle });
  }, [setMeta, title, subtitle]);
}

/**
 * 페이지의 필터 JSX를 헤더 아래 FilterBar에 렌더링한다.
 * Setters context만 구독하므로 context 업데이트로 인한 무한 루프가 발생하지 않는다.
 */
export function useSetPageFilters(node: React.ReactNode) {
  const setFilters = useContext(PageMetaSettersContext)?.setFilters;
  useEffect(() => {
    setFilters?.(node);
  });
  useEffect(() => {
    return () => setFilters?.(null);
  }, [setFilters]);
}

/**
 * 페이지의 집계/요약 JSX를 스크롤 영역 밖 하단 FooterBar에 고정 렌더링한다.
 * Setters context만 구독하므로 context 업데이트로 인한 무한 루프가 발생하지 않는다.
 */
export function useSetPageFooter(node: React.ReactNode) {
  const setFooter = useContext(PageMetaSettersContext)?.setFooter;
  useEffect(() => {
    setFooter?.(node);
  });
  useEffect(() => {
    return () => setFooter?.(null);
  }, [setFooter]);
}

/** TopHeader에서 title/subtitle을 읽는다. */
export function usePageMeta(): PageMeta {
  return useContext(PageMetaValuesContext)?.meta ?? { title: '' };
}

/** FilterBar에서 filtersNode를 읽는다. */
export function usePageFilters(): React.ReactNode {
  return useContext(PageMetaValuesContext)?.filtersNode;
}

/** FooterBar에서 footerNode를 읽는다. */
export function usePageFooter(): React.ReactNode {
  return useContext(PageMetaValuesContext)?.footerNode;
}
