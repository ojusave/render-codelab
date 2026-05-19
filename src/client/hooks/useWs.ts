import { useEffect, useRef } from "react";

export type TutorPointerMsg = {
  type: "tutor_pointer";
  tutorStepOrder: number;
  tutorStepTitle: string;
};

export type RosterMsg = {
  type: "roster";
  roster: import("../api").RosterStudent[];
};

export function useStudentWs(
  sessionCode: string | undefined,
  token: string | null,
  onPointer: (msg: TutorPointerMsg) => void,
) {
  const cb = useRef(onPointer);
  cb.current = onPointer;

  useEffect(() => {
    if (!sessionCode || !token) return;
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const url = `${proto}://${window.location.host}/ws?session=${encodeURIComponent(sessionCode)}&token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(url);
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data as string) as TutorPointerMsg | RosterMsg;
        if (msg.type === "tutor_pointer") {
          cb.current(msg);
        }
      } catch {
        /* ignore */
      }
    };
    return () => {
      ws.close();
    };
  }, [sessionCode, token]);
}

export function useTutorWs(
  sessionCode: string | undefined,
  enabled: boolean,
  onPointer: (msg: TutorPointerMsg) => void,
  onRoster: (students: import("../api").RosterStudent[]) => void,
) {
  const pRef = useRef(onPointer);
  const rRef = useRef(onRoster);
  pRef.current = onPointer;
  rRef.current = onRoster;

  useEffect(() => {
    if (!sessionCode || !enabled) return;
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const url = `${proto}://${window.location.host}/ws?session=${encodeURIComponent(sessionCode)}&role=tutor`;
    const ws = new WebSocket(url);
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data as string) as TutorPointerMsg | RosterMsg;
        if (msg.type === "tutor_pointer") {
          pRef.current(msg);
        }
        if (msg.type === "roster") {
          rRef.current(msg.roster);
        }
      } catch {
        /* ignore */
      }
    };
    return () => {
      ws.close();
    };
  }, [sessionCode, enabled]);
}
