"use client";

import { FormEvent } from "react";

type HabitComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function HabitComposer({ value, onChange, onSubmit }: HabitComposerProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        className="flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
        placeholder="새 습관 입력"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="submit"
        className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        추가
      </button>
    </form>
  );
}
