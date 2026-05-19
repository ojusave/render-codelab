import type { ReactNode } from "react";
import { CodelabChrome } from "./CodelabChrome";

export type { StepManifest, StepContent, CodelabStepContent } from "../lib/codelabTypes";

type GoogleCodelabViewProps = {
  sessionCode: string;
  codelabTitle: string;
  steps: import("../lib/codelabTypes").StepManifest[];
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

export function GoogleCodelabView(props: GoogleCodelabViewProps) {
  return <CodelabChrome {...props} />;
}
