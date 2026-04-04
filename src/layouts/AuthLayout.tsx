import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center px-6 relative overflow-hidden font-sans">
      {/* 배경 장식 원 */}
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.08] -top-[100px] -right-[100px] bg-[radial-gradient(circle,#a78bfa,transparent)] animate-float pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full opacity-[0.08] -bottom-[80px] -left-[80px] bg-[radial-gradient(circle,#60a5fa,transparent)] animate-float-reverse pointer-events-none" />

      <div className="w-full max-w-[400px] z-10 animate-fade-in-up flex flex-col pt-8 pb-12">
        {/* 로고 영역 */}
        <div className="text-center mb-8 shrink-0">
          <div className="text-[52px] mb-2 animate-[pulse_2s_ease-in-out_infinite]">☀️</div>
          <h1 className="text-[36px] font-extrabold bg-gradient-to-br from-brand-purple to-brand-blue bg-clip-text text-transparent mb-1 tracking-tight">
            SomeDay
          </h1>
          <p className="text-white/55 text-sm">오늘의 나를 기록하세요</p>
        </div>

        {/* 폼 카드 영역 (본문) */}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
