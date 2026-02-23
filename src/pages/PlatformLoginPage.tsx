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

  const inputClass =
    'bg-white/[0.07] ring-1 ring-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60 transition-all duration-[var(--transition-fast)]';

  return (
    <div className="min-h-screen bg-[#0c0e1a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* 배경 그라디언트 오브 */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-30%] right-[-10%] w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[150px]" />

      <div className="w-full max-w-sm animate-[slideUp_400ms_ease-out] relative z-10">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/30">
              <svg width="24" height="24" viewBox="0 0 14 14" fill="none">
                <rect x="5.5" y="1" width="3" height="12" rx="1" fill="white" />
                <rect x="1" y="5.5" width="12" height="3" rx="1" fill="white" />
              </svg>
            </div>
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight">PharmInsight</h1>
          <div className="flex items-center justify-center mt-3">
            <div className="inline-flex items-center gap-1.5 bg-primary-500/15 ring-1 ring-primary-400/30 rounded-full px-3 py-1">
              <ShieldCheck size={12} className="text-primary-300" />
              <span className="text-primary-200 text-[11px] font-semibold tracking-wider uppercase">
                플랫폼 관리자 전용 포털
              </span>
            </div>
          </div>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white/[0.05] backdrop-blur-xl ring-1 ring-white/[0.08] rounded-2xl p-6 shadow-2xl">
          <p className="text-xs text-slate-400 mb-5 text-center">
            관리자 자격증명으로 로그인하세요.
          </p>

          {/* 데모용 빠른 로그인 */}
          <div className="mb-5">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              데모 계정
            </p>
            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full text-left px-4 py-3 rounded-xl ring-1 ring-white/10 bg-white/[0.04] hover:ring-white/20 hover:bg-white/[0.08] transition-all duration-[var(--transition-fast)]"
            >
              <p className="text-[12px] font-semibold text-slate-200">플랫폼 관리자</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{PLATFORM_ACCOUNT.email}</p>
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[11px] text-slate-500">또는 직접 입력</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="관리자 이메일"
              required
              className={inputClass}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              className={inputClass}
            />
            {error && (
              <p className="text-xs text-red-400 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary-600 to-violet-600 text-white rounded-xl py-3 text-sm font-semibold hover:from-primary-500 hover:to-violet-500 disabled:opacity-60 transition-all duration-[var(--transition-fast)] mt-1 shadow-lg shadow-primary-600/20 active:scale-[0.98]"
            >
              {loading ? '로그인 중...' : '관리자 로그인'}
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-600 mt-4">
            데모 비밀번호: <span className="font-mono text-slate-500">test1234</span>
          </p>
        </div>

        <p className="text-slate-600 text-[11px] text-center mt-6">
          PharmInsight v2.0 · 플랫폼 관리자 전용
        </p>
      </div>
    </div>
  );
}
