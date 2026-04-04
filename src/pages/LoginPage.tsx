import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: 실제 로그인 로직
    navigate('/main');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center px-6 relative overflow-hidden">
      {/* 배경 장식 원 */}
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.08] -top-[100px] -right-[100px] bg-[radial-gradient(circle,#a78bfa,transparent)] animate-float pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full opacity-[0.08] -bottom-[80px] -left-[80px] bg-[radial-gradient(circle,#60a5fa,transparent)] animate-float-reverse pointer-events-none" />

      <div className="w-full max-w-[400px] z-10">
        {/* 로고 */}
        <div className="text-center mb-10">
          <div className="text-[52px] mb-3 animate-[pulse_2s_ease-in-out_infinite]">☀️</div>
          <h1 className="text-[36px] font-extrabold bg-gradient-to-br from-brand-purple to-brand-blue bg-clip-text text-transparent mb-2 tracking-tight">
            SomeDay
          </h1>
          <p className="text-white/55 text-sm">오늘의 나를 기록하세요</p>
        </div>

        {/* 카드 */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <div className="flex flex-col gap-4 mb-4">
            <Input id="email"    type="email"    label="이메일"   placeholder="이메일을 입력하세요" />
            <Input id="password" type="password" label="비밀번호" placeholder="비밀번호를 입력하세요" />
            <Button id="login-btn" fullWidth onClick={handleLogin}>
              로그인
            </Button>
          </div>

          {/* 구분선 */}
          <div className="flex items-center gap-3 text-white/30 text-[13px] my-2">
            <div className="flex-1 h-px bg-white/12" />
            <span>또는</span>
            <div className="flex-1 h-px bg-white/12" />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <Button id="kakao-login-btn" variant="kakao" fullWidth>
              <span>💬</span> 카카오로 시작하기
            </Button>
            <Button id="google-login-btn" variant="google" fullWidth>
              <span>🔍</span> Google로 시작하기
            </Button>
          </div>

          <p className="text-center text-white/45 text-[13px] mt-5">
            아직 계정이 없으신가요?{' '}
            <button id="signup-link" className="text-brand-purple text-[13px] font-semibold underline cursor-pointer bg-transparent border-none">
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
