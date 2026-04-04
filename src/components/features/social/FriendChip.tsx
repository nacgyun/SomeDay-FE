interface FriendChipProps {
  avatar: string;
  name: string;
}

const FriendChip = ({ avatar, name }: FriendChipProps) => {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer">
      <div
        className={[
          'w-[52px] h-[52px] flex items-center justify-center',
          'bg-white/[0.08] border-2 border-brand-blue/40 rounded-full text-2xl',
          'transition-all duration-200 hover:border-brand-blue hover:bg-brand-blue/15',
        ].join(' ')}
      >
        {avatar}
      </div>
      <span className="text-[11px] text-white/50">{name}</span>
    </div>
  );
};

export default FriendChip;
