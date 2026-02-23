import { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import StoreMap from '@/components/map/StoreMap';
import { useSetPageMeta } from '@/hooks/usePageMeta';
import { DUMMY_STORES, type Store } from '@/data/platform.dummy';

export default function StoreManagePage() {
    useSetPageMeta('프랜차이즈 매장 관리', '가맹점 리스트 조회 및 지도 뷰');
    const [stores] = useState<Store[]>(DUMMY_STORES);
    const [keyword, setKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);

    const filteredStores = stores.filter((s) => {
        if (keyword && !s.storeName.includes(keyword) && !s.address.includes(keyword)) return false;
        if (statusFilter && s.status !== statusFilter) return false;
        return true;
    });

    return (
        <PageContainer>
            <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)] min-h-[600px]">

                {/* 좌측 리스트 뷰 */}
                <div className="flex flex-col gap-3 w-full lg:w-1/3 bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder="매장명 또는 주소 검색"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">전체 상태</option>
                                <option value="ACTIVE">운영중</option>
                                <option value="CLOSED">폐점</option>
                            </select>
                            <Button onClick={() => setKeyword('')} variant="secondary">초기화</Button>
                        </div>
                    </div>

                    <div className="text-sm font-medium text-gray-700 mt-2">
                        검색 결과 {filteredStores.length}건
                    </div>

                    {/* 목록 표시 */}
                    <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                        {filteredStores.map((store) => (
                            <div
                                key={store.storeId}
                                onClick={() => setSelectedStore(store)}
                                className={`p-3 rounded border cursor-pointer transition-colors ${selectedStore?.storeId === store.storeId
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-semibold text-gray-900">{store.storeName}</h3>
                                    {store.status === 'ACTIVE' ? (
                                        <Badge color="green">운영중</Badge>
                                    ) : (
                                        <Badge color="red">폐점</Badge>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 truncate" title={store.address}>
                                    {store.address}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{store.contact}</p>
                            </div>
                        ))}
                        {filteredStores.length === 0 && (
                            <div className="text-center text-gray-500 text-sm py-10">
                                검색된 매장이 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                {/* 우측 지도 뷰 */}
                <div className="w-full lg:w-2/3 h-[400px] lg:h-full bg-slate-50 rounded-lg overflow-hidden border border-gray-100 shadow-sm relative">
                    {filteredStores.length > 0 ? (
                        <StoreMap
                            stores={filteredStores}
                            selectedStoreId={selectedStore?.storeId}
                            onStoreClick={(s) => setSelectedStore(s)}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                            <span className="text-4xl mb-2">🗺️</span>
                            <p>표시할 지점 데이터가 없습니다.</p>
                        </div>
                    )}
                </div>

            </div>
        </PageContainer>
    );
}
