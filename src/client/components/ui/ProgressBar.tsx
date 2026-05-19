type ProgressBarProps = {
  value: number;
  label?: string;
  showPercentage?: boolean;
};

export function ProgressBar({ value, label, showPercentage }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-400">
        {label ? <span>{label}</span> : <span />}
        {showPercentage ? <span className="font-medium tabular-nums">{pct}%</span> : null}
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-violet-600 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
