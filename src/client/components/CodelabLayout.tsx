import { Button, RenderLogo, ThemeToggle } from "./ui";
import { useStepContent } from "../hooks/useWorkshopQueries";
import type { StepManifest } from "../lib/codelabTypes";
import { adjacentStepOrder, normalizeSteps } from "../lib/steps";
import { GoogleCodelabView } from "./GoogleCodelabView";

type CodelabLayoutProps = {
  sessionCode: string;
  codelabTitle: string;
  steps: StepManifest[];
  currentOrder: number;
  completedOrders: number[];
  tutorOrder: number | null;
  tutorTitle: string;
  stuck: boolean;
  onStuckToggle: () => void;
  onMarkDone: () => void;
  onSelectStep: (order: number) => void;
};

export function CodelabLayout({
  sessionCode,
  codelabTitle,
  steps,
  currentOrder,
  completedOrders,
  tutorOrder,
  tutorTitle,
  stuck,
  onStuckToggle,
  onMarkDone,
  onSelectStep,
}: CodelabLayoutProps) {
  const completed = new Set(completedOrders);
  const tutorLine =
    tutorOrder !== null && tutorTitle ? `Tutor on step ${tutorOrder}: ${tutorTitle}` : null;

  const { data: stepContent, isPending, isFetching } = useStepContent(sessionCode, currentOrder);
  const stepLoading = isPending || (isFetching && !stepContent?.html);

  const manifest = normalizeSteps(steps);
  const goPrev = () => {
    const prev = adjacentStepOrder(manifest, currentOrder, -1);
    if (prev !== null) onSelectStep(prev);
  };
  const goNext = () => {
    const next = adjacentStepOrder(manifest, currentOrder, 1);
    if (next !== null) onSelectStep(next);
  };

  return (
    <div className="workshop-codelab-shell">
      <GoogleCodelabView
        sessionCode={sessionCode}
        codelabTitle={codelabTitle}
        steps={steps}
        selectedOrder={currentOrder}
        stepHtml={stepContent?.html}
        stepLoading={stepLoading}
        completedOrders={completedOrders}
        tutorOrder={tutorOrder}
        tutorLine={tutorLine}
        progress={{ completed: completed.size, total: manifest.length }}
        onSelectOrder={onSelectStep}
        onPrev={goPrev}
        onNext={goNext}
        headerActions={
          <div className="gcodelab-header-actions">
            <a
              href="https://render.com"
              target="_blank"
              rel="noreferrer"
              className="gcodelab-logo-link hidden sm:inline-flex"
              aria-label="Render"
            >
              <RenderLogo variant="mark" height={22} />
            </a>
            <ThemeToggle />
            <Button type="button" size="sm" variant="primary" onClick={onMarkDone}>
              Done
            </Button>
            <Button
              type="button"
              size="sm"
              variant={stuck ? "destructive" : "outline"}
              onClick={onStuckToggle}
            >
              {stuck ? "Stuck" : "Help"}
            </Button>
          </div>
        }
      />
    </div>
  );
}
