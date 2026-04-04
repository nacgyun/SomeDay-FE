interface ProfileCardProps {
  name: string;
  email: string;
  avatar: string;
  onEdit?: () => void;
}

const ProfileCard = ({ name, email, avatar, onEdit }: ProfileCardProps) => {
  return (
    <div className="flex items-center gap-3.5 bg-white/[0.05] border border-white/10 rounded-[20px] p-5">
      {/* 아바타 */}
      <div className="w-[58px] h-[58px] flex items-center justify-center text-[28px] flex-shrink-0 rounded-full bg-gradient-to-br from-brand-orange/25 to-brand-orange-dark/15 border-2 border-brand-orange/40">
        {avatar}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[17px] font-bold text-white mb-1">{name}</h3>
        <p className="text-xs text-white/45">{email}</p>
      </div>

      {/* 편집 버튼 */}
      <button
        id="my-edit-profile-btn"
        onClick={onEdit}
        className="bg-brand-orange/15 border border-brand-orange/35 text-brand-orange text-xs font-semibold px-3.5 py-1.5 rounded-full cursor-pointer transition-all duration-200 hover:bg-brand-orange/25 flex-shrink-0"
      >
        계정 설정
      </button>
    </div>
  );
};

export default ProfileCard;
