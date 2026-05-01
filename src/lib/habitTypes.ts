"use client";

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Habit = {
  id: number;
  name: string;
  createdAt: string;
  isActive: boolean;
  targetWeekdays: Weekday[];
  completionLog: Record<string, boolean>;
};

export type HabitStreak = {
  current: number;
  best: number;
};

export type StorageSchemaV2 = {
  version: 2;
  userName: string;
  habits: Habit[];
};

type LegacyHabit = {
  id: number;
  name: string;
  done: boolean;
};

type LegacyStorage = {
  userName?: string;
  habits?: LegacyHabit[];
};

function isStorageV2(data: unknown): data is StorageSchemaV2 {
  if (!data || typeof data !== "object") {
    return false;
  }
  const candidate = data as Partial<StorageSchemaV2>;
  return candidate.version === STORAGE_VERSION && Array.isArray(candidate.habits);
}

const DEFAULT_WEEKDAYS: Weekday[] = [1, 2, 3, 4, 5];

export const STORAGE_KEY = "habit-rpg.saved-data";
export const STORAGE_VERSION = 2;
export const DEFAULT_STATUS =
  "로그인 없이 바로 사용 가능해요. 저장할 때만 로그인하면 됩니다.";

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 1,
    name: "물 2L 마시기",
    createdAt: "2026-05-01",
    isActive: true,
    targetWeekdays: [0, 1, 2, 3, 4, 5, 6],
    completionLog: {},
  },
  {
    id: 2,
    name: "30분 운동",
    createdAt: "2026-05-01",
    isActive: true,
    targetWeekdays: DEFAULT_WEEKDAYS,
    completionLog: {},
  },
];

function normalizeHabit(partial: Partial<Habit> & { id: number; name: string }): Habit {
  return {
    id: partial.id,
    name: partial.name,
    createdAt: partial.createdAt ?? new Date().toISOString().slice(0, 10),
    isActive: partial.isActive ?? true,
    targetWeekdays:
      partial.targetWeekdays && partial.targetWeekdays.length > 0
        ? partial.targetWeekdays
        : DEFAULT_WEEKDAYS,
    completionLog: partial.completionLog ?? {},
  };
}

function migrateLegacyHabits(legacyHabits: LegacyHabit[] | undefined): Habit[] {
  if (!legacyHabits || legacyHabits.length === 0) {
    return DEFAULT_HABITS;
  }

  return legacyHabits.map((item) =>
    normalizeHabit({
      id: item.id,
      name: item.name,
      completionLog: item.done ? { [new Date().toISOString().slice(0, 10)]: true } : {},
      targetWeekdays: DEFAULT_WEEKDAYS,
    }),
  );
}

export function loadStorageData(): {
  habits: Habit[];
  isLoggedIn: boolean;
  userName: string;
  statusMessage: string;
} {
  if (typeof window === "undefined") {
    return {
      habits: DEFAULT_HABITS,
      isLoggedIn: false,
      userName: "",
      statusMessage: DEFAULT_STATUS,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        habits: DEFAULT_HABITS,
        isLoggedIn: false,
        userName: "",
        statusMessage: DEFAULT_STATUS,
      };
    }

    const parsed = JSON.parse(raw) as unknown;

    if (isStorageV2(parsed)) {
      const habits = parsed.habits.map((habit) => normalizeHabit(habit));
      const userName = parsed.userName?.trim() ?? "";
      return {
        habits: habits.length > 0 ? habits : DEFAULT_HABITS,
        isLoggedIn: Boolean(userName),
        userName,
        statusMessage: DEFAULT_STATUS,
      };
    }

    const legacy = parsed as LegacyStorage;
    const migratedHabits = migrateLegacyHabits(legacy.habits);
    const migratedUserName = legacy.userName?.trim() ?? "";

    return {
      habits: migratedHabits,
      isLoggedIn: Boolean(migratedUserName),
      userName: migratedUserName,
      statusMessage: "기존 데이터를 새 형식으로 불러왔어요. 저장하면 자동 업그레이드됩니다.",
    };
  } catch {
    return {
      habits: DEFAULT_HABITS,
      isLoggedIn: false,
      userName: "",
      statusMessage: "저장 데이터를 불러오는 중 오류가 있었어요.",
    };
  }
}

export function toStoragePayload(habits: Habit[], userName: string): StorageSchemaV2 {
  return {
    version: STORAGE_VERSION,
    userName,
    habits,
  };
}
