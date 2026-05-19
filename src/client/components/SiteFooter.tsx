import { renderSignupUrlWithUtms } from "../lib/renderSignup";

const repo =
  import.meta.env.VITE_GITHUB_REPO_URL?.trim() ||
  "https://github.com/ojusave/render-codelab";

export function SiteFooter() {
  const deployHref =
    repo.startsWith("https://github.com/") || repo.startsWith("http")
      ? `https://render.com/deploy?repo=${encodeURIComponent(repo)}`
      : "https://render.com/docs/deploy-to-render-button";

  const links = [
    { label: "GitHub repository", href: repo },
    { label: "Deploy to Render", href: deployHref },
    { label: "Sign up on Render", href: renderSignupUrlWithUtms("footer_link") },
  ];

  return (
    <footer className="border-t border-neutral-200 bg-white px-4 py-8 dark:border-neutral-800 dark:bg-neutral-950">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        {links.map((link) => (
          <a
            key={link.label}
            className="workshop-link"
            href={link.href}
            target="_blank"
            rel="noreferrer"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
