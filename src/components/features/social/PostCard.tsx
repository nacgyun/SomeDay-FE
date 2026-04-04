import type { Post } from '../../../types';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="bg-white border border-slate-100 rounded-[24px] p-[18px] shadow-sm transition-all duration-200 hover:border-brand-blue/30 hover:shadow-md">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-[42px] h-[42px] flex items-center justify-center bg-slate-50 border border-slate-100 rounded-full text-xl flex-shrink-0 shadow-inner">
          {post.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 mb-0.5">{post.user}</p>
          <span className="text-[11px] text-brand-blue-dark font-bold">#{post.mission}</span>
        </div>
        <span className="text-[11px] text-slate-400 flex-shrink-0 font-medium">{post.time}</span>
      </div>

      {/* 내용 */}
      <p className="text-[14px] text-slate-600 leading-relaxed font-medium mb-3.5">{post.content}</p>

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
              'bg-slate-50 border border-slate-100 rounded-full',
              'text-slate-500 text-[11px] font-bold px-3.5 py-1.5',
              'cursor-pointer transition-all duration-200',
              'hover:bg-slate-100 hover:text-slate-800 hover:shadow-sm',
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
