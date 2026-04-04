import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

interface DiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'diary' | 'survey';
}

const AI_INTRO: Record<'diary' | 'survey', string> = {
  diary: '안녕하세요 😊 오늘 하루 어떠셨나요? 편하게 이야기해 주세요. 여기서는 솔직하게 말해도 괜찮아요.',
  survey: '안녕하세요! 오늘의 마음 상태를 체크해볼게요 🌿\n\n첫 번째 질문이에요: 오늘 하루 전반적인 기분은 어떤가요? (1~10점)',
};

const DiaryModal = ({ isOpen, onClose, mode }: DiaryModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const msgEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 모달 열릴 때 AI 인트로 메시지 추가
  useEffect(() => {
    if (isOpen) {
      setMessages([
        { id: 1, role: 'ai', text: AI_INTRO[mode], timestamp: new Date() },
      ]);
      setInput('');
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, mode]);

  // 메시지 추가 시 스크롤
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI 응답 시뮬레이션 (추후 실제 API 연동)
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    const aiResponses = [
      '그런 감정을 느끼는 건 정말 자연스러운 일이에요. 조금 더 이야기해 주실 수 있나요? 🌙',
      '오늘 많이 힘드셨겠어요. 그 이야기를 나눠줘서 감사해요 💙',
      '그 상황에서는 누구나 지칠 수 있어요. 오늘 하루 수고했어요 ✨',
      '흥미롭네요! 그때 어떤 감정이 제일 컸나요?',
      '맞아요, 작은 것들이 쌓이면 생각보다 무거워지죠. 잘 알아차렸어요 🌿',
    ];
    const aiMsg: Message = {
      id: Date.now() + 1,
      role: 'ai',
      text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      timestamp: new Date(),
    };
    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  };

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
            id="diary-modal-close-btn"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors text-lg cursor-pointer border-none"
          >
            ×
          </button>
        </div>

        {/* 채팅 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 no-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* AI 아바타 */}
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

          {/* AI 타이핑 인디케이터 */}
          {isTyping && (
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

        {/* 입력 창 */}
        <div className="px-4 pb-6 pt-3 border-t border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 shadow-inner rounded-2xl px-4 py-2.5">
            <input
              ref={inputRef}
              id="diary-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="마음을 자유롭게 적어보세요..."
              className="flex-1 bg-transparent text-slate-800 text-[14px] outline-none placeholder:text-slate-400 font-sans"
            />
            <button
              id="diary-send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className={[
                'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer border-none text-base',
                input.trim() && !isTyping
                  ? 'bg-gradient-to-br from-brand-orange to-brand-orange-dark text-white shadow-[0_4px_12px_rgba(255,107,0,0.3)]'
                  : 'bg-slate-100 text-slate-400',
              ].join(' ')}
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryModal;
