import type { AchievementDef } from '../types';

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-lesson',
    title: 'Primeros pasos',
    description: 'Completa tu primera lección',
    icon: '🐣',
  },
  {
    id: 'perfect-lesson',
    title: 'Impecable',
    description: 'Completa una lección sin errores',
    icon: '💎',
  },
  {
    id: 'streak-3',
    title: 'Calentando motores',
    description: 'Alcanza una racha de 3 días',
    icon: '🔥',
  },
  {
    id: 'streak-7',
    title: 'Semana en llamas',
    description: 'Alcanza una racha de 7 días',
    icon: '🚀',
  },
  {
    id: 'xp-100',
    title: 'Centenario',
    description: 'Acumula 100 XP',
    icon: '⭐',
  },
  {
    id: 'xp-500',
    title: 'Imparable',
    description: 'Acumula 500 XP',
    icon: '🌟',
  },
  {
    id: 'lessons-10',
    title: 'Maratonista',
    description: 'Completa 10 lecciones',
    icon: '🏃',
  },
  {
    id: 'first-review',
    title: 'Memoria fresca',
    description: 'Completa tu primer repaso',
    icon: '🧠',
  },
  {
    id: 'reviews-10',
    title: 'Nunca lo olvido',
    description: 'Completa 10 repasos',
    icon: '🐘',
  },
  {
    id: 'first-unit',
    title: 'Capítulo cerrado',
    description: 'Completa una unidad entera',
    icon: '🏆',
  },
  {
    id: 'all-units',
    title: 'Políglota',
    description: 'Completa todas las unidades',
    icon: '👑',
  },
];

export function achievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
