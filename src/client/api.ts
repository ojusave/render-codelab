const base = "";

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    throw new Error(`empty_response:${res.status}`);
  }
  return JSON.parse(text) as T;
}

export type StepManifest = {
  order: number;
  title: string;
  duration?: number;
  slug: string;
};

export type StepPayload = StepManifest & {
  html: string;
};

export type SessionBootstrap = {
  session: {
    code: string;
    tutorStepOrder: number;
    tutorStepTitle: string;
  };
  steps: StepManifest[];
  student: {
    id: string;
    displayName: string;
    secretToken: string;
    completedStepOrders: number[];
    currentViewStepOrder: number;
    stuck: boolean;
  } | null;
};

export async function fetchBootstrap(sessionCode: string, token?: string): Promise<SessionBootstrap> {
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${base}/api/session/${encodeURIComponent(sessionCode)}`, {
    headers,
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`bootstrap_${res.status}`);
  }
  return parseJson<SessionBootstrap>(res);
}

export async function fetchStepContent(sessionCode: string, order: number): Promise<StepPayload> {
  const res = await fetch(
    `${base}/api/session/${encodeURIComponent(sessionCode)}/steps/${order}`,
    { credentials: "include" },
  );
  if (!res.ok) {
    throw new Error(`step_${res.status}`);
  }
  return parseJson<StepPayload>(res);
}

export async function joinSession(sessionCode: string, name: string) {
  const res = await fetch(`${base}/api/session/${encodeURIComponent(sessionCode)}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`join_${res.status}`);
  }
  return parseJson<{
    student: SessionBootstrap["student"];
  }>(res);
}

export async function patchMe(
  sessionCode: string,
  token: string,
  body: {
    currentViewStepOrder?: number;
    stuck?: boolean;
    markStepDone?: boolean;
  },
) {
  const res = await fetch(`${base}/api/session/${encodeURIComponent(sessionCode)}/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`patch_${res.status}`);
  }
  return parseJson<{ student: NonNullable<SessionBootstrap["student"]> }>(res);
}

export type RosterStudent = {
  id: string;
  name: string;
  currentViewStepOrder: number;
  stuck: boolean;
  completedStepOrders: number[];
  status: "stuck" | "done_tutor_step" | "working";
  statusLabel: string;
};

export async function tutorLogin(sessionCode: string, password: string) {
  const res = await fetch(`${base}/api/tutor/${encodeURIComponent(sessionCode)}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`login_${res.status}`);
  }
  return parseJson<{ ok: boolean }>(res);
}

export async function fetchTutorRoster(sessionCode: string) {
  const res = await fetch(`${base}/api/tutor/${encodeURIComponent(sessionCode)}/roster`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`roster_${res.status}`);
  }
  return parseJson<{
    tutorStepOrder: number;
    tutorStepTitle: string;
    summary: { caughtUp: number; total: number };
    students: RosterStudent[];
    stepManifest: { order: number; title: string }[];
    steps: StepManifest[];
  }>(res);
}

export async function tutorPointer(
  sessionCode: string,
  body: { action: "next" | "prev" } | { action: "jump"; stepOrder: number },
) {
  const res = await fetch(`${base}/api/tutor/${encodeURIComponent(sessionCode)}/pointer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`pointer_${res.status}`);
  }
  return parseJson<{ tutorStepOrder: number; tutorStepTitle: string }>(res);
}

export async function tutorReset(sessionCode: string) {
  const res = await fetch(`${base}/api/tutor/${encodeURIComponent(sessionCode)}/reset`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`reset_${res.status}`);
  }
  return parseJson<{ tutorStepOrder: number; tutorStepTitle: string }>(res);
}
