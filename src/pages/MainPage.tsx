import type { StatItem, ActivityItem as ActivityItemType } from '../types';
import TodayCard from '../components/features/main/TodayCard';
import StatCard from '../components/features/main/StatCard';
import ActivityItem from '../components/features/main/ActivityItem';

// ─── 더미 데이터 (추후 API로 교체) ────────────────────────────
const STATS: StatItem[] = [
  { icon: '🎯', value: 12, label: '완료 미션', color: 'purple' },
  { icon: '🔥', value: 5,  label: '연속 달성', color: 'blue' },
  { icon: '👥', value: 24, label: '팔로워',    color: 'green' },
];

const ACTIVITIES: ActivityItemType[] = [
  { icon: '🏃', text: '아침 러닝 30분 완료', time: '2시간 전' },
  { icon: '📚', text: '독서 20페이지 완료',  time: '5시간 전' },
  { icon: '💧', text: '물 2L 마시기 완료',   time: '어제' },
];
// ──────────────────────────────────────────────────────────────

const MainPage = () => {
  return (
    <div className="min-h-screen bg-surface pb-20 text-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-5 pt-[52px] pb-5 bg-gradient-to-b from-brand-purple/[0.12] to-transparent">
        <div>
          <p className="text-[13px] text-white/55 mb-1">안녕하세요 👋</p>
          <h2 className="text-[22px] font-bold text-white">사용자님</h2>
        </div>
        <button
          id="notification-btn"
          className="w-[42px] h-[42px] flex items-center justify-center text-lg bg-white/[0.07] border border-white/10 rounded-full cursor-pointer transition-colors duration-200 hover:bg-white/[0.13]"
        >
          🔔
        </button>
      </header>

      {/* 오늘의 목표 */}
      <section className="px-5 mb-5">
        <TodayCard done={3} total={7} />
      </section>

      {/* 이번 주 현황 */}
      <section className="px-5 mb-5">
        <h3 className="text-base font-semibold text-white/85 mb-3.5">이번 주 현황</h3>
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </section>

      {/* 최근 활동 */}
      <section className="px-5">
        <h3 className="text-base font-semibold text-white/85 mb-3.5">최근 활동</h3>
        <div className="flex flex-col gap-2.5">
          {ACTIVITIES.map((item, i) => (
            <ActivityItem key={i} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainPage;
