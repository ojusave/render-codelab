import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200 ${className}`.trim()}
    >
      {children}
    </span>
  );
}
