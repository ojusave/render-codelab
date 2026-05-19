import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStudentWs } from "../hooks/useWs";
import {
  usePatchStudent,
  useSessionBootstrap,
  useJoinSession,
} from "../hooks/useWorkshopQueries";
import { CodelabLayout } from "../components/CodelabLayout";
import { SiteFooter } from "../components/SiteFooter";
import { Card, CardContent, FormField, Navigation, RenderLogo, Spinner } from "../components/ui";
import { clearSessionLocalStorage, sessionStorageKey } from "../lib/sessionStorage";
import { queryClient } from "../lib/queryClient";
import { queryKeys } from "../lib/queryKeys";

export function StudentLabPage() {
  const { sessionCode = "" } = useParams();
  const [nameInput, setNameInput] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [tutorOrder, setTutorOrder] = useState<number | null>(null);
  const [tutorTitle, setTutorTitle] = useState("");

  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem(sessionStorageKey(sessionCode, "token")) : null,
  );

  useEffect(() => {
    setToken(localStorage.getItem(sessionStorageKey(sessionCode, "token")));
  }, [sessionCode]);

  const {
    data: bootstrap,
    isLoading,
    isError,
    isFetching,
  } = useSessionBootstrap(sessionCode, token);

  const joinMutation = useJoinSession(sessionCode);
  const patchMutation = usePatchStudent(sessionCode, token);

  useEffect(() => {
    if (!bootstrap) return;
    setTutorOrder(bootstrap.session.tutorStepOrder);
    setTutorTitle(bootstrap.session.tutorStepTitle);
    if (!bootstrap.student && !token) {
      const savedName = localStorage.getItem(sessionStorageKey(sessionCode, "name"));
      setNameInput(savedName ?? "");
    }
    if (!bootstrap.student && token) {
      localStorage.removeItem(sessionStorageKey(sessionCode, "token"));
    }
  }, [bootstrap, sessionCode, token]);

  const onPointer = useCallback(
    (msg: { tutorStepOrder: number; tutorStepTitle: string }) => {
      setTutorOrder(msg.tutorStepOrder);
      setTutorTitle(msg.tutorStepTitle);
    },
    [],
  );

  useStudentWs(sessionCode, bootstrap?.student ? token : null, onPointer);

  const student = bootstrap?.student;
  const showLab = Boolean(student && bootstrap?.steps.length);
  const showName =
    !isError &&
    bootstrap &&
    !student &&
    !joinMutation.isPending &&
    (!token || !isFetching);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setJoinError(null);
    const name =
      nameInput.trim() || localStorage.getItem(sessionStorageKey(sessionCode, "name"))?.trim() || "";
    if (!name) {
      setJoinError("Enter your name.");
      return;
    }
    try {
      localStorage.setItem(sessionStorageKey(sessionCode, "name"), name);
      const { student: st } = await joinMutation.mutateAsync(name);
      if (!st) {
        setJoinError("Could not join. Try again.");
        return;
      }
      localStorage.setItem(sessionStorageKey(sessionCode, "token"), st.secretToken);
      setToken(st.secretToken);
      await queryClient.invalidateQueries({ queryKey: queryKeys.session(sessionCode, st.secretToken) });
    } catch {
      setJoinError("Could not join. Try again.");
    }
  }

  async function setStep(order: number) {
    if (!student) return;
    try {
      await patchMutation.mutateAsync({ currentViewStepOrder: order });
    } catch {
      /* noop */
    }
  }

  async function markDone() {
    if (!student) return;
    try {
      await patchMutation.mutateAsync({ markStepDone: true });
    } catch {
      /* noop */
    }
  }

  async function toggleStuck() {
    if (!student) return;
    try {
      await patchMutation.mutateAsync({ stuck: !student.stuck });
    } catch {
      /* noop */
    }
  }

  if (isLoading && !bootstrap) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8f9fa] text-[#5f6368] dark:bg-[#202124] dark:text-[#9aa0a6]">
        <Spinner size="lg" />
        <p>Loading session…</p>
      </div>
    );
  }

  if (isError || !bootstrap) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-6 py-16">
        <p className="text-lg text-neutral-800">
          Could not load this session. Check the URL or ask your tutor for the session code.
        </p>
        <Link className="workshop-link font-medium" to="/">
          Back to home
        </Link>
      </div>
    );
  }

  if (showName) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f8f9fa] dark:bg-[#202124]">
        <Navigation sticky logo={<RenderLogo variant="full" height={24} />} />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#1967d2]">
              Session {sessionCode}
            </p>
            <h1 className="mt-2 font-[family-name:Roboto] text-3xl font-light text-[#202124] dark:text-[#e8eaed]">
              Join the codelab
            </h1>
            <p className="mt-2 text-[#5f6368] dark:text-[#9aa0a6]">
              Enter the name that should appear on the tutor screen.
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <form className="flex flex-col gap-4" onSubmit={handleJoin}>
                <FormField
                  label="Your name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  autoComplete="name"
                  maxLength={120}
                  required
                />
                {joinError ? <p className="text-sm text-red-700">{joinError}</p> : null}
                <button type="submit" className="workshop-btn-primary py-3 text-base font-medium">
                  Continue
                </button>
              </form>
            </CardContent>
          </Card>
          <button
            type="button"
            className="workshop-link text-left text-sm font-medium"
            onClick={() => {
              clearSessionLocalStorage(sessionCode);
              setNameInput("");
              setJoinError(null);
            }}
          >
            Clear saved name and progress on this device
          </button>
          <Link className="workshop-link text-sm font-medium" to="/">
            ← Back to home
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!showLab) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-6 py-16">
        <p className="text-lg text-neutral-800">
          {bootstrap.steps.length === 0
            ? "This session has no codelab steps yet. Ask your tutor to check the deployment."
            : "Loading your progress…"}
        </p>
        {bootstrap.steps.length === 0 ? (
          <Link className="workshop-link font-medium" to="/">
            Back to home
          </Link>
        ) : (
          <Spinner size="lg" />
        )}
      </div>
    );
  }

  const effectiveTutorOrder = tutorOrder ?? bootstrap.session.tutorStepOrder;
  const effectiveTutorTitle = tutorTitle || bootstrap.session.tutorStepTitle;

  return (
    <CodelabLayout
      sessionCode={sessionCode}
      codelabTitle="Render Workflows Workshop"
      steps={bootstrap.steps}
      currentOrder={student!.currentViewStepOrder}
      completedOrders={student!.completedStepOrders}
      tutorOrder={effectiveTutorOrder}
      tutorTitle={effectiveTutorTitle}
      stuck={student!.stuck}
      onStuckToggle={() => void toggleStuck()}
      onMarkDone={() => void markDone()}
      onSelectStep={(order) => void setStep(order)}
    />
  );
}
