import { useEffect, useState, type ReactNode } from "react";
import { Spinner } from "./ui";
import { CodelabContent } from "./CodelabContent";
import type { StepManifest } from "../lib/codelabTypes";
import { adjacentStepOrder, normalizeSteps, resolveStep, stepIndexByOrder } from "../lib/steps";
import { usePrefetchStep } from "../hooks/useWorkshopQueries";

type CodelabChromeProps = {
  sessionCode: string;
  codelabTitle: string;
  steps: StepManifest[];
  selectedOrder: number;
  stepHtml?: string;
  stepLoading?: boolean;
  completedOrders?: number[];
  tutorOrder?: number | null;
  tutorLine?: string | null;
  progress?: { completed: number; total: number } | null;
  headerActions?: ReactNode;
  onSelectOrder?: (order: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
};

function formatDuration(minutes?: number): string {
  if (!minutes || minutes <= 0) return "";
  return `${minutes} min`;
}

function IconMenu() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="m10 6-1.41 1.41L13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

export function CodelabChrome({
  sessionCode,
  codelabTitle,
  steps,
  selectedOrder,
  stepHtml,
  stepLoading = false,
  completedOrders = [],
  tutorOrder = null,
  tutorLine,
  progress,
  headerActions,
  onSelectOrder,
  onPrev,
  onNext,
}: CodelabChromeProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const completed = new Set(completedOrders);
  const manifest = normalizeSteps(steps);
  const idx = stepIndexByOrder(manifest, selectedOrder);
  const step = resolveStep(manifest, selectedOrder);
  const prefetchStep = usePrefetchStep(sessionCode);
  const canPrev = adjacentStepOrder(manifest, step?.order ?? selectedOrder, -1) !== null;
  const canNext = adjacentStepOrder(manifest, step?.order ?? selectedOrder, 1) !== null;
  const progressPct =
    progress && progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  useEffect(() => {
    setDrawerOpen(false);
  }, [selectedOrder]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  if (!step) {
    return (
      <p className="gcodelab-empty" role="status">
        No step content available.
      </p>
    );
  }

  const drawer = (
    <nav className="gcodelab-drawer" aria-label="Codelab steps">
      <div className="gcodelab-drawer-header">
        <p className="gcodelab-drawer-title">{codelabTitle}</p>
        <p className="gcodelab-drawer-meta">{sessionCode}</p>
        {progress ? (
          <div className="gcodelab-drawer-progress">
            <div className="gcodelab-drawer-progress-label">
              <span>
                {progress.completed} / {progress.total} completed
              </span>
              <span>{progressPct}%</span>
            </div>
            <div className="gcodelab-drawer-progress-track" role="progressbar" aria-valuenow={progressPct}>
              <div className="gcodelab-drawer-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        ) : null}
      </div>
      <ol className="gcodelab-step-list">
        {manifest.map((s, i) => {
          const active = s.order === selectedOrder;
          const done = completed.has(s.order);
          const tutor = tutorOrder === s.order;
          return (
            <li key={s.order}>
              <button
                type="button"
                className={[
                  "gcodelab-step-item",
                  active ? "gcodelab-step-item--active" : "",
                  done ? "gcodelab-step-item--done" : "",
                  tutor ? "gcodelab-step-item--tutor" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onSelectOrder?.(s.order)}
                onMouseEnter={() => prefetchStep(s.order)}
                onFocus={() => prefetchStep(s.order)}
                aria-current={active ? "step" : undefined}
              >
                <span className="gcodelab-step-icon" aria-hidden>
                  {done ? <IconCheck /> : i + 1}
                </span>
                <span className="gcodelab-step-text">
                  <span className="gcodelab-step-name">{s.title}</span>
                  {s.duration ? (
                    <span className="gcodelab-step-duration">{formatDuration(s.duration)}</span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );

  return (
    <div className="gcodelab-root">
      <header className="gcodelab-titlebar">
        <div className="gcodelab-titlebar-start">
          <button
            type="button"
            className="gcodelab-icon-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open table of contents"
          >
            <IconMenu />
          </button>
          <button
            type="button"
            className="gcodelab-icon-btn gcodelab-icon-btn--nav"
            disabled={!canPrev}
            onClick={() => {
              if (onPrev) onPrev();
              else {
                const prev = adjacentStepOrder(manifest, step.order, -1);
                if (prev !== null) onSelectOrder?.(prev);
              }
            }}
            aria-label="Previous step"
          >
            <IconChevronLeft />
          </button>
          <h1 className="gcodelab-titlebar-heading">{step.title}</h1>
        </div>
        <div className="gcodelab-titlebar-end">
          {step.duration ? (
            <span className="gcodelab-duration" title="Estimated duration">
              {formatDuration(step.duration)}
            </span>
          ) : null}
          {headerActions}
          <button
            type="button"
            className="gcodelab-icon-btn gcodelab-icon-btn--nav"
            disabled={!canNext}
            onClick={() => {
              if (onNext) onNext();
              else {
                const next = adjacentStepOrder(manifest, step.order, 1);
                if (next !== null) onSelectOrder?.(next);
              }
            }}
            aria-label="Next step"
          >
            <IconChevronRight />
          </button>
        </div>
      </header>

      {tutorLine ? (
        <p className="gcodelab-tutor-banner" role="status">
          {tutorLine}
        </p>
      ) : null}

      <div className="gcodelab-layout">
        <div className="gcodelab-drawer-desktop">{drawer}</div>

        <main className="gcodelab-main" id="gcodelab-main">
          <article className="gcodelab-instructions">
            {stepLoading && !stepHtml ? (
              <div className="gcodelab-loading">
                <Spinner size="sm" />
                <span>Loading step…</span>
              </div>
            ) : (
              <CodelabContent html={stepHtml ?? ""} />
            )}
          </article>
        </main>
      </div>

      {drawerOpen ? (
        <>
          <button
            type="button"
            className="gcodelab-drawer-backdrop"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="gcodelab-drawer-panel">{drawer}</div>
        </>
      ) : null}
    </div>
  );
}
