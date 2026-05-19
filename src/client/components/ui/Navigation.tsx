import type { ReactNode } from "react";

type NavigationProps = {
  logo: ReactNode;
  actions?: ReactNode;
  sticky?: boolean;
  frosted?: boolean;
};

export function Navigation({ logo, actions, sticky, frosted }: NavigationProps) {
  return (
    <header
      className={[
        "border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950",
        sticky ? "sticky top-0 z-50" : "",
        frosted ? "backdrop-blur-md bg-white/90 dark:bg-neutral-950/90" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="min-w-0 shrink">{logo}</div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
