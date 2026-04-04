import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AuthLayout from '../layouts/AuthLayout';

const SignupPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name || !nickname) {
      setErrorMsg('모든 항목을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('https://someday-be-production.up.railway.app/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password, nickname }),
      });

      // Status code check since some APIs don't return standard JSON on errors
      if (!response.ok) {
        let msg = '회원가입에 실패했습니다.';
        try {
          const result = await response.json();
          msg = result.message || msg;
        } catch { }
        setErrorMsg(msg);
        setIsLoading(false);
        return;
      }

      const result = await response.json();

      // If backend returns a standardized { status: 'SUCCESS' }
      if (result.status === 'SUCCESS' || response.ok) {
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        navigate('/login');
      } else {
        setErrorMsg(result.message || '회원가입에 실패했습니다.');
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
        <h2 className="text-xl font-bold text-white mb-6 text-center">회원가입</h2>

        <div className="flex flex-col gap-4 mb-2">
          <Input
            id="email"
            type="email"
            label="이메일"
            placeholder="example@someday.app"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="name"
            type="text"
            label="이름"
            placeholder="본명을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            id="nickname"
            type="text"
            label="닉네임"
            placeholder="앱에서 사용할 닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <Input
            id="password"
            type="password"
            label="비밀번호"
            placeholder="안전한 비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
          />

          {errorMsg && <p className="text-brand-red text-xs font-semibold px-1 mt-1">{errorMsg}</p>}

          <Button id="signup-btn" fullWidth onClick={handleSignup} disabled={isLoading} className="mt-4 text-[15px] py-[14px]">
            {isLoading ? '가입 중...' : '시작하기'}
          </Button>
        </div>

        <p className="text-center text-white/45 text-[13px] mt-7">
          이미 계정이 있으신가요?{' '}
          <button id="login-link" onClick={() => navigate('/login')} className="text-brand-purple hover:text-brand-purple-light transition-colors text-[13px] font-semibold underline cursor-pointer bg-transparent border-none">
            로그인하기
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
