import { useEffect } from 'react';

interface OptionGridProps {
  options: string[];
  selected: number | null;
  onSelect: (index: number) => void;
  disabled: boolean;
}

/**
 * Lista de opciones con atajos de teclado 1–9.
 * Presentacional: la selección vive en el ejercicio padre.
 */
export function OptionGrid({ options, selected, onSelect, disabled }: OptionGridProps) {
  useEffect(() => {
    if (disabled) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      const num = Number(e.key);
      if (Number.isInteger(num) && num >= 1 && num <= options.length) {
        onSelect(num - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [disabled, options.length, onSelect]);

  return (
    <div role="radiogroup" aria-label="Opciones de respuesta" className="flex flex-col gap-3">
      {options.map((option, i) => {
        const isSelected = selected === i;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onSelect(i)}
            className={`flex items-center gap-3 rounded-2xl border-2 border-b-4 px-4 py-3 text-left text-base font-bold transition-all duration-100 cursor-pointer disabled:cursor-default ${
              isSelected
                ? 'border-brand-400 bg-brand-50 text-brand-700'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span
              aria-hidden="true"
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 text-xs font-extrabold ${
                isSelected ? 'border-brand-400 text-brand-600' : 'border-gray-200 text-gray-400'
              }`}
            >
              {i + 1}
            </span>
            {option}
          </button>
        );
      })}
    </div>
  );
}
