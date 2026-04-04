import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

interface MonthlySummary {
  analysisDate: string;
  stabilityScore: number;
  mentalState: string;
}

interface RecordDetail {
  content: string;
  emotion: string;
  stress: number;
}

const getEmotionByScore = (score: number): string => {
  if (score >= 90) return '✨';
  if (score >= 70) return '😊';
  if (score >= 50) return '🧘';
  if (score >= 30) return '🍃';
  return '😫';
};

const MyRecordsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 기본 설정: 오늘 날짜의 연/월
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedRecordDate, setSelectedRecordDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-indexed for display

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState<number>(year);

  // TanStack Query를 이용한 데이터 페칭 및 캐싱
  const { data: records = {}, isLoading, isFetching } = useQuery({
    queryKey: ['monthlySummaries', user?.id, year, month],
    queryFn: async () => {
      if (!user?.id) return {};
      const response = await api.get(`/api/mental-analyses/${user.id}/monthly-summaries`, {
        params: { year, month }
      });
      
      const mappedRecords: Record<string, RecordDetail> = {};
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((item: MonthlySummary) => {
          mappedRecords[item.analysisDate] = {
            content: item.mentalState,
            emotion: getEmotionByScore(item.stabilityScore),
            stress: item.stabilityScore
          };
        });
      }
      return mappedRecords;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5분 동안은 신선한 데이터로 간주 (캐시 활용)
    placeholderData: (prev) => prev, // 달 이동 시 이전 데이터를 잠시 유지해 깜빡임 방지
  });

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

  const selectedRecord = selectedRecordDate ? records[selectedRecordDate] : null;

  return (
    <div className="w-full max-w-[480px] mx-auto min-h-screen relative bg-[#F0ECE4] shadow-2xl shadow-black/20 text-slate-800 flex flex-col">
      <PageHeader
        title="나의 기록"
        gradientColor="orange"
        onBack={() => navigate('/my')}
      />

      <div className="px-5 py-6 mt-4 flex-1">
        {/* 달력 헤더 (연/월 조작) */}
        <div className="flex items-center justify-between mb-8 bg-white p-3 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
          <button onClick={handlePrevMonth} className="w-11 h-11 flex items-center justify-center text-slate-600 hover:text-brand-orange-dark bg-white hover:bg-slate-50 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer border border-slate-200 active:scale-90">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={openPicker}
            className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
          >
            <span className="text-[13px] text-slate-400 font-medium mb-0.5 group-hover:text-slate-600 transition-colors">{year}년</span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-orange-dark group-hover:from-brand-orange group-hover:to-brand-orange transition-colors flex items-center gap-1">
              {month}월 <span className="text-[10px] text-brand-orange mt-1">▼</span>
            </span>
          </button>

          <button onClick={handleNextMonth} className="w-11 h-11 flex items-center justify-center text-slate-600 hover:text-brand-orange-dark bg-white hover:bg-slate-50 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer border border-slate-200 active:scale-90">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* 요일 라벨 */}
        <div className="grid grid-cols-7 mb-4">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
            <div key={day} className={`text-center text-xs font-semibold ${idx === 0 ? 'text-brand-red/90' : idx === 6 ? 'text-brand-blue/90' : 'text-slate-400'}`}>
              {day}
            </div>
          ))}
        </div>

        {/* 달력 그리드 */}
        <div className={`grid grid-cols-7 gap-y-4 gap-x-2 transition-opacity duration-300 ${isLoading || isFetching ? 'opacity-50' : 'opacity-100'}`}>
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} />;
            }

            const formattedMonth = String(month).padStart(2, '0');
            const formattedDay = String(day).padStart(2, '0');
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
            const hasRecord = !!records[dateStr];

            return (
              <div key={dateStr} className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => hasRecord && setSelectedRecordDate(dateStr)}
                  disabled={!hasRecord}
                  style={hasRecord ? { backgroundColor: '#A67C52' } : {}}
                  className={[
                    'w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300',
                    hasRecord
                      ? 'text-white shadow-[0_4px_10px_rgba(166,124,82,0.3)] cursor-pointer hover:scale-110 active:scale-95'
                      : 'bg-white/40 text-slate-300 cursor-default border border-slate-100/50'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[4px] px-5 py-10 transition-all overflow-hidden">
          <div className="bg-white border border-slate-100 rounded-[32px] w-full max-w-[340px] max-h-full shadow-2xl flex flex-col animate-fade-in-up relative overflow-hidden">

            {/* 상단 닫기 아이콘 버튼 */}
            <button
              onClick={() => setSelectedRecordDate(null)}
              className="absolute top-5 right-5 z-20 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-colors cursor-pointer bg-white/50 backdrop-blur-sm rounded-full"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* 스크롤 가능한 본문 영역 */}
            <div className="flex-1 overflow-y-auto p-7 pt-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 shadow-sm rounded-full flex items-center justify-center text-4xl mb-5 border border-slate-100 flex-shrink-0">
                {selectedRecord.emotion}
              </div>

              <h3 className="text-[15px] font-bold text-brand-orange-dark mb-1">
                {selectedRecordDate}
              </h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">안정도 지수: <span className="text-brand-orange font-bold">{selectedRecord.stress}</span></p>

              <div className="w-full bg-slate-50/80 rounded-2xl p-5 border border-slate-100 relative overflow-hidden shadow-inner">
                <div className="absolute top-2 left-3 text-4xl text-slate-200/60 font-serif pointer-events-none">"</div>
                <p className="text-sm text-slate-700 leading-relaxed relative z-10 text-center font-semibold">
                  {selectedRecord.content}
                </p>
              </div>
            </div>

            {/* 하단 버튼 영역 */}
            <div className="p-7 pt-0 flex-shrink-0">
              <button
                onClick={() => setSelectedRecordDate(null)}
                style={{ backgroundColor: '#B6754C' }}
                className="w-full py-4 text-white font-bold text-lg rounded-2xl transition-all active:scale-95 border-none cursor-pointer"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 날짜 선택 모달 (Picker) */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] px-5">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-[320px] p-6 shadow-2xl flex flex-col gap-4 animate-fade-in-up">

            {/* 연도 조작 */}
            <div className="flex items-center justify-between px-2 mb-2">
              <button onClick={() => setPickerYear(y => y - 1)} className="p-2 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <span className="text-xl font-bold text-slate-800">{pickerYear}년</span>
              <button onClick={() => setPickerYear(y => y + 1)} className="p-2 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>

            {/* 월 그리드 */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
                const isSelected = pickerYear === year && m === month;
                return (
                  <button
                    key={m}
                    onClick={() => selectMonth(m)}
                    className={[
                      'py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer border',
                      isSelected
                        ? 'bg-gradient-to-br from-brand-orange to-brand-orange-dark shadow-md text-white border-brand-orange'
                        : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:scale-105 hover:shadow-sm'
                    ].join(' ')}
                  >
                    {m}월
                  </button>
                );
              })}
            </div>

            <Button variant="ghost" fullWidth onClick={() => setIsPickerOpen(false)} className="border border-slate-200 mt-2 text-slate-600 hover:bg-slate-50 hover:text-slate-800">
              닫기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecordsPage;
