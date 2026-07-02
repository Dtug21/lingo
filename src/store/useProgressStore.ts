import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HeartsState, LessonRecord, StreakState } from '../types';
import { INITIAL_HEARTS, applyRegen, loseHeart } from '../lib/hearts';
import { INITIAL_STREAK, recordActivity } from '../lib/streak';
import { checkNewAchievements } from '../lib/achievements';
import { toLocalDateKey } from '../lib/dates';
import { UNITS } from '../data/lessons';

interface CompleteLessonInput {
  lessonId: string;
  xpEarned: number;
  perfect: boolean;
}

interface ProgressState {
  xp: number;
  hearts: HeartsState;
  streak: StreakState;
  completedLessons: Record<string, LessonRecord>;
  unlockedAchievements: string[];

  /** Sincroniza la regeneración perezosa de corazones. Idempotente. */
  syncHearts: () => void;
  loseOneHeart: () => void;
  /** Registra la lección terminada: XP, racha, logros. Devuelve ids de logros nuevos. */
  completeLesson: (input: CompleteLessonInput) => string[];
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      hearts: INITIAL_HEARTS,
      streak: INITIAL_STREAK,
      completedLessons: {},
      unlockedAchievements: [],

      syncHearts: () => {
        const { hearts } = get();
        const next = applyRegen(hearts, Date.now());
        if (next !== hearts) set({ hearts: next });
      },

      loseOneHeart: () => {
        set((s) => ({ hearts: loseHeart(s.hearts, Date.now()) }));
      },

      completeLesson: ({ lessonId, xpEarned, perfect }) => {
        const state = get();
        const prev = state.completedLessons[lessonId];
        const record: LessonRecord = {
          completedAt: new Date().toISOString(),
          perfect: perfect || (prev?.perfect ?? false),
          timesCompleted: (prev?.timesCompleted ?? 0) + 1,
        };
        const completedLessons = { ...state.completedLessons, [lessonId]: record };
        const xp = state.xp + xpEarned;
        const streak = recordActivity(state.streak, toLocalDateKey(new Date()));

        const newIds = checkNewAchievements(
          { xp, streakCount: streak.count, completedLessons, units: UNITS },
          state.unlockedAchievements,
        );

        set({
          xp,
          streak,
          completedLessons,
          unlockedAchievements: [...state.unlockedAchievements, ...newIds],
        });
        return newIds;
      },

      resetProgress: () => {
        set({
          xp: 0,
          hearts: INITIAL_HEARTS,
          streak: INITIAL_STREAK,
          completedLessons: {},
          unlockedAchievements: [],
        });
      },
    }),
    { name: 'lingo-progress' },
  ),
);
