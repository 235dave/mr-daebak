
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { User, ShieldCheck, Mail, Lock, UserPlus, KeyRound } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, register, user, loading } = useAuth();
  const navigate = useNavigate();

  // State
  const [roleMode, setRoleMode] = useState<UserRole | null>(null); // 'CUSTOMER' or 'STAFF'
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setStaffCode('');
    setIsRegistering(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isRegistering) {
      if (!name) {
         alert("이름을 입력해주세요.");
         setIsLoading(false);
         return;
      }
      const res = await register(email, password, name, roleMode!, staffCode);
      if (!res.success) {
        alert('회원가입 실패: ' + res.error);
      }
    } else {
      const res = await login(email, password);
      if (!res.success) {
        alert('로그인 실패: ' + res.error);
      }
    }
    setIsLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // 1. Selection Screen
  if (!roleMode) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-amber-500 mb-2">Mr. Daebak</h1>
        <p className="text-stone-500 mb-12">스마트 한식 주문 서비스</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <button 
            onClick={() => { setRoleMode(UserRole.CUSTOMER); resetForm(); }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-4 group border-2 border-transparent hover:border-amber-500"
          >
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-500 transition-colors">
              <User className="w-10 h-10 text-amber-600 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-bold text-stone-800">손님으로 로그인</h2>
            <p className="text-stone-500 text-sm">맛있는 한식을 주문해보세요</p>
          </button>

          <button 
            onClick={() => { setRoleMode(UserRole.STAFF); resetForm(); }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-4 group border-2 border-transparent hover:border-stone-800"
          >
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center group-hover:bg-stone-800 transition-colors">
              <ShieldCheck className="w-10 h-10 text-stone-600 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-bold text-stone-800">직원으로 로그인</h2>
            <p className="text-stone-500 text-sm">주문 및 재고 관리</p>
          </button>
        </div>
      </div>
    );
  }

  // 2. Login/Register Form
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative">
        <button 
          onClick={() => setRoleMode(null)}
          className="absolute top-4 left-4 text-stone-400 hover:text-stone-600 text-sm font-medium"
        >
          ← 뒤로가기
        </button>

        <h1 className="text-2xl font-bold text-center mb-1 text-stone-800">
          {roleMode === UserRole.CUSTOMER ? '손님' : '직원'} {isRegistering ? '회원가입' : '로그인'}
        </h1>
        <p className="text-center text-stone-500 mb-8 text-sm">
          {roleMode === UserRole.STAFF && isRegistering && '관리자 코드가 필요합니다.'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">이름</label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-2.5 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="홍길동"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">이메일</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="example@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-5 h-5 text-stone-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="******"
                required
              />
            </div>
          </div>

          {isRegistering && roleMode === UserRole.STAFF && (
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">직원 코드</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 w-5 h-5 text-stone-400" />
                <input
                  type="password"
                  value={staffCode}
                  onChange={(e) => setStaffCode(e.target.value)}
                  className="w-full pl-10 px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="관리자 코드 입력"
                  required
                />
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white font-bold py-3 rounded-lg transition-colors mt-6 flex items-center justify-center
              ${roleMode === UserRole.CUSTOMER ? 'bg-amber-500 hover:bg-amber-600' : 'bg-stone-800 hover:bg-stone-900'}
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? '처리 중...' : (isRegistering ? '가입하기' : '로그인')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-stone-500 hover:underline"
          >
            {isRegistering ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
