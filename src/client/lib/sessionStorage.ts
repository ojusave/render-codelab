/** localStorage keys for a workshop session (student name + auth token). */
export function sessionStorageKey(sessionCode: string, suffix: "token" | "name"): string {
  return `codelab_${sessionCode}_${suffix}`;
}

export function clearSessionLocalStorage(sessionCode: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(sessionStorageKey(sessionCode, "token"));
  localStorage.removeItem(sessionStorageKey(sessionCode, "name"));
}
