import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-[#F0ECE4] flex items-center justify-center px-6 relative overflow-hidden font-sans">
      {/* 배경 장식 원 (따뜻한 버전) */}
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.4] -top-[100px] -right-[100px] bg-[radial-gradient(circle,#fde68a,transparent)] animate-float pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full opacity-[0.3] -bottom-[80px] -left-[80px] bg-[radial-gradient(circle,#fbcfe8,transparent)] animate-float-reverse pointer-events-none" />

      <div className="w-full max-w-[400px] z-10 animate-fade-in-up flex flex-col pt-8 pb-12">
        {/* 로고 영역 */}
        <div className="text-center mb-8 shrink-0">
          <div className="text-[52px] mb-2 animate-[pulse_2s_ease-in-out_infinite]">☀️</div>
          <h1 className="text-[36px] font-extrabold bg-gradient-to-br from-brand-orange-dark to-brand-orange bg-clip-text text-transparent mb-1 tracking-tight drop-shadow-sm">
            SomeDay
          </h1>
          <p className="text-slate-500 font-medium text-sm">오늘의 나를 기록하세요</p>
        </div>

        {/* 폼 카드 영역 (본문) */}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
