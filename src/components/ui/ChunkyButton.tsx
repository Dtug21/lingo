import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'danger' | 'neutral' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white border-brand-700 hover:bg-brand-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300',
  danger:
    'bg-coral-500 text-white border-coral-700 hover:bg-coral-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300',
  neutral:
    'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:text-gray-300',
  ghost:
    'bg-transparent text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100',
};

interface ChunkyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

/** Botón con profundidad: borde inferior de 4px que se "hunde" al presionar. */
export function ChunkyButton({ variant = 'primary', className = '', ...rest }: ChunkyButtonProps) {
  return (
    <button
      {...rest}
      className={`rounded-2xl border-b-4 px-6 py-3 text-sm font-extrabold uppercase tracking-widest transition-all duration-100 active:translate-y-[3px] active:border-b-0 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4 cursor-pointer ${VARIANTS[variant]} ${className}`}
    />
  );
}
