import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DUMMY_ACCOUNTS } from '@/data/auth.dummy';
import { ShieldCheck } from 'lucide-react';

const PLATFORM_ACCOUNT = DUMMY_ACCOUNTS.find((a) => a.role === 'PLATFORM_ADMIN')!;

export default function PlatformLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && currentUser?.role === 'PLATFORM_ADMIN') {
    navigate('/platform/dashboard');
    return null;
  }

  function handleQuickLogin() {
    setEmail(PLATFORM_ACCOUNT.email);
    setPassword(PLATFORM_ACCOUNT.password);
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
      } else if (account.role !== 'PLATFORM_ADMIN') {
        setError('플랫폼 관리자 계정이 아닙니다.');
      } else {
        const { password: _pw, ...user } = account;
        void _pw;
        login(user);
        navigate('/platform/dashboard');
      }
      setLoading(false);
    }, 300);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 14 14" fill="none">
                <rect x="5.5" y="1" width="3" height="12" rx="1" fill="white" />
                <rect x="1" y="5.5" width="12" height="3" rx="1" fill="white" />
              </svg>
            </div>
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight">PharmInsight</h1>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <ShieldCheck size={13} className="text-blue-400" />
            <span className="text-blue-400 text-xs font-semibold tracking-wide">
              플랫폼 관리자 전용 포털
            </span>
          </div>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-xs text-slate-400 mb-5 text-center">
            관리자 자격증명으로 로그인하세요.
          </p>

          {/* 데모용 빠른 로그인 */}
          <div className="mb-5">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
              데모 계정
            </p>
            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full text-left px-3 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:border-slate-600 hover:bg-slate-750 transition-colors"
            >
              <p className="text-[12px] font-semibold text-slate-200">플랫폼 관리자</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{PLATFORM_ACCOUNT.email}</p>
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="h-px bg-slate-800 flex-1" />
            <span className="text-[11px] text-slate-600">또는 직접 입력</span>
            <div className="h-px bg-slate-800 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="관리자 이메일"
              required
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && (
              <p className="text-xs text-red-400 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors mt-1"
            >
              {loading ? '로그인 중...' : '관리자 로그인'}
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-700 mt-4">
            데모 비밀번호: <span className="font-mono text-slate-600">test1234</span>
          </p>
        </div>

        <p className="text-slate-700 text-[11px] text-center mt-6">
          PharmInsight v2.0 · 플랫폼 관리자 전용
        </p>
      </div>
    </div>
  );
}
