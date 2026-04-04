interface FriendChipProps {
  avatar: string;
  name: string;
}

const FriendChip = ({ avatar, name }: FriendChipProps) => {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer">
      <div
        className={[
          'w-[54px] h-[54px] flex items-center justify-center',
          'bg-white border-2 border-slate-100 rounded-full text-2xl shadow-sm',
          'transition-all duration-200 hover:border-brand-blue/50 hover:bg-slate-50',
        ].join(' ')}
      >
        {avatar}
      </div>
      <span className="text-[11px] font-bold text-slate-500">{name}</span>
    </div>
  );
};

export default FriendChip;
