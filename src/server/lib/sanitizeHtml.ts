/** Strip active content from rendered markdown before it reaches the client. */
export function sanitizeStepHtml(html: string): string {
  let out = html;
  out = out.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  out = out.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  out = out.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "");
  out = out.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  return out;
}

/** Wrap body HTML so client CSS can scope all author content under one selector. */
export function wrapCodelabContent(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return '<div class="codelab-content"></div>';
  if (trimmed.startsWith('<div class="codelab-content"')) return trimmed;
  return `<div class="codelab-content">${trimmed}</div>`;
}
