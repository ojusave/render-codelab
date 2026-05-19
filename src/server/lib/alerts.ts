/** Converts GitHub-style `> [!TIP]` blockquotes into `<aside>` HTML (inner markdown parsed separately). */
export function transformGithubAlerts(
  markdown: string,
  parseInner: (fragment: string) => string,
): string {
  const lines = markdown.split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^>\s*\[!([A-Z]+)\]\s*$/i);
    if (m) {
      const kind = normalizeCalloutKind(m[1]);
      i += 1;
      const body: string[] = [];
      while (i < lines.length) {
        const l = lines[i];
        if (/^\s*>/.test(l)) {
          body.push(l.replace(/^\s*>\s?/, ""));
          i += 1;
        } else if (l.trim() === "") {
          body.push("");
          i += 1;
        } else {
          break;
        }
      }
      const innerMd = body.join("\n").trimEnd();
      const innerHtml = parseInner(innerMd);
      const asideClass =
        kind === "warning" || kind === "tip" || kind === "note" || kind === "important"
          ? kind
          : "note";
      out.push(`\n<aside class="${asideClass}">${innerHtml}</aside>\n`);
      continue;
    }
    out.push(line);
    i += 1;
  }
  return out.join("\n");
}

function normalizeCalloutKind(raw: string): string {
  const k = raw.toLowerCase();
  if (k === "important") return "important";
  if (k === "warning" || k === "caution") return "warning";
  if (k === "tip") return "tip";
  if (k === "note") return "note";
  return k;
}

function escapeAttr(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
