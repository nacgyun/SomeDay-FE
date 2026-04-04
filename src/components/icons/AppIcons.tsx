import type { FC } from 'react';

interface IconProps {
  color?: string;
  className?: string;
}

export const HomeIcon: FC<IconProps> = ({ color = "currentColor", className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 3L4 9V20C4 20.5523 4.44772 21 5 21H10V14H14V21H19C19.5523 21 20 20.5523 20 20V9L12 3Z" fill={color}/>
  </svg>
);

export const UsersIcon: FC<IconProps> = ({ color = "currentColor", className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 11C18.2091 11 20 9.20914 20 7C20 4.79086 18.2091 3 16 3C13.7909 3 12 4.79086 12 7C12 9.20914 13.7909 11 16 11Z" fill={color}/>
    <path d="M16 13C12.6667 13 6 14.6667 6 18V21H26V18C26 14.6667 19.3333 13 16 13Z" fill={color}/>
    <path d="M8 11C10.2091 11 12 9.20914 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11Z" fill={color} fillOpacity="0.6"/>
    <path d="M8 13C4.66667 13 -2 14.6667 -2 18V21H4V18.1C4 16.5 6.4 14.5 8 13.5" fill={color} fillOpacity="0.6"/>
  </svg>
);

export const TargetIcon: FC<IconProps> = ({ color = "currentColor", className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.5"/>
    <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2.5"/>
    <circle cx="12" cy="12" r="1.5" fill={color}/>
  </svg>
);

export const UserIcon: FC<IconProps> = ({ color = "currentColor", className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill={color}/>
    <path d="M6 19C6 16.2386 8.23858 14 11 14H13C15.7614 14 18 16.2386 18 19V21H6V19Z" fill={color}/>
  </svg>
);

export const FlameIcon: FC<IconProps> = ({ color = "currentColor", className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M17.5 13C17.5 16.0376 15.0376 18.5 12 18.5C8.96243 18.5 6.5 16.0376 6.5 13C6.5 10.5186 8.35821 7.22176 12 5C11 7 11 10.5 12.5 11C14.5 11.5 17.5 8 17.5 13Z" fill={color}/>
    <path d="M16 11C16 13.2091 14.2091 15 12 15C9.79086 15 8 13.2091 8 11C8 9.34315 9 6.5 12 5C11.5 6.5 11.5 9 12.5 10C13.5 11 16 8.5 16 11Z" fill={color} fillOpacity="0.4"/>
  </svg>
);

export const HeartIcon: FC<IconProps> = ({ color = "currentColor", className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill={color}/>
  </svg>
);

export const MailIcon: FC<IconProps> = ({ color = "currentColor", className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill={color}/>
  </svg>
);

export const HistoryIcon: FC<IconProps> = ({ color = "currentColor", className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 3v5h5" />
    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
    <path d="M12 7v5l3 3" />
  </svg>
);

export const MessageCircleIcon: FC<IconProps> = ({ color = "currentColor", className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const FileTextIcon: FC<IconProps> = ({ color = "currentColor", className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
