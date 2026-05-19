export const queryKeys = {
  session: (code: string, token?: string | null) => ["session", code, token ?? ""] as const,
  step: (code: string, order: number) => ["step", code, order] as const,
  tutorRoster: (code: string) => ["tutorRoster", code] as const,
};
