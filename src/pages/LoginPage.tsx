import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import type { ApiResponse, User } from '../types';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('https://someday-be-production.up.railway.app/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result: ApiResponse<User> = await response.json();

      if (result.status === 'SUCCESS') {
        const userData = result.data;
        let profileData = null;

        try {
          const profileResponse = await fetch(`https://someday-be-production.up.railway.app/api/my-profiles/${userData.id}`);
          if (profileResponse.ok) {
            const profileDataActual = await profileResponse.json();
            profileData = profileDataActual;
          }
        } catch (profileError) {
          console.error('Failed to fetch profile data:', profileError);
        }

        login(userData, profileData);
        navigate('/main');
      } else {
        setErrorMsg(result.message || '이메일 또는 비밀번호를 확인해주세요.');
      }
    } catch (e) {
      setErrorMsg('서버와 통신하는 중 문제가 발생했습니다.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {isLoading && <LoadingOverlay />}
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="flex flex-col gap-4 mb-2">
          <Input
            id="email"
            type="email"
            label="이메일"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            type="password"
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMsg && <p className="text-brand-red text-xs font-semibold px-1">{errorMsg}</p>}
          <button 
            id="login-btn" 
            type="submit" 
            disabled={isLoading} 
            className="w-full mt-2 text-[15px] py-[14px] bg-[#B6754C] !bg-[#B6754C] hover:bg-[#a06642] transition-colors border-none rounded-xl shadow-md text-white font-bold cursor-pointer transition-all active:scale-[0.98]"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center gap-3 text-slate-400 text-[13px] my-5 relative">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="font-bold text-slate-500">또는</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="flex flex-col gap-3">
          <button 
            id="kakao-login-btn" 
            className="w-full py-3 shadow-sm hover:shadow-md transition-shadow bg-[#FEE500] !bg-[#FEE500] text-[#191919] font-medium border-none rounded-xl flex items-center justify-center cursor-pointer active:scale-[0.98]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
              <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.712 4.8 4.32 6.031l-.81 2.97c-.114.411.144.823.576.823.153 0 .302-.045.429-.138l3.435-2.288c.351.05.708.077 1.05.077 4.97 0 9-3.186 9-7.115C21 6.185 16.97 3 12 3z"/>
            </svg>
            카카오로 시작하기
          </button>
          <button 
            id="google-login-btn" 
            className="w-full py-3 shadow-sm hover:shadow-md transition-shadow bg-white !bg-white text-black font-medium border border-slate-200 rounded-xl flex items-center justify-center cursor-pointer active:scale-[0.98]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="mr-2">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google로 시작하기
          </button>
        </div>

        <p className="text-center text-slate-500 text-[13px] mt-7">
          아직 계정이 없으신가요?{' '}
          <button id="signup-link" onClick={() => navigate('/signup')} className="text-[#B6754C] hover:text-[#a06642] transition-colors text-[13px] font-bold underline cursor-pointer bg-transparent border-none">
            회원가입
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
