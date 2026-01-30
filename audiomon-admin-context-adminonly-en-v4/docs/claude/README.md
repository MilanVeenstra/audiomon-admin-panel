# Claude context pack — AudioMon Admin Panel (Next.js)

Drop this folder into your Next.js project (e.g. `./docs/claude/`).  
Goal: give Claude Code enough context to build an **admin-only** dashboard **step-by-step**, based on the AudioMon backend.

## Backend base URL
- `https://audiomonbackend.slicegames.nl`

## IMPORTANT RULE
- **Only admins may access the dashboard.**
- Non-admin users must never be able to enter `/dashboard/**`.

## Allowed tools (you may use these)
Claude may use these MCP servers/tools where helpful:
- **Context7** (quick docs / API references)
- **Playwright** (E2E tests and test criteria)
- **Next.js** (framework conventions)
- **shadcn/ui** (UI components)

## Files
- `api.md` — API contract (endpoints, payloads, responses) + contract-check list
- `auth.md` — authentication + authorization (token/role, admin-only gating, cookies)
- `ui.md` — admin UI pages + components (what to build)
- `phases.md` — phases (small increments) + test criteria per phase
- `conventions.md` — conventions (Next.js structure, error handling, types, shadcn)

## Quick start (what to read first)
1. `README.md`
2. `phases.md` (order + test criteria)
3. `conventions.md` (keep structure consistent)
4. Then read the phase-specific docs (see below)

## Which file to read when (per phase)
- **Phase 0:** `api.md` (contract-check) + `conventions.md` + `phases.md`
- **Phase 1:** `auth.md` + `api.md` (login) + `conventions.md`
- **Phase 2:** `auth.md` (admin-only middleware) + `conventions.md`
- **Phase 3:** `api.md` (admin users) + `ui.md` (users page) + `conventions.md`
- **Phase 4:** `api.md` (statistics) + `ui.md` (statistics page)
- **Phase 5:** `api.md` (audio endpoints) + `ui.md` (audio page)
- **Phase 6:** `auth.md` + `conventions.md` (hardening + Playwright tests)

## Workflow requirement
- Work strictly phase-by-phase (small increments).
- Stop after each phase and validate the test criteria in `phases.md`.
- After each phase, list:
  1) Files changed (with paths)
  2) Key code snippets only
  3) How to test locally (commands + clicks)
  4) Phase test criteria checklist (met / not met)
