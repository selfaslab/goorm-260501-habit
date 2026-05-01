"use client";

import { FormEvent, useMemo, useState } from "react";
import { HabitComposer } from "@/components/habits/HabitComposer";
import { MonthlyHeatmap } from "@/components/habits/MonthlyHeatmap";
import { StatsSummary } from "@/components/habits/StatsSummary";
import { TodayHabitList } from "@/components/habits/TodayHabitList";
import {
  getHabitStreak,
  getMonthlyHeatmap,
  getTodayKey,
  getTodayStats,
  getWeeklyStats,
  toggleCompletion,
} from "@/lib/habitStats";
import { Habit, loadStorageData, STORAGE_KEY, toStoragePayload } from "@/lib/habitTypes";

export default function Home() {
  const initialData = useMemo(() => loadStorageData(), []);
  const [habits, setHabits] = useState<Habit[]>(initialData.habits);
  const [newHabitName, setNewHabitName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(initialData.isLoggedIn);
  const [userName, setUserName] = useState(initialData.userName);
  const [statusMessage, setStatusMessage] = useState(initialData.statusMessage);
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => getTodayKey(), []);

  const todayStats = useMemo(() => getTodayStats(habits, todayKey), [habits, todayKey]);
  const weeklyStats = useMemo(() => getWeeklyStats(habits, today), [habits, today]);
  const streakMap = useMemo(
    () =>
      Object.fromEntries(
        habits.map((habit) => [habit.id, getHabitStreak(habit, today)]),
      ),
    [habits, today],
  );
  const bestStreak = useMemo(
    () => Math.max(0, ...Object.values(streakMap).map((streak) => streak.best)),
    [streakMap],
  );
  const heatmapCells = useMemo(
    () => getMonthlyHeatmap(habits, today.getFullYear(), today.getMonth()),
    [habits, today],
  );

  const handleAddHabit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newHabitName.trim();
    if (!trimmed) {
      return;
    }

    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: trimmed,
        createdAt: todayKey,
        isActive: true,
        targetWeekdays: [0, 1, 2, 3, 4, 5, 6],
        completionLog: {},
      },
    ]);
    setNewHabitName("");
  };

  const handleToggleHabit = (habitId: number) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId ? toggleCompletion(habit, todayKey) : habit,
      ),
    );
  };

  const requestLoginIfNeeded = () => {
    if (isLoggedIn) {
      return userName;
    }

    const name = window.prompt("저장하려면 로그인 이름을 입력하세요");
    if (!name?.trim()) {
      setStatusMessage("저장을 취소했어요. 앱은 계속 바로 사용할 수 있습니다.");
      return "";
    }

    const trimmedName = name.trim();
    setUserName(trimmedName);
    setIsLoggedIn(true);
    return trimmedName;
  };

  const handleSave = () => {
    const loginName = requestLoginIfNeeded();
    if (!loginName) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStoragePayload(habits, loginName)));
      setStatusMessage("저장 완료! 다음에도 이어서 사용할 수 있어요.");
    } catch {
      setStatusMessage("저장에 실패했어요. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <h1 className="text-2xl font-bold">Habit RPG - 습관 추적기</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {statusMessage}
        </p>

        <StatsSummary
          todayRate={todayStats.rate}
          weeklyRate={weeklyStats.rate}
          bestStreak={bestStreak}
          totalHabits={habits.length}
        />

        <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold">습관 추가</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            TickTick처럼 오늘 루틴에 바로 포함되는 습관을 추가하세요.
          </p>
          <div className="mt-3">
            <HabitComposer
              value={newHabitName}
              onChange={setNewHabitName}
              onSubmit={handleAddHabit}
            />
          </div>
        </section>

        <TodayHabitList
          habits={habits}
          todayKey={todayKey}
          streakMap={streakMap}
          onToggleHabit={handleToggleHabit}
        />

        <MonthlyHeatmap
          monthLabel={`${today.getFullYear()}년 ${today.getMonth() + 1}월`}
          cells={heatmapCells}
        />

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {isLoggedIn
            ? `${userName}님 로그인 상태 (저장 가능)`
            : "비로그인 상태 (사용 가능 / 저장 시 로그인 필요)"}
        </p>

        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
        >
          저장하기 (저장 시 로그인 필요)
        </button>
      </main>
    </div>
  );
}
