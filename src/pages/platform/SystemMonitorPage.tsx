import { AlertTriangle, Activity, Database, Server, ServerCrash } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Badge from '@/components/ui/Badge';
import { formatKRW, formatRatio } from '@/utils/formatters';
import { useSetPageMeta } from '@/hooks/usePageMeta';
import { DUMMY_ANOMALIES } from '@/data/platform.dummy';

export default function SystemMonitorPage() {
    useSetPageMeta(
        '시스템 모니터링',
        '플랫폼 인프라 상태 및 가맹점 매출 이상 징후 실시간 감지',
    );

    return (
        <PageContainer>
            {/* 인프라 상태 모니터링 (가상 데이터) */}
            <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Server size={18} className="text-primary-600" />
                인프라 상태
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* API 서버 상태 */}
                <div className="bg-white rounded-[var(--radius-card)] border border-slate-100 p-5 shadow-[var(--shadow-card)] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                            <Activity size={18} />
                        </div>
                        <Badge color="green">정상</Badge>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">API 서버 (Core)</p>
                        <p className="text-lg font-bold text-gray-900">Uptime 99.98%</p>
                    </div>
                </div>

                {/* DB 상태 */}
                <div className="bg-white rounded-[var(--radius-card)] border border-slate-100 p-5 shadow-[var(--shadow-card)] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                            <Database size={18} />
                        </div>
                        <Badge color="green">정상</Badge>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">메인 데이터베이스</p>
                        <p className="text-lg font-bold text-gray-900">12ms 지연</p>
                    </div>
                </div>

                {/* 메모리 사용량 */}
                <div className="bg-white rounded-[var(--radius-card)] border border-slate-100 p-5 shadow-[var(--shadow-card)] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Server size={18} />
                        </div>
                        <Badge color="yellow">주의</Badge>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">메모리 사용률 (Memory)</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-lg font-bold text-gray-900">78%</p>
                            <p className="text-xs text-gray-400">/ 128GB</p>
                        </div>
                    </div>
                </div>

                {/* 에러 발생률 */}
                <div className="bg-white rounded-[var(--radius-card)] border border-slate-100 p-5 shadow-[var(--shadow-card)] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                            <ServerCrash size={18} />
                        </div>
                        <Badge color="green">양호</Badge>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">일관별 API 에러율</p>
                        <p className="text-lg font-bold text-gray-900">0.02%</p>
                    </div>
                </div>
            </div>

            {/* 비즈니스 이상 징후 (매출 급감 등) */}
            <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-500" />
                가맹점 매출 이상 징후
            </h2>
            <div className="bg-white border border-slate-100 rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)]">
                {DUMMY_ANOMALIES.length > 0 ? (
                    <>
                        <p className="text-sm text-gray-500 mb-4">
                            전일 대비 매출이 <strong className="text-red-600">-30% 이상 급락</strong>한 매장 목록입니다. 포스기 오작동 혹은 데이터 갱신 누락이 의심됩니다.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {DUMMY_ANOMALIES.map((a) => (
                                <div
                                    key={a.storeId}
                                    className="bg-red-50/50 rounded-lg border border-red-100 p-4 transition-colors hover:bg-red-50"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">{a.storeName}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{a.franchiseName}</p>
                                        </div>
                                        <Badge color="red">{formatRatio(a.dropRatio)}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400">오늘 매출</span>
                                            <span className="text-sm font-bold text-gray-800">{formatKRW(a.todaySales)}</span>
                                        </div>
                                        <div className="w-px h-6 bg-gray-200" />
                                        <div className="flex flex-col text-right">
                                            <span className="text-[10px] text-gray-400">어제 매출</span>
                                            <span className="text-sm text-gray-500">{formatKRW(a.yesterdaySales)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <Activity size={32} className="mb-3 text-gray-300" />
                        <p className="text-sm">현재 감지된 이상 징후가 없습니다.</p>
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
