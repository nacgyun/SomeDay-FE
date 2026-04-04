interface IconProps {
    color?: string;
    className?: string;
}
export const JengaIcon = ({ color = "#B6754C", className = "w-6 h-6" }: IconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* Layer 3 (Top) - 3 horizontal blocks */}
        <rect x="3" y="3" width="18" height="4" rx="1" fill={color} fillOpacity="0.9" />
        <line x1="9" y1="3" x2="9" y2="7" stroke="white" strokeOpacity="0.2" strokeWidth="0.5" />
        <line x1="15" y1="3" x2="15" y2="7" stroke="white" strokeOpacity="0.2" strokeWidth="0.5" />

        {/* Layer 2 (Middle) - 3 block ends (showing vertical orientation) */}
        <rect x="3" y="8" width="5" height="4" rx="1" fill={color} fillOpacity="1" />
        <rect x="9.5" y="8" width="5" height="4" rx="1" fill={color} fillOpacity="1" />
        <rect x="16" y="8" width="5" height="4" rx="1" fill={color} fillOpacity="1" />

        {/* Layer 1 (Bottom) - 3 horizontal blocks */}
        <rect x="3" y="13" width="18" height="4" rx="1" fill={color} fillOpacity="0.8" />
        <line x1="9" y1="13" x2="9" y2="17" stroke="black" strokeOpacity="0.1" strokeWidth="0.5" />
        <line x1="15" y1="13" x2="15" y2="17" stroke="black" strokeOpacity="0.1" strokeWidth="0.5" />

        {/* Support Base (Shadow/Ground) */}
        <path d="M4 19H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
    </svg>
);