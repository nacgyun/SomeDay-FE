/**
 * 프리미엄 젠가 로딩 오버레이
 * 블록이 하나씩 차곡차곡 쌓이는 애니메이션을 통해 브랜드 정체성을 전달합니다.
 */
const LoadingOverlay = ({ message = "마음을 차곡차곡 쌓고 있습니다..." }: { message?: string }) => {
  const color = "#B6754C";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl animate-fade-in">
      <div className="relative flex flex-col items-center">
        {/* 젠가 타워 쌓기 애니메이션 */}
        <div className="w-24 h-24 mb-10 relative animate-tower-loop">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
            {/* 1층 (Bottom) - 가장 먼저 안착 */}
            <rect 
              x="3" y="13" width="18" height="4" rx="1" 
              fill={color} fillOpacity="0.8" 
              className="animate-jenga-block delay-1"
            />
            
            {/* 2층 (Middle) - 왼쪽, 중앙, 오른쪽 순서로 하나씩 */}
            <rect 
              x="3" y="8" width="5" height="4" rx="1" 
              fill={color} 
              className="animate-jenga-block delay-2"
            />
            <rect 
              x="9.5" y="8" width="5" height="4" rx="1" 
              fill={color} 
              className="animate-jenga-block delay-3"
            />
            <rect 
              x="16" y="8" width="5" height="4" rx="1" 
              fill={color} 
              className="animate-jenga-block delay-4"
            />

            {/* 3층 (Top) - 마지막으로 툭 */}
            <rect 
              x="3" y="3" width="18" height="4" rx="1" 
              fill={color} fillOpacity="0.9" 
              className="animate-jenga-block delay-5"
            />
            
            {/* 바닥 그림자 라인 */}
            <path d="M4 19H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.2" className="animate-fade-in" />
          </svg>
        </div>
        
        {/* 로딩 텍스트 */}
        <div className="text-center animate-fade-in-up">
          <p className="text-slate-800 font-extrabold text-xl tracking-tight mb-2">
            {message}
          </p>
          <div className="flex justify-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-brand-orange/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-brand-orange/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce" />
          </div>
        </div>
        
        {/* 부드러운 배경 글로우 */}
        <div className="absolute -z-10 w-48 h-48 bg-brand-orange/5 rounded-full blur-[60px] animate-pulse" />
      </div>
    </div>
  );
};

export default LoadingOverlay;
