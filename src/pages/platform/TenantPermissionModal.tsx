import { useState, useMemo, useEffect, Fragment } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import type { FranchiseSummary } from '@/data/platform.dummy';
import { PERMISSION_MENUS, DUMMY_PERMISSION_GROUPS } from '@/data/permission.dummy';

interface TenantPermissionModalProps {
    franchise: FranchiseSummary | null;
    onClose: () => void;
}

type MenuStatus = 'add' | 'deny' | null;

export default function TenantPermissionModal({ franchise, onClose }: TenantPermissionModalProps) {
    const [useDefault, setUseDefault] = useState(true);
    const [assignedGroups, setAssignedGroups] = useState<string[]>([]);
    const [exceptions, setExceptions] = useState<Record<string, MenuStatus>>({});

    // 모달 열릴 때 초기화. 실제로는 API 호출로 현재 권한 세팅을 불러와야 함
    useEffect(() => {
        if (franchise) {
            setUseDefault(true);
            setAssignedGroups([]);
            setExceptions({});
        }
    }, [franchise]);

    // 상속 권한 계산
    const baseMenuIds = useMemo(() => {
        const ids = new Set<string>();

        // 1. DEFAULT 추가
        if (useDefault) {
            PERMISSION_MENUS.filter(m => m.isDefault).forEach(m => ids.add(m.id));
        }

        // 2. 그룹 권한 추가
        DUMMY_PERMISSION_GROUPS.forEach(g => {
            if (assignedGroups.includes(g.id)) {
                g.menuIds.forEach(id => ids.add(id));
            }
        });

        return ids;
    }, [useDefault, assignedGroups]);

    // 최종 권한 계산
    const isMenuGranted = (menuId: string) => {
        const except = exceptions[menuId];
        if (except === 'deny') return false;
        if (except === 'add') return true;
        return baseMenuIds.has(menuId);
    };

    const handleGroupToggle = (groupId: string) => {
        setAssignedGroups(prev =>
            prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
        );
    };

    const handleExceptionChange = (menuId: string, status: MenuStatus) => {
        setExceptions(prev => {
            const next = { ...prev };
            if (status === null) {
                delete next[menuId];
            } else {
                next[menuId] = status;
            }
            return next;
        });
    };

    const renderMenuExceptionControl = (menuId: string) => {
        const currentStatus = exceptions[menuId] || null;

        return (
            <select
                value={currentStatus || 'inherit'}
                onChange={e => {
                    const val = e.target.value;
                    handleExceptionChange(menuId, val === 'inherit' ? null : val as MenuStatus);
                }}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-[120px]"
            >
                <option value="inherit">기본/그룹 따름</option>
                <option value="add">강제 허용</option>
                <option value="deny">강제 차단</option>
            </select>
        );
    };

    // 계층형으로 렌더링 준비
    const rootMenus = PERMISSION_MENUS.filter(m => m.parentId === null);
    const getChildren = (parentId: string) => PERMISSION_MENUS.filter(m => m.parentId === parentId);

    const handleSave = () => {
        alert('권한 설정이 저장되었습니다.');
        onClose();
    };

    return (
        <Modal open={!!franchise} onClose={onClose} title={`권한설정 — ${franchise?.franchiseName || ''}`} size="lg">
            <div className="flex flex-col gap-6">

                {/* 1. 기본 권한 */}
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border border-gray-100">
                    <div>
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            기본 권한 (DEFAULT) 일괄 적용
                            <Badge color={useDefault ? 'green' : 'gray'}>{useDefault ? 'ON' : 'OFF'}</Badge>
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                            프랜차이즈가 가져야 할 최소 필수 메뉴들 (대시보드, 매장 관리 등)을 기본으로 활성화합니다.
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={useDefault}
                            onChange={(e) => setUseDefault(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                {/* 2. 그룹 권한 */}
                <div>
                    <h4 className="font-semibold text-gray-800 mb-3">권한 그룹(역할별) 부여</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {DUMMY_PERMISSION_GROUPS.map(group => (
                            <label
                                key={group.id}
                                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${assignedGroups.includes(group.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="pt-0.5">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        checked={assignedGroups.includes(group.id)}
                                        onChange={() => handleGroupToggle(group.id)}
                                    />
                                </div>
                                <div>
                                    <div className="font-medium text-sm text-gray-900">{group.name}</div>
                                    <div className="text-xs text-gray-500 mt-1 truncate" title={group.menuIds.join(', ')}>
                                        메뉴 {group.menuIds.length}개 포함
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 3. 메뉴별 예외 제어 */}
                <div>
                    <h4 className="font-semibold text-gray-800 mb-3">개별 메뉴 예외/상세 제어</h4>
                    <div className="border border-gray-200 rounded-lg max-h-[300px] overflow-y-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-gray-50 sticky top-0 border-b border-gray-200 z-10">
                                <tr>
                                    <th className="py-2 px-4 font-medium text-gray-600 w-1/2">메뉴명</th>
                                    <th className="py-2 px-4 font-medium text-gray-600 text-center w-[120px]">권한 예외 설정</th>
                                    <th className="py-2 px-4 font-medium text-gray-600 text-center">최종 상태</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {rootMenus.map(menu => {
                                    const children = getChildren(menu.id);
                                    const isGranted = isMenuGranted(menu.id);
                                    const isExAdd = exceptions[menu.id] === 'add';
                                    const isExDeny = exceptions[menu.id] === 'deny';

                                    return (
                                        <Fragment key={menu.id}>
                                            <tr className="hover:bg-gray-50 bg-white">
                                                <td className="py-2 px-4 font-medium text-gray-800 flex items-center gap-2">
                                                    {menu.label}
                                                    {menu.isDefault && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">기본</span>}
                                                </td>
                                                <td className="py-2 px-4 text-center align-middle">
                                                    {renderMenuExceptionControl(menu.id)}
                                                </td>
                                                <td className="py-2 px-4 text-center align-middle">
                                                    {isGranted ? (
                                                        <Badge color={isExAdd ? 'blue' : 'green'}>{isExAdd ? '★ 허용됨(강제)' : '허용됨'}</Badge>
                                                    ) : (
                                                        <Badge color={isExDeny ? 'red' : 'gray'}>{isExDeny ? '차단됨(강제)' : '차단됨'}</Badge>
                                                    )}
                                                </td>
                                            </tr>
                                            {children.map(child => {
                                                const childGranted = isMenuGranted(child.id);
                                                const childExAdd = exceptions[child.id] === 'add';
                                                const childExDeny = exceptions[child.id] === 'deny';

                                                return (
                                                    <tr key={child.id} className="hover:bg-gray-50 bg-gray-50/50">
                                                        <td className="py-2 px-4 pl-10 text-gray-600 flex items-center gap-2 relative">
                                                            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200"></div>
                                                            <div className="absolute left-6 top-1/2 w-2 h-px bg-gray-200"></div>
                                                            └ {child.label}
                                                        </td>
                                                        <td className="py-2 px-4 text-center align-middle">
                                                            {renderMenuExceptionControl(child.id)}
                                                        </td>
                                                        <td className="py-2 px-4 text-center align-middle">
                                                            {childGranted ? (
                                                                <Badge color={childExAdd ? 'blue' : 'green'}>{childExAdd ? '★ 허용됨(강제)' : '허용됨'}</Badge>
                                                            ) : (
                                                                <Badge color={childExDeny ? 'red' : 'gray'}>{childExDeny ? '차단됨(강제)' : '차단됨'}</Badge>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        ※ 상위 메뉴의 접근이 제한되면 하위 메뉴의 권한이 있더라도 노출되지 않을 수 있습니다.
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                <Button variant="secondary" onClick={onClose}>취소</Button>
                <Button onClick={handleSave}>권한 적용</Button>
            </div>
        </Modal>
    );
}
