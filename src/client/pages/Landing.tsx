import { Navigation, RenderLogo } from "../components/ui";
import { Link } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { renderSignupUrlWithUtms } from "../lib/renderSignup";

const defaultSession =
  import.meta.env.VITE_DEFAULT_SESSION_CODE?.trim() || "cascadia-2026";

const repo =
  import.meta.env.VITE_GITHUB_REPO_URL?.trim() ||
  "https://github.com/ojusave/render-codelab";

export function LandingPage() {
  const deployHref =
    repo.startsWith("https://github.com/") || repo.startsWith("http")
      ? `https://render.com/deploy?repo=${encodeURIComponent(repo)}`
      : "https://render.com/docs/deploy-to-render-button";

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation
        logo={<RenderLogo variant="full" height={28} />}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <a className="workshop-link text-sm font-medium" href={repo} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a
              className="workshop-btn-primary px-3 py-2 text-sm"
              href={deployHref}
              target="_blank"
              rel="noreferrer"
            >
              Deploy to Render
            </a>
            <a
              className="workshop-btn-primary px-3 py-2 text-sm"
              href={renderSignupUrlWithUtms("navbar_button")}
              target="_blank"
              rel="noreferrer"
            >
              Sign up on Render
            </a>
          </div>
        }
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6366f1]">
            Render workshop
          </p>
          <h1 className="font-[family-name:Roboto] text-4xl font-light leading-tight text-neutral-950 dark:text-neutral-100 md:text-5xl">
            Live Workshop Codelab
          </h1>
          <p className="max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
            Follow step-by-step exercises while the tutor drives pace from the front of the room. Join a
            session code, keep your progress in sync, and flag when you need help.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            className="workshop-btn-primary inline-flex items-center justify-center px-6 py-3 text-base font-medium"
            to={`/s/${encodeURIComponent(defaultSession)}`}
          >
            Join student session
          </Link>
          <Link
            className="workshop-btn-ghost inline-flex items-center justify-center border border-neutral-300 px-6 py-3 text-base font-medium dark:border-neutral-600"
            to={`/tutor/${encodeURIComponent(defaultSession)}`}
          >
            Tutor dashboard
          </Link>
        </div>

        <section className="rounded-none border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900">
          <h2 className="mb-2 font-[family-name:Roboto] text-xl font-light text-neutral-950 dark:text-neutral-100">
            Session URL
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Students open{" "}
            <code className="rounded border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-xs dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-200">
              /s/&lt;code&gt;
            </code>{" "}
            . Tutors open{" "}
            <code className="rounded border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-xs dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-200">
              /tutor/&lt;code&gt;
            </code>{" "}
            with the shared password. Default demo session code:{" "}
            <strong>{defaultSession}</strong>.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
