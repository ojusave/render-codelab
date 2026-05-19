import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { z } from "zod";
import { WebSocketServer } from "ws";
import {
  getPort,
  getPublicUrl,
  getSigningSecret,
  getTutorPassword,
  isProduction,
} from "./config.js";
import { getRepoRoot } from "./lib/paths.js";
import { titleForOrder } from "./lib/sessionLogic.js";
import {
  createTutorToken,
  getCookieName,
  parseCookies,
  readTutorSessionCode,
  verifyTutorToken,
} from "./lib/tutorAuth.js";
import { broadcastRoster, broadcastTutorPointer, registerClient } from "./lib/wsHub.js";
import { getSteps, watchContentInDev, type LoadedStep } from "./lib/content.js";
import {
  buildRoster,
  findStudentBySessionToken,
  getSessionByCode,
  joinSession,
  resetSessionStudents,
  setTutorPointer,
  updateStudentProgress,
} from "./services/workshop.js";

export function createApp(resolveSteps: () => LoadedStep[]) {
  const app = express();
  if (isProduction()) {
    app.set("trust proxy", 1);
  }
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "512kb" }));
  app.use(cookieParser());

  const root = getRepoRoot();
  const contentRoot = path.join(root, "content");
  app.use(
    "/content-files",
    express.static(contentRoot, {
      etag: true,
      maxAge: "1h",
    }),
  );

  app.get("/healthz", (_req, res) => {
    res.status(200).type("text/plain").send("ok");
  });

  app.get("/api/session/:code", async (req, res) => {
    const steps = resolveSteps();
    const code = req.params.code;
    const session = await getSessionByCode(code);
    if (!session) {
      res.status(404).json({ error: "session_not_found" });
      return;
    }
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : undefined;
    let student: Awaited<ReturnType<typeof findStudentBySessionToken>> = null;
    if (token) {
      student = await findStudentBySessionToken(code, token);
    }

    const tutorOrder = session.tutorStepOrder;
    res.json({
      session: {
        code,
        tutorStepOrder: tutorOrder,
        tutorStepTitle: titleForOrder(steps, tutorOrder),
      },
      steps: steps.map((s) => ({
        order: s.order,
        title: s.title,
        duration: s.duration,
        slug: s.slug,
      })),
      student: student
        ? {
            id: student.id,
            displayName: student.displayName,
            secretToken: student.secretToken,
            completedStepOrders: student.completedStepOrders,
            currentViewStepOrder: student.currentViewStepOrder,
            stuck: student.stuck,
          }
        : null,
    });
  });

  app.get("/api/session/:code/steps/:order", async (req, res) => {
    const steps = resolveSteps();
    const order = Number.parseInt(req.params.order, 10);
    if (!Number.isFinite(order)) {
      res.status(400).json({ error: "invalid_order" });
      return;
    }
    const step = steps.find((s) => s.order === order);
    if (!step) {
      res.status(404).json({ error: "step_not_found" });
      return;
    }
    res.setHeader("Cache-Control", "public, max-age=300");
    res.json({
      order: step.order,
      title: step.title,
      duration: step.duration,
      slug: step.slug,
      html: step.html,
    });
  });

  const JoinSchema = z.object({
    name: z.string().min(1).max(120),
  });

  app.post("/api/session/:code/join", async (req, res) => {
    const steps = resolveSteps();
    const parsed = JoinSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "invalid_body" });
      return;
    }
    try {
      const row = await joinSession(req.params.code, parsed.data.name, steps);
      const roster = await buildRoster(req.params.code, steps);
      if (roster) {
        broadcastRoster(req.params.code, roster);
      }
      res.json({
        student: {
          id: row.id,
          displayName: row.displayName,
          secretToken: row.secretToken,
          completedStepOrders: row.completedStepOrders,
          currentViewStepOrder: row.currentViewStepOrder,
          stuck: row.stuck,
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "error";
      if (msg === "SESSION_NOT_FOUND") {
        res.status(404).json({ error: "session_not_found" });
        return;
      }
      if (msg === "NO_STEPS") {
        res.status(500).json({ error: "no_steps" });
        return;
      }
      if (msg === "NAME_REQUIRED") {
        res.status(400).json({ error: "name_required" });
        return;
      }
      res.status(500).json({ error: "server_error" });
    }
  });

  const PatchSchema = z.object({
    currentViewStepOrder: z.number().int().optional(),
    stuck: z.boolean().optional(),
    markStepDone: z.boolean().optional(),
  });

  app.patch("/api/session/:code/me", async (req, res) => {
    const steps = resolveSteps();
    const parsed = PatchSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "invalid_body" });
      return;
    }
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    if (!token) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }
    try {
      const updated = await updateStudentProgress({
        sessionCode: req.params.code,
        token,
        steps,
        ...parsed.data,
      });
      const roster = await buildRoster(req.params.code, steps);
      if (roster) {
        broadcastRoster(req.params.code, roster);
      }
      res.json({
        student: {
          id: updated.id,
          displayName: updated.displayName,
          secretToken: updated.secretToken,
          completedStepOrders: updated.completedStepOrders,
          currentViewStepOrder: updated.currentViewStepOrder,
          stuck: updated.stuck,
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "error";
      if (msg === "SESSION_NOT_FOUND" || msg === "NOT_FOUND") {
        res.status(404).json({ error: "not_found" });
        return;
      }
      res.status(500).json({ error: "server_error" });
    }
  });

  app.post("/api/tutor/:code/login", async (req, res) => {
    const schema = z.object({ password: z.string().min(1) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "invalid_body" });
      return;
    }
    const pw = getTutorPassword();
    if (parsed.data.password !== pw) {
      res.status(401).json({ error: "invalid_password" });
      return;
    }
    const secret = getSigningSecret();
    const sessionCode = req.params.code;
    const session = await getSessionByCode(sessionCode);
    if (!session) {
      res.status(404).json({ error: "session_not_found" });
      return;
    }
    const tok = createTutorToken(sessionCode, secret);
    const maxAge = 8 * 60 * 60;
    res.cookie(getCookieName(), tok, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: maxAge * 1000,
      path: "/",
    });
    res.json({ ok: true });
  });

  app.post("/api/tutor/:code/logout", (_req, res) => {
    res.clearCookie(getCookieName(), { path: "/" });
    res.json({ ok: true });
  });

  async function requireTutor(req: express.Request, res: express.Response): Promise<string | null> {
    const secret = getSigningSecret();
    const code = readTutorSessionCode(req.headers.cookie, secret);
    if (!code || code !== req.params.code) {
      res.status(401).json({ error: "unauthorized" });
      return null;
    }
    return code;
  }

  app.get("/api/tutor/:code/roster", async (req, res) => {
    const steps = resolveSteps();
    if (!(await requireTutor(req, res))) return;
    const roster = await buildRoster(req.params.code, steps);
    if (!roster) {
      res.status(404).json({ error: "session_not_found" });
      return;
    }
    const session = await getSessionByCode(req.params.code);
    if (!session) {
      res.status(404).json({ error: "session_not_found" });
      return;
    }
    const tutorOrder = session.tutorStepOrder;
    const caughtUp = roster.filter((s) => s.status === "done_tutor_step").length;
    res.json({
      tutorStepOrder: tutorOrder,
      tutorStepTitle: titleForOrder(steps, tutorOrder),
      summary: { caughtUp, total: roster.length },
      students: roster,
      stepManifest: steps.map((s) => ({ order: s.order, title: s.title })),
      steps: steps.map((s) => ({
        order: s.order,
        title: s.title,
        duration: s.duration,
        slug: s.slug,
      })),
    });
  });

  const PointerSchema = z.discriminatedUnion("action", [
    z.object({ action: z.literal("next") }),
    z.object({ action: z.literal("prev") }),
    z.object({ action: z.literal("jump"), stepOrder: z.number().int() }),
  ]);

  app.post("/api/tutor/:code/pointer", async (req, res) => {
    const steps = resolveSteps();
    if (!(await requireTutor(req, res))) return;
    const parsed = PointerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "invalid_body" });
      return;
    }
    const body = parsed.data;
    try {
      let result;
      if (body.action === "next") {
        result = await setTutorPointer(req.params.code, steps, { kind: "next" });
      } else if (body.action === "prev") {
        result = await setTutorPointer(req.params.code, steps, { kind: "prev" });
      } else {
        result = await setTutorPointer(req.params.code, steps, {
          kind: "jump",
          stepOrder: body.stepOrder,
        });
      }
      broadcastTutorPointer(req.params.code, {
        tutorStepOrder: result.tutorStepOrder,
        tutorStepTitle: result.tutorStepTitle,
      });
      const roster = await buildRoster(req.params.code, steps);
      if (roster) {
        broadcastRoster(req.params.code, roster);
      }
      res.json(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "error";
      if (msg === "SESSION_NOT_FOUND") {
        res.status(404).json({ error: "session_not_found" });
        return;
      }
      res.status(500).json({ error: "server_error" });
    }
  });

  app.post("/api/tutor/:code/reset", async (req, res) => {
    const steps = resolveSteps();
    if (!(await requireTutor(req, res))) return;
    try {
      const result = await resetSessionStudents(req.params.code, steps);
      broadcastTutorPointer(req.params.code, {
        tutorStepOrder: result.tutorStepOrder,
        tutorStepTitle: result.tutorStepTitle,
      });
      const roster = await buildRoster(req.params.code, steps);
      if (roster) {
        broadcastRoster(req.params.code, roster);
      }
      res.json(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "error";
      if (msg === "SESSION_NOT_FOUND") {
        res.status(404).json({ error: "session_not_found" });
        return;
      }
      res.status(500).json({ error: "server_error" });
    }
  });

  const clientDir = path.join(root, "dist", "client");
  app.use(express.static(clientDir, { etag: true, maxAge: "1h" }));

  app.get("*", (_req, res, next) => {
    if (!fs.existsSync(path.join(clientDir, "index.html"))) {
      next();
      return;
    }
    res.sendFile(path.join(clientDir, "index.html"));
  });

  return app;
}

async function main() {
  watchContentInDev();
  const app = createApp(getSteps);
  const port = getPort();

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: "/ws" });
  const signingSecret = getSigningSecret();

  wss.on("connection", async (ws, req) => {
    const host = req.headers.host ?? "localhost";
    const url = new URL(req.url ?? "/", `http://${host}`);
    const sessionCode = url.searchParams.get("session");
    const role = url.searchParams.get("role");
    if (!sessionCode) {
      ws.close(4000, "missing_session");
      return;
    }

    const session = await getSessionByCode(sessionCode);
    if (!session) {
      ws.close(4004, "session_not_found");
      return;
    }

    if (role === "tutor") {
      const steps = getSteps();
      const cookieTok = parseCookies(req.headers.cookie ?? "")[getCookieName()];
      const code = verifyTutorToken(cookieTok, signingSecret);
      if (code !== sessionCode) {
        ws.close(4401, "unauthorized");
        return;
      }
      registerClient(sessionCode, "tutor", ws);
      ws.send(
        JSON.stringify({
          type: "tutor_pointer",
          tutorStepOrder: session.tutorStepOrder,
          tutorStepTitle: titleForOrder(steps, session.tutorStepOrder),
        }),
      );
      const roster = await buildRoster(sessionCode, steps);
      if (roster) {
        ws.send(JSON.stringify({ type: "roster", roster }));
      }
      return;
    }

    const token = url.searchParams.get("token");
    if (!token) {
      ws.close(4001, "missing_token");
      return;
    }
    const student = await findStudentBySessionToken(sessionCode, token);
    if (!student) {
      ws.close(4403, "invalid_token");
      return;
    }

    registerClient(sessionCode, "student", ws);
    const steps = getSteps();
    ws.send(
      JSON.stringify({
        type: "tutor_pointer",
        tutorStepOrder: session.tutorStepOrder,
        tutorStepTitle: titleForOrder(steps, session.tutorStepOrder),
      }),
    );
  });

  server.listen(port, "0.0.0.0", () => {
    const publicUrl = getPublicUrl();
    const hasClient = fs.existsSync(
      path.join(getRepoRoot(), "dist", "client", "index.html"),
    );
    if (publicUrl) {
      const sessionCode = process.env.SEED_SESSION_CODE?.trim() || "cascadia-2026";
      console.log(`Workshop codelab listening on ${publicUrl}`);
      if (hasClient) {
        console.log(`Student: ${publicUrl}/s/${sessionCode}`);
        console.log(`Tutor: ${publicUrl}/tutor/${sessionCode}`);
      }
    } else {
      console.log(`API + WebSocket listening on 0.0.0.0:${port}`);
      if (!hasClient && !isProduction()) {
        console.log(`Build the client (npm run build) or run npm run dev:client for Vite on :5173`);
      }
    }
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
