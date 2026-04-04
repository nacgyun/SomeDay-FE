import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useChat } from '../../../hooks/useChat';

interface DiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'diary' | 'survey';
}

const DiaryModal = ({ isOpen, onClose, mode }: DiaryModalProps) => {
  const { user } = useAuth(); //
  const { messages, isLoading, isAnalyzing, analysisResult, startChat, sendMessage, resetChat } = useChat();
  const [input, setInput] = useState('');
  
  const msgEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 모달 열릴 때 API를 통한 채팅 세션 시작
  useEffect(() => {
    if (isOpen && user?.id) {
      startChat(user.id); //
      setTimeout(() => inputRef.current?.focus(), 300);
    } else if (!isOpen) {
      resetChat();
      if (input !== '') {
        setInput('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user?.id, startChat, resetChat]);

  // 메시지 추가 시 아래로 자동 스크롤
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ─── 수정된 부분: sendMessage 호출 시 user.id 전달 ───
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || !user?.id || isLoading) return;

    setInput(''); // 입력 필드 즉시 초기화 (Optimistic UI)
    
    /**
     * 💡 변경됨: 훅의 정의에 따라 userId를 두 번째 인자로 넘겨줍니다.
     * 이를 통해 /api/chat-sessions/{sessionId}/messages?userId=... 요청이 완성됩니다.
     */
    await sendMessage(text, user.id); //
  }, [input, user?.id, isLoading, sendMessage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* 딤 오버레이 */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* 모달 패널 */}
      <div className="relative w-full max-w-[480px] h-[88vh] flex flex-col bg-white border border-slate-200 rounded-t-[28px] shadow-2xl overflow-hidden">
        {/* 핸들 */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-base border border-slate-200 shadow-sm">
              {mode === 'diary' ? '📔' : '📋'}
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 leading-tight">
                {mode === 'diary' ? '오늘 일기 쓰기' : '마음 설문'}
              </h3>
              <p className="text-[11px] text-brand-orange-dark font-medium">AI 감정 코치와 대화 중</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors text-lg cursor-pointer border-none"
          >
            ×
          </button>
        </div>

        {/* 채팅 영역 또는 결과 리포트 */}
        {analysisResult ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 overflow-y-auto">
            <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
              📈
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">분석이 완료되었습니다!</h2>
            <p className="text-sm text-slate-500 mb-6 text-center">
              대화를 바탕으로 오늘 하루의 타워를 세웠어요.
            </p>
            
            <div className="w-full max-w-[320px] bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mt-2">
              <div className="flex justify-between items-center mb-5 pb-5 border-b border-slate-100">
                <span className="text-slate-600 font-bold">오늘의 안정도</span>
                <span className="text-3xl font-black text-brand-orange-dark">
                  {analysisResult.stabilityScore ?? 100}%
                </span>
              </div>
              
              <div className="flex flex-col gap-3">
                <span className="text-slate-500 font-bold text-[13px] mb-1">💡 추천 미션</span>
                {analysisResult.recommendedMissions && analysisResult.recommendedMissions.length > 0 ? (
                  analysisResult.recommendedMissions.map((mission: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 rounded-xl px-4 py-3.5 text-slate-700 text-[14px] font-medium border border-slate-100 shadow-sm flex items-start gap-3">
                      <span className="text-brand-orange mt-0.5">✔</span>
                      <span className="leading-tight">{mission.title || mission}</span>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 rounded-xl px-4 py-3.5 text-slate-700 text-[14px] font-medium border border-slate-100 shadow-sm text-center">
                    푹 쉬면서 마음을 충전하세요! 🛋️
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="mt-8 w-full max-w-[320px] py-4 rounded-xl font-bold text-[16px] bg-slate-800 hover:bg-slate-700 text-white shadow-lg transition-colors cursor-pointer border-none"
            >
              결과 닫기
            </button>
          </div>
        ) : (
        <>
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 no-scrollbar bg-[#0f0f1e] relative">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-0.5">
                  🤖
                </div>
              )}

              <div
                className={[
                  'max-w-[78%] rounded-[16px] px-4 py-3 text-[14px] leading-relaxed whitespace-pre-line shadow-sm border border-transparent',
                  msg.role === 'ai'
                    ? 'bg-slate-50 border-slate-200 text-slate-800 rounded-tl-sm'
                    : 'bg-gradient-to-br from-brand-orange to-brand-orange-dark text-white rounded-tr-sm shadow-[0_4px_12px_rgba(255,107,0,0.2)]',
                ].join(' ')}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && !isAnalyzing && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-0.5">
                🤖
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-[16px] rounded-tl-sm px-4 py-3.5 flex items-center gap-1 shadow-sm">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={msgEndRef} />
        </div>

        {/* 분석 중 오버레이 */}
        {isAnalyzing && (
          <div className="absolute inset-0 top-[60px] z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-14 h-14 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-800 font-bold text-[16px]">마음을 분석하여 타워를 쌓고 있어요...</p>
            <p className="text-slate-500 text-[13px] mt-2">잠시만 기다려주세요</p>
          </div>
        )}

        {/* 입력 창 */}
        <div className="px-4 pb-6 pt-3 border-t border-slate-100 flex-shrink-0 relative z-20">
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 shadow-inner rounded-2xl px-4 py-2.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                  handleSend();
                }
              }}
              placeholder={isAnalyzing ? "분석 중입니다..." : "마음을 자유롭게 적어보세요..."}
              disabled={isAnalyzing}
              className="flex-1 bg-transparent text-slate-800 text-[14px] outline-none placeholder:text-slate-400 font-sans disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isAnalyzing}
              className={[
                'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer border-none text-base',
                input.trim() && !isLoading && !isAnalyzing
                  ? 'bg-gradient-to-br from-brand-orange to-brand-orange-dark text-white shadow-[0_4px_12px_rgba(255,107,0,0.3)]'
                  : 'bg-slate-100 text-slate-400',
              ].join(' ')}
            >
              ↑
            </button>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default DiaryModal;