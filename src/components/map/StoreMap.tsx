import { useState, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Pill, MapPin, Phone } from 'lucide-react';
import type { Store } from '@/data/platform.dummy';

interface StoreMapProps {
    stores: Store[];
    selectedStoreId?: string | null;
    onStoreClick?: (store: Store) => void;
    showLegend?: boolean;
}

// 프랜차이즈별 마커 색상 팔레트
const FRANCHISE_COLORS = [
    { text: 'text-blue-600', fill: '#2563eb', bg: 'bg-blue-600' },
    { text: 'text-indigo-600', fill: '#4f46e5', bg: 'bg-indigo-600' },
    { text: 'text-emerald-600', fill: '#059669', bg: 'bg-emerald-600' },
    { text: 'text-amber-600', fill: '#d97706', bg: 'bg-amber-600' },
    { text: 'text-rose-600', fill: '#e11d48', bg: 'bg-rose-600' },
];

function getFranchiseColorIndex(franchiseId: string) {
    // ID의 숫자 부분 추출하여 인덱스로 활용 (안전한 해싱 대용)
    const num = parseInt(franchiseId.replace(/\D/g, '') || '0', 10);
    return num % FRANCHISE_COLORS.length;
}

export default function StoreMap({ stores, selectedStoreId, onStoreClick, showLegend = false }: StoreMapProps) {
    const [popupInfo, setPopupInfo] = useState<Store | null>(null);

    // 고유 프랜차이즈 목록 추출 (범례용)
    const uniqueFranchises = useMemo(() => {
        const franchiseMap = new globalThis.Map<string, string>();
        stores.forEach(s => {
            if (!franchiseMap.has(s.franchiseId)) {
                franchiseMap.set(s.franchiseId, s.franchiseName);
            }
        });
        return Array.from(franchiseMap.entries()).map((entry) => ({ id: entry[0], name: entry[1] }));
    }, [stores]);

    // 기본 지도 스타일 (OpenStreetMap 래스터 타일 사용 - 외부 API 키 불필요)
    const mapStyle = useMemo(
        () => ({
            version: 8 as const,
            sources: {
                'osm-tiles': {
                    type: 'raster' as const,
                    tiles: [
                        'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=ko',
                        'https://mt2.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=ko',
                        'https://mt3.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=ko',
                    ],
                    tileSize: 256,
                    attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>',
                },
            },
            layers: [
                {
                    id: 'osm-tiles-layer',
                    type: 'raster' as const,
                    source: 'osm-tiles',
                    minzoom: 0,
                    maxzoom: 19,
                },
            ],
        }),
        []
    );

    // 중심으로 할 뷰포트 계산 (초기 렌더링 시 대한민국 전역 표출 혹은 서울 중심)
    // 전국 지도 뷰를 위해 zoom 레벨과 중심점을 조정 (stores 의 분포에 따라 동적으로 할 수도 있으나 여기선 고정값 사용)
    const initialViewState = {
        longitude: showLegend ? 127.8 : 127.035, // 전국 뷰일 때는 조금 더 동쪽 중심
        latitude: showLegend ? 36.3 : 37.505,   // 전국 뷰일 때는 남쪽으로
        zoom: showLegend ? 6.5 : 12,
    };

    return (
        <div className="w-full h-full relative rounded-xl overflow-hidden border border-gray-200">
            <Map
                initialViewState={initialViewState}
                mapStyle={mapStyle}
                style={{ width: '100%', height: '100%' }}
                interactiveLayerIds={['osm-tiles-layer']}
            >
                <NavigationControl position="bottom-right" />

                {stores.map((store) => {
                    const isSelected = selectedStoreId === store.storeId || popupInfo?.storeId === store.storeId;
                    const colorTarget = showLegend ? FRANCHISE_COLORS[getFranchiseColorIndex(store.franchiseId)] : FRANCHISE_COLORS[0];

                    return (
                        <Marker
                            key={store.storeId}
                            longitude={store.longitude}
                            latitude={store.latitude}
                            anchor="bottom"
                            onClick={(e) => {
                                e.originalEvent.stopPropagation();
                                setPopupInfo(store);
                                onStoreClick?.(store);
                            }}
                        >
                            <div className="relative flex flex-col items-center justify-center group">
                                <div
                                    className={`relative z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border-2 transition-all duration-300 shadow-md ${isSelected
                                        ? `${colorTarget.bg} text-white border-white scale-110 ring-2 ring-${colorTarget.bg.replace('bg-', '')}/50 ring-offset-1`
                                        : `bg-white ${colorTarget.text} border-white group-hover:scale-105`
                                        }`}
                                >
                                    <Pill size={14} className={isSelected ? 'text-white/90' : colorTarget.text} />
                                    <span>{store.franchiseName}</span>
                                </div>
                                {/* 꼬리 부분 (박스 아래 삼각형) */}
                                <div
                                    className={`absolute -bottom-1.5 z-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] transition-all duration-300 ${isSelected ? 'scale-110 drop-shadow-md' : 'group-hover:scale-105'}`}
                                    style={{ borderTopColor: isSelected ? colorTarget.fill : 'white' }}
                                />
                            </div>
                        </Marker>
                    );
                })}

                {popupInfo && (
                    <Popup
                        anchor="bottom"
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}
                        offset={[0, -32]}
                        onClose={() => setPopupInfo(null)}
                        closeButton={true}
                        closeOnClick={false}
                        className="z-10 rounded-xl shadow-xl overflow-hidden"
                        maxWidth="320px"
                    >
                        <div className="min-w-[220px] p-2">
                            <div className="flex items-start justify-between mb-3 border-b border-gray-100 pb-3">
                                <div className="pr-2">
                                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{popupInfo.storeName}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{popupInfo.franchiseName}</p>
                                </div>
                                <span className={`shrink-0 px-2 py-1 rounded-md text-[10px] font-bold tracking-wide ${popupInfo.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {popupInfo.status === 'ACTIVE' ? '운영중' : '폐점'}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2.5 text-gray-600 text-xs">
                                    <MapPin size={14} className="mt-0.5 text-gray-400 shrink-0" />
                                    <span className="leading-relaxed">{popupInfo.address}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-gray-600 text-xs">
                                    <Phone size={14} className="text-gray-400 shrink-0" />
                                    <span>{popupInfo.contact}</span>
                                </div>
                            </div>
                        </div>
                    </Popup>
                )}
            </Map>

            {/* 범례 표시 (showLegend가 true일 때만) */}
            {showLegend && uniqueFranchises.length > 0 && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-100 min-w-[140px] z-10 pointer-events-none">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2 border-b border-gray-200 pb-1">프랜차이즈 범례</h4>
                    <div className="flex flex-col gap-1.5">
                        {uniqueFranchises.map((f: { id: string; name: string }) => {
                            const colorClass = FRANCHISE_COLORS[getFranchiseColorIndex(f.id)].bg;
                            return (
                                <div key={f.id} className="flex items-center gap-2 text-xs text-gray-600">
                                    <div className={`w-3 h-3 rounded-full ${colorClass} shadow-sm border border-white`} />
                                    <span className="truncate">{f.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
