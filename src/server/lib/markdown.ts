import matter from "gray-matter";
import { Marked, Renderer, type Tokens } from "marked";
import path from "node:path";
import { transformGithubAlerts } from "./alerts.js";
import { sanitizeStepHtml, wrapCodelabContent } from "./sanitizeHtml.js";

export type StepFrontmatter = {
  order: number;
  title: string;
  duration?: number;
};

export type LoadedStep = StepFrontmatter & {
  slug: string;
  sourcePath: string;
  html: string;
};

function escapeHtmlText(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeHtmlAttr(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/** Drop a leading `# Title` when it matches frontmatter (layout already renders title). */
function stripDuplicateTitleHeading(body: string, title: string): string {
  const normalizedTitle = title.trim().toLowerCase();
  const match = body.match(/^#\s+(.+?)\s*(?:\r?\n|$)/);
  if (!match) return body;
  if (match[1].trim().toLowerCase() !== normalizedTitle) return body;
  return body.slice(match[0].length).replace(/^\s+/, "");
}

export function renderMarkdownFile(
  raw: string,
  opts: { sourcePath: string; contentRoot: string },
): { meta: StepFrontmatter; html: string } {
  const parsed = matter(raw);
  const metaRaw = parsed.data as Record<string, unknown>;
  const order = Number(metaRaw.order);
  const title = String(metaRaw.title ?? "").trim();
  if (!Number.isFinite(order) || !title) {
    throw new Error(`Invalid frontmatter in ${opts.sourcePath}: need order (number) and title`);
  }
  const durationRaw = metaRaw.duration;
  const duration =
    durationRaw === undefined || durationRaw === null ? undefined : Number(durationRaw);

  const renderer = new Renderer();
  renderer.code = (token: Tokens.Code) => {
    const lang = token.lang?.trim() ?? "";
    const langClass = lang ? `language-${lang}` : "";
    return `<pre><code class="${langClass}">${escapeHtmlText(token.text)}</code></pre>`;
  };
  renderer.image = (token: Tokens.Image) => {
    let href = token.href;
    if (!/^https?:\/\//i.test(href)) {
      const baseDir = path.dirname(opts.sourcePath);
      const resolved = path.resolve(baseDir, href);
      const rel = path.relative(opts.contentRoot, resolved).replace(/\\/g, "/");
      if (!rel.startsWith("..")) {
        href = `/content-files/${rel}`;
      }
    }
    const alt = escapeHtmlAttr(token.text);
    const titleAttr = token.title ? ` title="${escapeHtmlAttr(token.title)}"` : "";
    return `<img src="${escapeHtmlAttr(href)}" alt="${alt}"${titleAttr} loading="lazy" />`;
  };

  const md = new Marked({ gfm: true, renderer });

  let body = stripDuplicateTitleHeading(
    parsed.content.replace(/\r\n/g, "\n").trimStart(),
    title,
  );
  body = transformGithubAlerts(body, (fragment) => md.parse(fragment) as string);

  body = body.replace(/\r\n/g, "\n");

  const rawHtml = md.parse(body) as string;
  const html = wrapCodelabContent(sanitizeStepHtml(rawHtml));

  return {
    meta: {
      order,
      title,
      duration: Number.isFinite(duration as number) ? (duration as number) : undefined,
    },
    html,
  };
}
