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
  dayOffset?: number; // 0 = 6 days ago, ..., 6 = today
  createdAt?: string; // 생성 시간
  completed?: boolean; // 서버 완료 여부
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

export interface UserProfile {
  id: number;
  userId: number;
  avatarEmoji: string;
  consecutiveDays: number;
  totalLayers: number;
  cheersSent: number;
  cheersReceived: number;
  createdAt: string;
}
