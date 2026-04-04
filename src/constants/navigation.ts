import type { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'nav-main', path: '/main', icon: 'home', label: '홈' },
  { id: 'nav-social', path: '/social', icon: 'social', label: '소셜' },
  { id: 'nav-mission', path: '/mission', icon: 'mission', label: '미션' },
  { id: 'nav-my', path: '/my', icon: 'my', label: '마이' },
];

export const MISSION_CATEGORIES = ['전체', '운동', '자기계발', '건강', '마음챙김', '루틴'] as const;
