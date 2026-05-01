"use client";

import { HeatmapCell } from "@/lib/habitStats";

type MonthlyHeatmapProps = {
  monthLabel: string;
  cells: HeatmapCell[];
};

function intensityClass(intensity: HeatmapCell["intensity"]): string {
  switch (intensity) {
    case 1:
      return "bg-emerald-200 dark:bg-emerald-900";
    case 2:
      return "bg-emerald-300 dark:bg-emerald-700";
    case 3:
      return "bg-emerald-500 dark:bg-emerald-600";
    case 4:
      return "bg-emerald-700 dark:bg-emerald-400";
    default:
      return "bg-zinc-100 dark:bg-zinc-800";
  }
}

export function MonthlyHeatmap({ monthLabel, cells }: MonthlyHeatmapProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{monthLabel} 히트맵</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">진할수록 달성률이 높아요</p>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-2">
        {cells.map((cell) => (
          <div
            key={cell.dateKey}
            title={`${cell.dateKey} (${cell.completed}/${cell.scheduled})`}
            className={`flex h-10 items-center justify-center rounded-md text-xs ${intensityClass(cell.intensity)}`}
          >
            {cell.label}
          </div>
        ))}
      </div>
    </section>
  );
}
