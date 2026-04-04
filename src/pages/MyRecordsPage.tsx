import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';

// 더미 데이터: 날짜별 기록
const MOCK_RECORDS: Record<string, { content: string; emotion: string; stress: number }> = {
  '2026-04-01': { content: '오늘은 새 프로젝트를 시작했다. 설레지만 조금 긴장된다.', emotion: '😊', stress: 30 },
  '2026-04-03': { content: '비가 와서 달리기 대신 집에서 명상을 했다.', emotion: '🧘', stress: 20 },
  '2026-04-06': { content: '업무가 너무 많아서 야근을 했다. 피곤한 하루...', emotion: '😫', stress: 85 },
  '2026-04-10': { content: '친구들과 주말 약속을 잡았다. 기대된다!', emotion: '🎉', stress: 15 },
  '2026-04-15': { content: '생각보다 일이 잘 안 풀려서 답답했다. 조금 쉬어가야지.', emotion: '🌧️', stress: 70 },
  '2026-04-22': { content: '컨디션이 아주 좋은 날. 집중이 잘 돼서 목표치를 다 채웠다.', emotion: '✨', stress: 10 },
  '2026-04-28': { content: '가벼운 산책을 하며 생각을 정리했다. 한결 낫다.', emotion: '🍃', stress: 45 },
};

const MyRecordsPage = () => {
  const navigate = useNavigate();
  // 기본 설정: 2026년 4월
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // month is 0-indexed
  const [selectedRecordDate, setSelectedRecordDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-indexed for display

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(year);

  const openPicker = () => {
    setPickerYear(year);
    setIsPickerOpen(true);
  };

  const selectMonth = (m: number) => {
    setCurrentDate(new Date(pickerYear, m - 1, 1));
    setIsPickerOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  // 월의 첫 날의 요일 (0: 일, 1: 월, ... 6: 토)
  const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();
  // 월의 마지막 날짜 (28, 29, 30, 31)
  const daysInMonth = new Date(year, month, 0).getDate();

  const days = [];
  // 빈 칸 채우기
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // 날짜 채우기
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const selectedRecord = selectedRecordDate ? MOCK_RECORDS[selectedRecordDate] : null;

  return (
    <div className="w-full max-w-[480px] mx-auto min-h-screen relative bg-[#060610] shadow-2xl shadow-black/50 text-white flex flex-col">
      <PageHeader
        title="나의 기록"
        gradientColor="orange"
        onBack={() => navigate('/my')}
      />

      <div className="px-5 py-6 mt-4 flex-1">
        {/* 달력 헤더 (연/월 조작) */}
        <div className="flex items-center justify-between mb-8 bg-white/[0.04] p-3 rounded-2xl border border-white/[0.08]">
          <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button 
            onClick={openPicker}
            className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
          >
            <span className="text-[13px] text-white/60 font-medium mb-0.5 group-hover:text-white/80 transition-colors">{year}년</span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-orange/70 group-hover:from-brand-orange group-hover:to-brand-orange transition-colors flex items-center gap-1">
              {month}월 <span className="text-[10px] text-brand-orange mt-1">▼</span>
            </span>
          </button>

          <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* 요일 라벨 */}
        <div className="grid grid-cols-7 mb-4">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
            <div key={day} className={`text-center text-xs font-semibold ${idx === 0 ? 'text-brand-red/80' : idx === 6 ? 'text-brand-blue/80' : 'text-white/40'}`}>
              {day}
            </div>
          ))}
        </div>

        {/* 달력 그리드 */}
        <div className="grid grid-cols-7 gap-y-4 gap-x-2">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} />;
            }

            const formattedMonth = String(month).padStart(2, '0');
            const formattedDay = String(day).padStart(2, '0');
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
            const hasRecord = !!MOCK_RECORDS[dateStr];

            return (
              <div key={dateStr} className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => hasRecord && setSelectedRecordDate(dateStr)}
                  disabled={!hasRecord}
                  className={[
                    'w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all duration-300',
                    hasRecord
                      ? 'bg-gradient-to-br from-brand-orange/30 to-brand-orange/10 border border-brand-orange/50 text-white cursor-pointer hover:bg-brand-orange/40 hover:scale-105 hover:shadow-[0_0_12px_rgba(255,107,0,0.3)]'
                      : 'bg-transparent text-white/30 cursor-default'
                  ].join(' ')}
                >
                  {day}
                </button>
                {hasRecord && <div className="w-1.5 h-1.5 rounded-full bg-brand-orange shadow-[0_0_5px_rgba(255,107,0,0.8)]" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* 기록 상세 모달 */}
      {selectedRecordDate && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-5">
          <div className="bg-surface-secondary border border-white/10 rounded-3xl w-full max-w-[340px] p-6 shadow-2xl flex flex-col items-center animate-fade-in-up">
            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-3xl mb-4 border border-white/10">
              {selectedRecord.emotion}
            </div>

            <h3 className="text-sm font-bold text-brand-orange mb-1">
              {selectedRecordDate}
            </h3>
            <p className="text-xs text-white/50 mb-5">스트레스 지수: {selectedRecord.stress}</p>

            <div className="w-full bg-black/20 rounded-2xl p-4 mb-6 border border-white/[0.05] relative overflow-hidden">
              {/* 장식용 따옴표 */}
              <div className="absolute top-2 left-3 text-4xl text-white/5 font-serif pointer-events-none">"</div>
              <p className="text-sm text-white/90 leading-relaxed relative z-10 text-center">
                {selectedRecord.content}
              </p>
            </div>

            <Button variant="ghost" fullWidth onClick={() => setSelectedRecordDate(null)} className="!py-3 border border-white/10 hover:bg-white/5">
              닫기
            </Button>
          </div>
        </div>
      )}

      {/* 날짜 선택 모달 (Picker) */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-5">
          <div className="bg-surface-secondary border border-white/10 rounded-3xl w-full max-w-[320px] p-6 shadow-2xl flex flex-col gap-4 animate-fade-in-up">
            
            {/* 연도 조작 */}
            <div className="flex items-center justify-between px-2 mb-2">
              <button onClick={() => setPickerYear(y => y - 1)} className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <span className="text-xl font-bold text-white">{pickerYear}년</span>
              <button onClick={() => setPickerYear(y => y + 1)} className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>

            {/* 월 그리드 */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {Array.from({length: 12}, (_, i) => i + 1).map(m => {
                const isSelected = pickerYear === year && m === month;
                return (
                  <button
                    key={m}
                    onClick={() => selectMonth(m)}
                    className={[
                      'py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer',
                      isSelected
                        ? 'bg-gradient-to-br from-brand-orange to-brand-orange-dark shadow-[0_4px_12px_rgba(255,107,0,0.3)] text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:scale-105'
                    ].join(' ')}
                  >
                    {m}월
                  </button>
                );
              })}
            </div>
            
            <Button variant="ghost" fullWidth onClick={() => setIsPickerOpen(false)} className="border border-white/10 mt-2">
              닫기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecordsPage;
