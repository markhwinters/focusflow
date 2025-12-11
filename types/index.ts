export type SessionType = "FOCUS" | "BREAK";

export interface Session {
  id: string;
  userId: string;
  type: SessionType;
  duration: number;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  reflection?: Reflection;
}

export interface Reflection {
  id: string;
  sessionId: string;
  rating: number;
  notes: string | null;
  createdAt: Date;
}

export interface Settings {
  id: string;
  userId: string;
  defaultDuration: number;
  breakDuration: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  updatedAt: Date;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  timeRemaining: number;
  sessionType: SessionType;
  sessionId: string | null;
}

export interface ChartData {
  date: string;
  focus: number;
  break: number;
}

export interface WeeklyStats {
  totalSessions: number;
  totalFocusTime: number;
  totalBreakTime: number;
  averageSessionTime: number;
  completionRate: number;
}
