/** Runtime config from Render-injected environment variables. */

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function isRender(): boolean {
  return Boolean(process.env.RENDER);
}

export function requireEnv(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

export function getPort(): number {
  const raw = process.env.PORT;
  if (raw) return Number(raw);
  if (isProduction()) {
    throw new Error("PORT must be set in production (Render sets this automatically)");
  }
  return 8787;
}

export function getSigningSecret(): string {
  if (isProduction()) return requireEnv("SESSION_SIGNING_SECRET");
  return process.env.SESSION_SIGNING_SECRET?.trim() || "dev-insecure-secret";
}

export function getTutorPassword(): string {
  if (isProduction()) return requireEnv("TUTOR_PASSWORD");
  return process.env.TUTOR_PASSWORD?.trim() || "workshop";
}

export function getPublicUrl(): string | null {
  const url = process.env.RENDER_EXTERNAL_URL?.trim();
  return url || null;
}
