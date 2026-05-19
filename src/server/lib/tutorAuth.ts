import crypto from "node:crypto";

const COOKIE = "tutor_sess";

export function getCookieName(): string {
  return COOKIE;
}

function sign(payload: string, secret: string): string {
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function createTutorToken(sessionCode: string, secret: string): string {
  const body = Buffer.from(
    JSON.stringify({ sessionCode, exp: Date.now() + 8 * 60 * 60 * 1000 }),
    "utf8",
  ).toString("base64url");
  return sign(body, secret);
}

export function verifyTutorToken(token: string | undefined, secret: string): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body] = parts;
  const expected = sign(body, secret);
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(token, "utf8");
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const json = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      sessionCode: string;
      exp: number;
    };
    if (json.exp < Date.now()) return null;
    return json.sessionCode;
  } catch {
    return null;
  }
}

export function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = decodeURIComponent(part.slice(idx + 1).trim());
    out[k] = v;
  }
  return out;
}

export function readTutorSessionCode(cookieHeader: string | undefined, secret: string): string | null {
  const cookies = parseCookies(cookieHeader);
  return verifyTutorToken(cookies[COOKIE], secret);
}
