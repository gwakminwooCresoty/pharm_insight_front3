import { useState, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import StoreMap from '@/components/map/StoreMap';
import { DUMMY_STORES } from '@/data/platform.dummy';
import { useSetPageMeta, useSetPageFilters } from '@/hooks/usePageMeta';

// StoreMap의 FRANCHISE_COLORS와 동일한 순서의 hex 색상
const FRANCHISE_FILLS = ['#2563eb', '#4f46e5', '#059669', '#d97706', '#e11d48'];
const getColorIndex = (id: string) =>
    parseInt(id.replace(/\D/g, '') || '0', 10) % FRANCHISE_FILLS.length;

export default function PlatformInsightMapPage() {
    useSetPageMeta('가맹점 인사이트 맵', '전국 프랜차이즈 매장 분포 및 활성 상태 현황');

    const availableFranchises = useMemo(() => {
        const map = new globalThis.Map<string, string>();
        DUMMY_STORES.forEach(s => {
            if (!map.has(s.franchiseId)) map.set(s.franchiseId, s.franchiseName);
        });
        return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
    }, []);

    const [selectedFranchiseIds, setSelectedFranchiseIds] = useState<Set<string>>(
        new Set(availableFranchises.map(f => f.id))
    );

    const toggleFranchise = (id: string) => {
        setSelectedFranchiseIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const selectAll = () => setSelectedFranchiseIds(new Set(availableFranchises.map(f => f.id)));
    const clearAll = () => setSelectedFranchiseIds(new Set());

    const filteredStores = useMemo(
        () => DUMMY_STORES.filter(store => selectedFranchiseIds.has(store.franchiseId)),
        [selectedFranchiseIds],
    );

    const allSelected = selectedFranchiseIds.size === availableFranchises.length;
    const noneSelected = selectedFranchiseIds.size === 0;

    useSetPageFilters(
        <div className="flex items-center gap-2">
            {/* 표시 매장 수 */}
            <div className="flex items-center gap-1 text-xs text-gray-500 pr-3 border-r border-gray-200">
                <MapPin size={12} className="text-gray-400" />
                <span className="font-semibold text-gray-700">{filteredStores.length}</span>
                <span>개 표시 중</span>
            </div>

            {/* 전체 / 해제 */}
            <button
                type="button"
                onClick={selectAll}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                    allSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
            >
                전체
            </button>
            <button
                type="button"
                onClick={clearAll}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                    noneSelected
                        ? 'bg-gray-200 text-gray-500 border-gray-200'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
            >
                해제
            </button>

            <div className="w-px h-5 bg-gray-200 mx-0.5" />

            {/* 프랜차이즈 필터 칩 */}
            {availableFranchises.map(f => {
                const isSelected = selectedFranchiseIds.has(f.id);
                const fill = FRANCHISE_FILLS[getColorIndex(f.id)];
                return (
                    <button
                        key={f.id}
                        type="button"
                        onClick={() => toggleFranchise(f.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            isSelected
                                ? 'bg-white border-gray-300 text-gray-800 shadow-sm'
                                : 'bg-white border-gray-100 text-gray-400'
                        }`}
                    >
                        <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: fill, opacity: isSelected ? 1 : 0.25 }}
                        />
                        {f.name}
                    </button>
                );
            })}
        </div>,
    );

    return (
        <PageContainer>
            <div className="h-[calc(100vh-190px)] min-h-[500px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 relative">
                <StoreMap stores={filteredStores} showLegend={true} />
                {filteredStores.length === 0 && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                        <MapPin size={36} className="text-gray-300 mb-3" />
                        <p className="font-semibold text-gray-700">선택된 브랜드 매장이 없습니다.</p>
                        <p className="text-sm text-gray-400 mt-1">상단 필터에서 브랜드를 선택하세요.</p>
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
