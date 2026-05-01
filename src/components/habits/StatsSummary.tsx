"use client";

type StatCardProps = {
  title: string;
  value: string;
  helper: string;
};

function StatCard({ title, value, helper }: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{helper}</p>
    </div>
  );
}

type StatsSummaryProps = {
  todayRate: number;
  weeklyRate: number;
  bestStreak: number;
  totalHabits: number;
};

export function StatsSummary({
  todayRate,
  weeklyRate,
  bestStreak,
  totalHabits,
}: StatsSummaryProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="오늘 달성률"
        value={`${todayRate}%`}
        helper="오늘 예정 습관 기준"
      />
      <StatCard
        title="7일 달성률"
        value={`${weeklyRate}%`}
        helper="최근 7일 예정 습관 기준"
      />
      <StatCard
        title="최고 연속일"
        value={`${bestStreak}일`}
        helper="현재 전체 습관 중 최고 streak"
      />
      <StatCard
        title="활성 습관"
        value={`${totalHabits}개`}
        helper="현재 추적 중인 습관 수"
      />
    </section>
  );
}
