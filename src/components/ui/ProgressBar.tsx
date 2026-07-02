interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const ratio = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className="h-4 w-full overflow-hidden rounded-full bg-gray-200"
    >
      <div
        className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
        style={{ width: `${ratio * 100}%` }}
      >
        <div className="mx-2 mt-1 h-1 rounded-full bg-white/40" />
      </div>
    </div>
  );
}
