import { useNavigate } from 'react-router-dom';
import type { MenuItemType } from '../types';
import PageHeader from '../components/layout/PageHeader';
import ProfileCard from '../components/features/my/ProfileCard';
import WeekStress from '../components/features/my/WeekStress';
import MyStats from '../components/features/my/MyStats';
import MenuItem from '../components/features/my/MenuItem';
import Button from '../components/ui/Button';

// ─── 더미 데이터 ──────────────────────────────────────────────
const MENU_ITEMS: MenuItemType[] = [
  { id: 'history', icon: '📊', label: '활동 기록' },
  { id: 'inquiry', icon: '💬', label: '문의하기' },
  { id: 'terms', icon: '📄', label: '이용약관' },
];

const WEEKLY_STRESS_DATA = [
  { day: '월', level: 65 },
  { day: '화', level: 82 },
  { day: '수', level: 45 },
  { day: '목', level: 30 },
  { day: '금', level: 90 },
  { day: '토', level: 25 },
  { day: '일', level: 55 },
];
// ──────────────────────────────────────────────────────────────

const MyPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: 실제 로그아웃 로직
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface pb-20 text-white">
      <PageHeader title="마이페이지" gradientColor="orange" />

      {/* 프로필 카드 */}
      <section className="px-5 mb-4">
        <ProfileCard
          name="사용자님"
          email="user@someday.app"
          avatar="😊"
        />
      </section>

      {/* 주간 스트레스 변화 카드 */}
      <section className="px-5 mb-4">
        <WeekStress data={WEEKLY_STRESS_DATA} />
      </section>

      {/* 4가지 요약 통계 */}
      <section className="px-5 mb-4">
        <MyStats
          consecutiveDays={12}
          towerFloors={34}
          receivedCheers={5}
          sentConsoles={8}
        />
      </section>

      {/* 메뉴 리스트 */}
      <section className="px-5 mb-4">
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-[20px] overflow-hidden">
          {MENU_ITEMS.map((item, i) => (
            <MenuItem
              key={item.id}
              item={item}
              isLast={i === MENU_ITEMS.length - 1}
            />
          ))}
        </div>
      </section>

      {/* 로그아웃 */}
      <section className="px-5">
        <Button id="logout-btn" variant="danger" fullWidth onClick={handleLogout}>
          로그아웃
        </Button>
      </section>
    </div>
  );
};

export default MyPage;
