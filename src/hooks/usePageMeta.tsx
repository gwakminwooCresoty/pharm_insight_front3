import { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface PageMeta {
  title: string;
  subtitle?: string;
}

// ── Setters context: useState 세터는 React가 안정성을 보장하므로 절대 변경되지 않는다.
//    페이지는 이 컨텍스트만 구독하므로, meta/filters 업데이트 시 페이지가 재렌더되지 않는다.
interface PageMetaSettersContextValue {
  setMeta: React.Dispatch<React.SetStateAction<PageMeta>>;
  setFilters: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}

// ── Values context: meta와 filtersNode가 변경될 때마다 업데이트된다.
//    TopHeader와 FilterBar만 이 컨텍스트를 구독한다.
interface PageMetaValuesContextValue {
  meta: PageMeta;
  filtersNode: React.ReactNode;
}

const PageMetaSettersContext = createContext<PageMetaSettersContextValue | null>(null);
const PageMetaValuesContext = createContext<PageMetaValuesContextValue | null>(null);

export function PageMetaProvider({ children }: { children: React.ReactNode }) {
  const [meta, setMeta] = useState<PageMeta>({ title: '' });
  const [filtersNode, setFilters] = useState<React.ReactNode>(null);

  // useState 세터는 참조가 안정적이므로 deps를 [setMeta, setFilters]로 지정해도 절대 재생성되지 않는다.
  const setters = useMemo(() => ({ setMeta, setFilters }), [setMeta, setFilters]);
  const values = useMemo(() => ({ meta, filtersNode }), [meta, filtersNode]);

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
 * Setters context만 구독하므로 filters 업데이트 시 페이지가 재렌더되지 않는다 → 무한 루프 방지.
 */
export function useSetPageFilters(node: React.ReactNode) {
  const setFilters = useContext(PageMetaSettersContext)?.setFilters;

  // 매 렌더 후 필터 노드를 동기화 (deps 없음 = 매 렌더 실행)
  // 페이지가 PageMetaValuesContext를 구독하지 않으므로 context 업데이트로 재렌더되지 않아 안전하다.
  useEffect(() => {
    setFilters?.(node);
  });

  // 페이지 언마운트 시에만 필터를 제거한다
  useEffect(() => {
    return () => setFilters?.(null);
  }, [setFilters]);
}

/** TopHeader에서 title/subtitle을 읽는다. */
export function usePageMeta(): PageMeta {
  return useContext(PageMetaValuesContext)?.meta ?? { title: '' };
}

/** FilterBar에서 filtersNode를 읽는다. */
export function usePageFilters(): React.ReactNode {
  return useContext(PageMetaValuesContext)?.filtersNode;
}
