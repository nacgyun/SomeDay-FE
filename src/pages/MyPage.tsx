import { useNavigate } from 'react-router-dom';
import type { MenuItemType } from '../types';
import PageHeader from '../components/layout/PageHeader';
import ProfileCard from '../components/features/my/ProfileCard';
import LevelCard from '../components/features/my/LevelCard';
import MenuItem from '../components/features/my/MenuItem';
import Button from '../components/ui/Button';

// ─── 더미 데이터 ──────────────────────────────────────────────
const MENU_ITEMS: MenuItemType[] = [
  { id: 'account', icon: '🔐', label: '계정 설정' },
  { id: 'alarm',   icon: '🔔', label: '알림 설정' },
  { id: 'badge',   icon: '🏅', label: '획득한 배지' },
  { id: 'history', icon: '📊', label: '활동 기록' },
  { id: 'inquiry', icon: '💬', label: '문의하기' },
  { id: 'terms',   icon: '📄', label: '이용약관' },
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

      {/* 레벨 / 포인트 카드 */}
      <section className="px-5 mb-4">
        <LevelCard level={5} currentPoint={650} maxPoint={1000} totalPoint={2340} />
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
