import type { Post } from '../types';
import PageHeader from '../components/layout/PageHeader';
import FriendChip from '../components/features/social/FriendChip';
import PostCard from '../components/features/social/PostCard';
import Button from '../components/ui/Button';

// ─── 더미 데이터 ──────────────────────────────────────────────
const FRIENDS = [
  { avatar: '🧑', name: '유저1' },
  { avatar: '👩', name: '유저2' },
  { avatar: '👦', name: '유저3' },
  { avatar: '👧', name: '유저4' },
  { avatar: '🧔', name: '유저5' },
];

const POSTS: Post[] = [
  { id: 1, user: '김민지', avatar: '😊', mission: '아침 러닝 5km',  content: '오늘도 성공! 비 오는 날도 포기 안 했어요 💪', likes: 24, comments: 8,  time: '10분 전' },
  { id: 2, user: '이준호', avatar: '🧑', mission: '하루 독서 30분', content: '원자 습관 다 읽었습니다. 강추해요!',            likes: 41, comments: 12, time: '1시간 전' },
  { id: 3, user: '박서연', avatar: '👩', mission: '물 2L 마시기',   content: '드디어 한 달 연속 달성 🎉🎉🎉',               likes: 88, comments: 21, time: '3시간 전' },
];
// ──────────────────────────────────────────────────────────────

const SocialPage = () => {
  return (
    <div className="min-h-screen bg-surface pb-20 text-white">
      <PageHeader
        title="소셜"
        gradientColor="blue"
        action={
          <Button id="social-add-post-btn" variant="green" className="text-[13px] !py-2 !px-4 !rounded-full">
            + 공유하기
          </Button>
        }
      />

      {/* 추천 친구 */}
      <section className="px-5 mb-5">
        <h3 className="text-base font-semibold text-white/85 mb-3">추천 친구</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {FRIENDS.map((f, i) => (
            <FriendChip key={i} avatar={f.avatar} name={f.name} />
          ))}
        </div>
      </section>

      {/* 피드 */}
      <section className="px-5">
        <h3 className="text-base font-semibold text-white/85 mb-3">피드</h3>
        <div className="flex flex-col gap-3">
          {POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SocialPage;
