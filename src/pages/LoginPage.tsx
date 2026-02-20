import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DUMMY_ACCOUNTS } from '@/data/auth.dummy';
import { BRANDING } from '@/data/branding.dummy';

// PLATFORM_ADMIN은 /platform/login에서 별도 인증
const TENANT_ACCOUNTS = DUMMY_ACCOUNTS.filter((a) => a.role !== 'PLATFORM_ADMIN');

function PharmLogo({ size = 28 }: { size?: number }) {
  return (
    <div
      className="bg-blue-600 rounded-xl flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={Math.round(size * 0.57)}
        height={Math.round(size * 0.57)}
        viewBox="0 0 16 16"
        fill="none"
      >
        <rect x="6" y="1" width="4" height="14" rx="1.5" fill="white" />
        <rect x="1" y="6" width="14" height="4" rx="1.5" fill="white" />
      </svg>
    </div>
  );
}


export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  function handleQuickLogin(userId: string) {
    const account = TENANT_ACCOUNTS.find((a) => a.userId === userId);
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
      setSelectedAccountId(userId);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const account = DUMMY_ACCOUNTS.find(
        (a) => a.email === email && a.password === password
      );
      if (!account) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (account.role === 'PLATFORM_ADMIN') {
        setError('플랫폼 관리자는 관리자 포털(/platform/login)에서 로그인하세요.');
      } else {
        const { password: _pw, ...user } = account;
        void _pw;
        login(user);
        navigate('/');
      }
      setLoading(false);
    }, 300);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 왼쪽 브랜드 패널 */}
      <div className="hidden lg:flex w-72 bg-slate-900 flex-col justify-between p-8 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <PharmLogo size={32} />
            <span className="text-white font-bold text-lg tracking-tight">{BRANDING.serviceName}</span>
          </div>
          <h2 className="text-white text-2xl font-bold leading-snug">
            {BRANDING.loginTagline}<br />
            <span className="text-blue-400">스마트 인사이트</span>
          </h2>
          <p className="text-slate-400 text-sm mt-4 leading-relaxed">
            데이터 기반 실적 관리,<br />
            결제수단 분석, 카드 승인 내역을<br />
            한눈에 파악하세요.
          </p>
        </div>
        <p className="text-slate-600 text-xs">{BRANDING.serviceName} {BRANDING.version} · {BRANDING.year}</p>
      </div>

      {/* 오른쪽 로그인 영역 */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-6">
            <div className="flex justify-center mb-2">
              <PharmLogo size={36} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mt-2">{BRANDING.serviceName}</h1>
          </div>

          <h2 className="text-[15px] font-bold text-gray-900 mb-1">로그인</h2>
          <p className="text-xs text-gray-400 mb-5">역할을 선택하거나 직접 입력하세요.</p>

          {/* 빠른 역할 선택 */}
          <div className="mb-5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              데모 계정 빠른 선택
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {TENANT_ACCOUNTS.map((account) => (
                <button
                  key={account.userId}
                  type="button"
                  onClick={() => handleQuickLogin(account.userId)}
                  className={`text-left px-3 py-2 rounded-lg border text-[12px] transition-all ${selectedAccountId === account.userId
                    ? 'border-blue-400 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                    }`}
                >
                  <div className="font-semibold text-gray-800 truncate leading-tight">
                    {account.name.replace(/○○약국 /, '').replace(/프랜차이즈 /, '')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-[11px] text-gray-400">또는 직접 입력</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              required
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="text-[11px] text-center text-gray-300 mt-4">
            공통 비밀번호: <span className="font-mono text-gray-400">test1234</span>
          </p>
        </div>
      </div>
    </div>
  );
}
