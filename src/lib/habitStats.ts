"use client";

import { Habit, HabitStreak } from "./habitTypes";

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function getTodayKey(): string {
  return toDateKey(new Date());
}

export function isScheduled(habit: Habit, dateKey: string): boolean {
  const day = fromDateKey(dateKey).getDay();
  return habit.isActive && habit.targetWeekdays.includes(day as 0 | 1 | 2 | 3 | 4 | 5 | 6);
}

export function isCompleted(habit: Habit, dateKey: string): boolean {
  return Boolean(habit.completionLog[dateKey]);
}

export function getTodayStats(habits: Habit[], todayKey: string): {
  scheduled: number;
  completed: number;
  rate: number;
} {
  let scheduled = 0;
  let completed = 0;

  for (const habit of habits) {
    if (!isScheduled(habit, todayKey)) {
      continue;
    }
    scheduled += 1;
    if (isCompleted(habit, todayKey)) {
      completed += 1;
    }
  }

  return {
    scheduled,
    completed,
    rate: scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0,
  };
}

export function getWeeklyStats(habits: Habit[], today: Date): {
  scheduled: number;
  completed: number;
  rate: number;
} {
  let scheduled = 0;
  let completed = 0;

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = toDateKey(date);

    for (const habit of habits) {
      if (!isScheduled(habit, key)) {
        continue;
      }
      scheduled += 1;
      if (isCompleted(habit, key)) {
        completed += 1;
      }
    }
  }

  return {
    scheduled,
    completed,
    rate: scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0,
  };
}

export function getHabitStreak(habit: Habit, today: Date): HabitStreak {
  let current = 0;
  let best = 0;
  let running = 0;
  const createdAt = fromDateKey(habit.createdAt);

  for (let i = 0; i < 365; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    if (date < createdAt) {
      break;
    }
    const key = toDateKey(date);
    if (!isScheduled(habit, key)) {
      continue;
    }

    if (isCompleted(habit, key)) {
      running += 1;
      if (i === current || current === 0) {
        current = running;
      }
      best = Math.max(best, running);
    } else {
      if (current === 0) {
        current = running;
      }
      running = 0;
    }
  }

  if (best === 0 && running > 0) {
    best = running;
  }

  return { current, best };
}

export type HeatmapCell = {
  dateKey: string;
  label: string;
  intensity: 0 | 1 | 2 | 3 | 4;
  completed: number;
  scheduled: number;
};

export function getMonthlyHeatmap(habits: Habit[], year: number, monthIndex: number): HeatmapCell[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: HeatmapCell[] = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = toDateKey(new Date(year, monthIndex, day));
    let scheduled = 0;
    let completed = 0;

    for (const habit of habits) {
      if (!isScheduled(habit, key)) {
        continue;
      }
      scheduled += 1;
      if (isCompleted(habit, key)) {
        completed += 1;
      }
    }

    const ratio = scheduled > 0 ? completed / scheduled : 0;
    let intensity: 0 | 1 | 2 | 3 | 4 = 0;
    if (ratio > 0) intensity = 1;
    if (ratio >= 0.4) intensity = 2;
    if (ratio >= 0.7) intensity = 3;
    if (ratio === 1) intensity = 4;

    cells.push({
      dateKey: key,
      label: String(day),
      intensity,
      completed,
      scheduled,
    });
  }

  return cells;
}

export function toggleCompletion(habit: Habit, dateKey: string): Habit {
  const nextLog = { ...habit.completionLog };
  if (nextLog[dateKey]) {
    delete nextLog[dateKey];
  } else {
    nextLog[dateKey] = true;
  }
  return { ...habit, completionLog: nextLog };
}
