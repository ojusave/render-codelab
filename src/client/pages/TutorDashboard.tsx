import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Navigation, RenderLogo } from "../components/ui";
import type { RosterStudent } from "../api";
import { useTutorWs } from "../hooks/useWs";
import { queryKeys } from "../lib/queryKeys";
import {
  useStepContent,
  useTutorLogin,
  useTutorPointer,
  useTutorReset,
  useTutorRoster,
} from "../hooks/useWorkshopQueries";
import { GoogleCodelabView } from "../components/GoogleCodelabView";
import { ThemeToggle } from "../components/ui";
import { SiteFooter } from "../components/SiteFooter";
import { renderSignupUrlWithUtms } from "../lib/renderSignup";

const repo =
  import.meta.env.VITE_GITHUB_REPO_URL?.trim() ||
  "https://github.com/ojusave/render-codelab";

function dotClass(s: RosterStudent): string {
  if (s.status === "stuck") return "bg-red-600";
  if (s.status === "done_tutor_step") return "bg-emerald-600";
  return "bg-amber-400";
}

export function TutorDashboardPage() {
  const { sessionCode = "" } = useParams();
  const qc = useQueryClient();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [rosterOpen, setRosterOpen] = useState(true);
  const [tutorStepOrder, setTutorStepOrder] = useState(1);
  const [tutorStepTitle, setTutorStepTitle] = useState("");

  const rosterQuery = useTutorRoster(sessionCode, true);
  const loginMutation = useTutorLogin(sessionCode);
  const pointerMutation = useTutorPointer(sessionCode);
  const resetMutation = useTutorReset(sessionCode);

  const roster = rosterQuery.data?.students ?? [];
  const steps = rosterQuery.data?.steps ?? [];
  const summary = rosterQuery.data?.summary ?? { caughtUp: 0, total: 0 };
  const displayOrder = tutorStepOrder || rosterQuery.data?.tutorStepOrder || 1;

  const { data: stepContent, isPending: stepPending, isFetching: stepFetching } = useStepContent(
    sessionCode,
    displayOrder,
    rosterQuery.isSuccess,
  );
  const stepLoading = stepPending || (stepFetching && !stepContent?.html);

  const deployHref =
    repo.startsWith("https://github.com/") || repo.startsWith("http")
      ? `https://render.com/deploy?repo=${encodeURIComponent(repo)}`
      : "https://render.com/docs/deploy-to-render-button";

  useTutorWs(
    sessionCode,
    rosterQuery.isSuccess,
    (msg) => {
      setTutorStepOrder(msg.tutorStepOrder);
      setTutorStepTitle(msg.tutorStepTitle);
    },
    (students) => {
      const caughtUp = students.filter((s) => s.status === "done_tutor_step").length;
      qc.setQueryData(queryKeys.tutorRoster(sessionCode), (old) =>
        old
          ? {
              ...old,
              students,
              summary: { caughtUp, total: students.length },
            }
          : old,
      );
    },
  );

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await loginMutation.mutateAsync(pw);
      setPw("");
      await rosterQuery.refetch();
    } catch {
      setErr("Incorrect password.");
    }
  }

  async function jump(order: number) {
    try {
      const r = await pointerMutation.mutateAsync({ action: "jump", stepOrder: order });
      setTutorStepOrder(r.tutorStepOrder);
      setTutorStepTitle(r.tutorStepTitle);
    } catch {
      /* noop */
    }
  }

  async function reset() {
    if (
      !window.confirm(
        "Clear all students from the roster, reset the tutor pointer to step 1, and require students to re-join?",
      )
    ) {
      return;
    }
    try {
      const r = await resetMutation.mutateAsync();
      setTutorStepOrder(r.tutorStepOrder);
      setTutorStepTitle(r.tutorStepTitle);
    } catch {
      /* noop */
    }
  }

  if (rosterQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-lg text-neutral-600">
        Checking tutor session…
      </div>
    );
  }

  if (rosterQuery.isError) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation
          logo={<RenderLogo variant="full" height={28} />}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <a className="workshop-link text-sm font-medium" href={repo} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="workshop-btn-primary px-3 py-2 text-sm" href={deployHref} target="_blank" rel="noreferrer">
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
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-12">
          <div>
            <h1 className="font-[family-name:Roboto] text-3xl font-light text-neutral-950">Tutor access</h1>
            <p className="mt-2 text-neutral-600">
              Session <strong>{sessionCode}</strong>
            </p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={onLogin}>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Password
              <input
                type="password"
                className="border border-neutral-300 px-3 py-2 text-base"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            {err ? <p className="text-sm text-red-700">{err}</p> : null}
            <button type="submit" className="workshop-btn-primary py-3 text-base font-medium">
              Unlock dashboard
            </button>
          </form>
          <Link className="workshop-link text-sm" to="/">
            Student site
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="workshop-codelab-shell flex min-h-0 flex-col">
      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          <GoogleCodelabView
            sessionCode={sessionCode}
            codelabTitle="Render Workflows Workshop (tutor)"
            steps={steps}
            selectedOrder={displayOrder}
            stepHtml={stepContent?.html}
            stepLoading={stepLoading}
            tutorLine={`${summary.caughtUp} of ${summary.total} students caught up`}
            onSelectOrder={(order) => void jump(order)}
            onPrev={() => {
              const i = steps.findIndex((s) => s.order === displayOrder);
              if (i > 0) void jump(steps[i - 1]!.order);
            }}
            onNext={() => {
              const i = steps.findIndex((s) => s.order === displayOrder);
              if (i >= 0 && i < steps.length - 1) void jump(steps[i + 1]!.order);
            }}
            headerActions={
              <div className="gcodelab-header-actions">
                <ThemeToggle />
                <Button type="button" size="sm" variant="outline" onClick={() => setRosterOpen((v) => !v)}>
                  Roster
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => void reset()}>
                  Reset
                </Button>
              </div>
            }
          />
        </div>

        {rosterOpen ? (
          <aside className="workshop-roster-panel w-full max-w-sm shrink-0 border-l border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 md:w-80">
            <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Roster</p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Green = caught up · Yellow = working · Red = stuck
              </p>
            </div>
            <ul className="max-h-[calc(100dvh-12rem)] overflow-y-auto p-2">
              {roster.map((s) => (
                <li
                  key={s.id}
                  className="mb-2 flex items-start gap-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
                >
                  <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${dotClass(s)}`} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-neutral-950 dark:text-neutral-100">{s.name}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Step {s.currentViewStepOrder} · {s.statusLabel}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            {roster.length === 0 ? (
              <p className="p-4 text-center text-sm text-neutral-500">No students joined yet.</p>
            ) : null}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
