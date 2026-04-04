// ─── 공통 타입 정의 ───────────────────────────────────────────

export interface Post {
  id: number;
  user: string;
  avatar: string;
  mission: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
}

export interface Mission {
  id: number;
  icon: string;
  title: string;
  category: string;
  done: boolean;
  point: number;
}

export interface StatItem {
  icon: string;
  value: number;
  label: string;
  color: 'purple' | 'blue' | 'green';
}

export interface ActivityItem {
  icon: string;
  text: string;
  time: string;
}

export interface MenuItemType {
  id: string;
  icon: string;
  label: string;
}

export interface NavItem {
  id: string;
  path: string;
  icon: string;
  label: string;
}

export type MissionCategory = '전체' | '운동' | '자기계발' | '건강' | '마음챙김' | '루틴';

export interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
  gender: string;
  age: number;
  badTime: string | null;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
