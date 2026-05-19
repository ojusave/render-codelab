# Live Workshop Codelab

Session-based workshop app for in-person events: students follow Markdown steps, tutors drive pace and watch progress. **Designed to run on Render** as one Web Service plus managed Postgres.

## Deploy on Render

Repo: [github.com/ojusave/render-codelab](https://github.com/ojusave/render-codelab)

**Blueprint (Web + Postgres):**

[Create Blueprint from repo](https://dashboard.render.com/blueprint/new?repo=https://github.com/ojusave/render-codelab)

1. Click the link → connect GitHub → branch `main`.
2. Set **`TUTOR_PASSWORD`** when prompted (only manual secret).
3. Click **Apply**. Render creates:
   - **Postgres** `workshop-codelab-db`
   - **Web** `workshop-codelab`
4. Build runs on Render (`npm install --include=dev && npm run build`).
5. **Pre-deploy** runs compiled migrations + seed (`node dist/server/cli/*.js`).
6. **Start** runs `node dist/server/index.js` on `PORT` (set by Render).

After deploy, open your `*.onrender.com` URL:

| Role | Path |
|------|------|
| Landing | `/` |
| Student | `/s/cascadia-2026` |
| Tutor | `/tutor/cascadia-2026` |

Health check: `GET /healthz` → `ok`

### Environment variables (Render)

| Variable | Set by |
|----------|--------|
| `DATABASE_URL` | Blueprint → Postgres `workshop-codelab-db` |
| `PORT` | Render (required in production) |
| `RENDER_EXTERNAL_URL` | Render (public URL; logged at startup) |
| `SESSION_SIGNING_SECRET` | Blueprint `generateValue: true` |
| `TUTOR_PASSWORD` | You, at Blueprint apply |
| `VITE_GITHUB_REPO_URL` | Blueprint (build-time, Deploy/GitHub links) |
| `VITE_DEFAULT_SESSION_CODE` | Blueprint (`cascadia-2026`) |
| `SEED_SESSION_CODE` | Blueprint (`cascadia-2026`) |

Redeploy after editing Markdown under `content/` (loaded at server startup in production).

## Features

- **Students** (`/s/:sessionCode`): name + progress in browser storage; step nav, Markdown, Done / Stuck, live tutor pointer.
- **Tutor** (`/tutor/:sessionCode`): password gate; roster, pointer controls.
- **Content**: `content/NN-*.md` with frontmatter `order`, `title`, optional `duration`.

## Workshop content

11 steps: **workshop-demo** → **ticker-research-workflows** with [Render Workflows](https://render.com/docs/workflows). See `docs/content-schema.md` for the author contract.

## Add or change steps

1. Add `content/NN-your-step.md` with frontmatter (`order`, `title`).
2. Commit and push → Render redeploys the web service.

## Run locally (optional)

Local dev mirrors production but uses Vite for hot reload. Requires Postgres and a `.env` file.

```bash
cp .env.example .env
# Set DATABASE_URL, TUTOR_PASSWORD, SESSION_SIGNING_SECRET

npm install
npm run build
npm run db:migrate
npm run db:seed
npm run dev
```

- UI: http://localhost:5173 (proxies `/api` and `/ws` to the API)
- API-only (production-like): `npm run build && PORT=8787 npm start` → http://localhost:8787

## Stack

- **Runtime on Render**: Node 22, Express, compiled server + static client in `dist/`
- **Database**: Render Postgres, Drizzle ORM
- **Client build**: Vite (build time only on Render, not a dev server in production)
- **Realtime**: WebSocket `/ws` on the same service

## License

MIT.
