import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
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
        login(result.data);
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
      <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col gap-4 mb-2">
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
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          {errorMsg && <p className="text-brand-red text-xs font-semibold px-1">{errorMsg}</p>}
          <Button id="login-btn" fullWidth onClick={handleLogin} disabled={isLoading} className="mt-2 text-[15px] py-[14px]">
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-3 text-white/30 text-[13px] my-5 relative">
          <div className="flex-1 h-px bg-white/10" />
          <span className="font-medium">또는</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="flex flex-col gap-3">
          <Button id="kakao-login-btn" variant="kakao" fullWidth className="py-3">
            <span className="mr-1">💬</span> 카카오로 시작하기
          </Button>
          <Button id="google-login-btn" variant="google" fullWidth className="py-3">
            <span className="mr-1">🔍</span> Google로 시작하기
          </Button>
        </div>

        <p className="text-center text-white/45 text-[13px] mt-7">
          아직 계정이 없으신가요?{' '}
          <button id="signup-link" onClick={() => navigate('/signup')} className="text-brand-purple hover:text-brand-purple-light transition-colors text-[13px] font-semibold underline cursor-pointer bg-transparent border-none">
            회원가입
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
