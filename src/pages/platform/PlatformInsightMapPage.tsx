import { useState, useMemo } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Check } from 'lucide-react';
import StoreMap from '@/components/map/StoreMap';
import { DUMMY_STORES } from '@/data/platform.dummy';

export default function PlatformInsightMapPage() {
    // 고유 ফ্র랜차이즈 식별용 리스트 추출
    const availableFranchises = useMemo(() => {
        const map = new globalThis.Map<string, string>();
        DUMMY_STORES.forEach(s => {
            if (!map.has(s.franchiseId)) {
                map.set(s.franchiseId, s.franchiseName);
            }
        });
        return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
    }, []);

    // 선택된 프랜차이즈 ID 목록 관리 (초기엔 모두 선택됨)
    const [selectedFranchiseIds, setSelectedFranchiseIds] = useState<Set<string>>(
        new Set(availableFranchises.map(f => f.id))
    );

    const toggleFranchise = (id: string) => {
        setSelectedFranchiseIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const selectAll = () => {
        setSelectedFranchiseIds(new Set(availableFranchises.map(f => f.id)));
    };

    const clearAll = () => {
        setSelectedFranchiseIds(new Set());
    };

    // 필터링된 스토어 목록
    const filteredStores = useMemo(() => {
        return DUMMY_STORES.filter(store => selectedFranchiseIds.has(store.franchiseId));
    }, [selectedFranchiseIds]);

    return (
        <PageContainer>
            <div className="flex flex-col gap-4 h-[calc(100vh-120px)] min-h-[600px]">
                {/* 상단 컨트롤 패널 */}
                <div className="flex-none p-4 shadow-sm border border-gray-200 bg-white rounded-xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">가맹점 인사이트 맵</h1>
                            <p className="text-sm text-gray-500 mt-1">전국의 프랜차이즈별 매장 분포와 활성 상태를 한눈에 파악합니다.</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-gray-600 mr-1">브랜드 필터:</span>
                            <button
                                onClick={selectAll}
                                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                                title="전체 선택"
                            >
                                전체
                            </button>
                            <button
                                onClick={clearAll}
                                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                                title="선택 해제"
                            >
                                해제
                            </button>
                            <div className="w-px h-4 bg-gray-300 mx-1 border-hidden" />
                            {availableFranchises.map(f => {
                                const isSelected = selectedFranchiseIds.has(f.id);
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => toggleFranchise(f.id)}
                                        title={f.name}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                            : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 opacity-60'
                                            }`}
                                    >
                                        <div className={`flex items-center justify-center w-4 h-4 rounded-sm border ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                                            {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                                        </div>
                                        <span>{f.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 지도 영역 (전체 화면 반응형) */}
                <div className="flex-1 w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
                    <StoreMap
                        stores={filteredStores}
                        showLegend={true}
                    />
                    {filteredStores.length === 0 && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm text-gray-500">
                            <span className="text-5xl mb-3 opacity-50">🧭</span>
                            <p className="font-medium text-lg">선택된 브랜드 매장이 없습니다.</p>
                            <p className="text-sm mt-1">상단의 필터를 해제하여 매장 분포를 확인하세요.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
