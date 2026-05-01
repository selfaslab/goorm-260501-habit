"use client";

import { HabitCard } from "./HabitCard";
import { Habit, HabitStreak } from "@/lib/habitTypes";
import { isCompleted, isScheduled } from "@/lib/habitStats";

type TodayHabitListProps = {
  habits: Habit[];
  todayKey: string;
  streakMap: Record<number, HabitStreak>;
  onToggleHabit: (habitId: number) => void;
};

export function TodayHabitList({
  habits,
  todayKey,
  streakMap,
  onToggleHabit,
}: TodayHabitListProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold">오늘 습관</h2>
      <ul className="mt-3 space-y-2">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            isTodayDone={isCompleted(habit, todayKey)}
            isScheduledToday={isScheduled(habit, todayKey)}
            streak={streakMap[habit.id] ?? { current: 0, best: 0 }}
            onToggle={onToggleHabit}
          />
        ))}
      </ul>
    </section>
  );
}
