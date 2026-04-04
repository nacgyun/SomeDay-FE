import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import AuthLayout from '../layouts/AuthLayout';

const SignupPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'남성' | '여성' | ''>('');
  const [age, setAge] = useState('');
  const [bedTime, setBedTime] = useState('23:00'); // 기본값 밤 11시

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name || !nickname || !gender || !age) {
      setErrorMsg('모든 항목을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const today = new Date().toISOString().split('T')[0];
      const formattedBedTime = `${today}T${bedTime}:00`;

      const signupData = {
        email,
        name,
        password,
        nickname,
        gender: gender === '남성' ? 'MALE' : 'FEMALE',
        age: parseInt(age, 10),
        bedTime: formattedBedTime
      };

      const response = await fetch('https://someday-be-production.up.railway.app/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        let msg = '회원가입에 실패했습니다.';
        if (response.status === 500) {
          msg = '서버 오류입니다. 입력 정보를 확인해주세요.';
        }
        try {
          const result = await response.json();
          msg = result.message || msg;
        } catch { /* empty */ }
        setErrorMsg(msg);
        return;
      }

      const result = await response.json();

      if (result.status === 'SUCCESS' || response.ok) {
        setIsSuccessModalOpen(true);
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
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <h2 className="text-xl font-extrabold text-slate-800 mb-6 text-center">회원가입</h2>

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
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <Input
            id="nickname"
            type="text"
            label="닉네임"
            placeholder="앱에서 사용할 닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">성별</label>
              <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setGender('남성')}
                  className={`flex-1 py-[10px] text-sm rounded-lg transition-all ${gender === '남성' ? 'bg-white shadow-sm text-[#B6754C] font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  남성
                </button>
                <button
                  type="button"
                  onClick={() => setGender('여성')}
                  className={`flex-1 py-[10px] text-sm rounded-lg transition-all ${gender === '여성' ? 'bg-white shadow-sm text-[#B6754C] font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  여성
                </button>
              </div>
            </div>
            <div className="w-[100px]">
              <Input
                id="age"
                type="number"
                label="나이"
                placeholder="세"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          <Input
            id="bedTime"
            type="time"
            label="평균 취침 시간"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
          />

          <Input
            id="password"
            type="password"
            label="비밀번호"
            placeholder="안전한 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
          />

          {errorMsg && <p className="text-brand-red text-xs font-semibold px-1 mt-1">{errorMsg}</p>}

          <button 
            id="signup-btn" 
            onClick={handleSignup} 
            disabled={isLoading} 
            className="w-full mt-4 text-[15px] py-[14px] bg-[#B6754C] !bg-[#B6754C] hover:bg-[#a06642] text-white font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.95]"
          >
            {isLoading ? '가입 중...' : '시작하기'}
          </button>
        </div>

        <p className="text-center text-slate-500 text-[13px] mt-7">
          이미 계정이 있으신가요?{' '}
          <button id="login-link" onClick={() => navigate('/login')} className="text-[#B6754C] hover:text-[#a06642] transition-colors text-[13px] font-bold underline cursor-pointer bg-transparent border-none">
            로그인하기
          </button>
        </p>
      </div>

      {/* 가입 완료 모달 */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-5">
          <div className="bg-[#F7F3EB] border border-slate-100 rounded-[32px] w-full max-w-[340px] p-8 shadow-2xl text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 text-4xl">
              ✨
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">환영합니다!</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
               회원가입이 완료되었습니다.<br />
              이제 <span className="text-[#B6754C] font-bold">{nickname}</span>님의<br />
              일상을 기록해볼까요?
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 bg-[#B6754C] !bg-[#B6754C] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-[0.96]"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default SignupPage;
