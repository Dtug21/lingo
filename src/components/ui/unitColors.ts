import type { UnitColor } from '../../types';

interface UnitPalette {
  banner: string;
  node: string;
  nodeText: string;
  progressText: string;
}

/** Clases Tailwind completas por color de unidad (no se pueden componer dinámicamente). */
export const UNIT_PALETTE: Record<UnitColor, UnitPalette> = {
  green: {
    banner: 'bg-brand-500 border-brand-700',
    node: 'bg-brand-500 border-brand-700 hover:bg-brand-400',
    nodeText: 'text-brand-600',
    progressText: 'text-brand-100',
  },
  orange: {
    banner: 'bg-orange-400 border-orange-600',
    node: 'bg-orange-400 border-orange-600 hover:bg-orange-300',
    nodeText: 'text-orange-500',
    progressText: 'text-orange-100',
  },
  sky: {
    banner: 'bg-sky-400 border-sky-600',
    node: 'bg-sky-400 border-sky-600 hover:bg-sky-300',
    nodeText: 'text-sky-500',
    progressText: 'text-sky-100',
  },
  violet: {
    banner: 'bg-violet-400 border-violet-600',
    node: 'bg-violet-400 border-violet-600 hover:bg-violet-300',
    nodeText: 'text-violet-500',
    progressText: 'text-violet-100',
  },
  pink: {
    banner: 'bg-pink-400 border-pink-600',
    node: 'bg-pink-400 border-pink-600 hover:bg-pink-300',
    nodeText: 'text-pink-500',
    progressText: 'text-pink-100',
  },
  teal: {
    banner: 'bg-teal-400 border-teal-600',
    node: 'bg-teal-400 border-teal-600 hover:bg-teal-300',
    nodeText: 'text-teal-500',
    progressText: 'text-teal-100',
  },
  indigo: {
    banner: 'bg-indigo-400 border-indigo-600',
    node: 'bg-indigo-400 border-indigo-600 hover:bg-indigo-300',
    nodeText: 'text-indigo-500',
    progressText: 'text-indigo-100',
  },
};
