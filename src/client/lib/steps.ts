import type { StepManifest } from "./codelabTypes";

/** Sort steps by `order` and drop invalid entries. Safe when content files change. */
export function normalizeSteps(steps: StepManifest[]): StepManifest[] {
  return [...steps]
    .filter((s) => Number.isFinite(s.order) && s.title.trim().length > 0)
    .sort((a, b) => a.order - b.order);
}

export function stepIndexByOrder(steps: StepManifest[], order: number): number {
  const normalized = normalizeSteps(steps);
  const idx = normalized.findIndex((s) => s.order === order);
  return idx >= 0 ? idx : 0;
}

export function resolveStep(steps: StepManifest[], order: number): StepManifest | undefined {
  const normalized = normalizeSteps(steps);
  if (normalized.length === 0) return undefined;
  return normalized.find((s) => s.order === order) ?? normalized[0];
}

export function adjacentStepOrder(
  steps: StepManifest[],
  currentOrder: number,
  direction: -1 | 1,
): number | null {
  const normalized = normalizeSteps(steps);
  const idx = normalized.findIndex((s) => s.order === currentOrder);
  if (idx < 0) return normalized[0]?.order ?? null;
  const next = normalized[idx + direction];
  return next?.order ?? null;
}
