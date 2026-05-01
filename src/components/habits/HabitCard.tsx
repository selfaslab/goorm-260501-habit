"use client";

import { Habit, HabitStreak } from "@/lib/habitTypes";

type HabitCardProps = {
  habit: Habit;
  isTodayDone: boolean;
  isScheduledToday: boolean;
  streak: HabitStreak;
  onToggle: (habitId: number) => void;
};

export function HabitCard({
  habit,
  isTodayDone,
  isScheduledToday,
  streak,
  onToggle,
}: HabitCardProps) {
  return (
    <li className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
      <div className="flex items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isTodayDone}
            disabled={!isScheduledToday}
            onChange={() => onToggle(habit.id)}
          />
          <span className={isTodayDone ? "line-through opacity-60" : ""}>{habit.name}</span>
        </label>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          연속 {streak.current}일 / 최고 {streak.best}일
        </span>
      </div>
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        {isScheduledToday ? "오늘 체크 대상" : "오늘은 휴식일"}
      </p>
    </li>
  );
}
