import type { Post } from '../../../types';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-[20px] p-[18px] transition-colors duration-200 hover:border-brand-blue/30">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-[42px] h-[42px] flex items-center justify-center bg-white/[0.08] rounded-full text-xl flex-shrink-0">
          {post.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white mb-0.5">{post.user}</p>
          <span className="text-[11px] text-brand-blue font-medium">#{post.mission}</span>
        </div>
        <span className="text-[11px] text-white/35 flex-shrink-0">{post.time}</span>
      </div>

      {/* 내용 */}
      <p className="text-sm text-white/80 leading-relaxed mb-3.5">{post.content}</p>

      {/* 액션 */}
      <div className="flex gap-2">
        {[
          { id: `like-btn-${post.id}`,    label: `❤️ ${post.likes}` },
          { id: `comment-btn-${post.id}`, label: `💬 ${post.comments}` },
          { id: `share-btn-${post.id}`,   label: '🔗 공유' },
        ].map(({ id, label }) => (
          <button
            key={id}
            id={id}
            className={[
              'bg-white/[0.06] border border-white/10 rounded-full',
              'text-white/65 text-xs px-3 py-1.5',
              'cursor-pointer transition-all duration-200',
              'hover:bg-white/[0.12] hover:text-white',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostCard;
