import type { LoadedStep } from "./markdown.js";

export function sortedOrders(steps: LoadedStep[]): number[] {
  return steps.map((s) => s.order).sort((a, b) => a - b);
}

export function titleForOrder(steps: LoadedStep[], order: number): string {
  return steps.find((s) => s.order === order)?.title ?? `Step ${order}`;
}

export function nextOrderAfter(steps: LoadedStep[], current: number): number | null {
  const orders = sortedOrders(steps);
  const idx = orders.indexOf(current);
  if (idx === -1 || idx >= orders.length - 1) return null;
  return orders[idx + 1]!;
}

export function prevOrderBefore(steps: LoadedStep[], current: number): number | null {
  const orders = sortedOrders(steps);
  const idx = orders.indexOf(current);
  if (idx <= 0) return null;
  return orders[idx - 1]!;
}

export function clampOrderToManifest(steps: LoadedStep[], order: number): number {
  const orders = sortedOrders(steps);
  if (orders.length === 0) return order;
  if (orders.includes(order)) return order;
  return orders[0]!;
}
