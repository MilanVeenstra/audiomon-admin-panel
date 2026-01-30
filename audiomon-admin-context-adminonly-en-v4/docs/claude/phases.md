# Phase plan (admin-only) + test criteria

## Phase 0 — Contract check + skeleton
**Read before**
- `api.md` (contract-check)
- `conventions.md`

**Deliverable**
- `.env.local` contains:
  - `BACKEND_BASE_URL=https://audiomonbackend.slicegames.nl`
- Next.js proxy route:
  - `/api/proxy/ping` → calls backend `GET /api/ping`
- Placeholder pages:
  - `/login`
  - `/dashboard` (still protected, may show dummy once logged in)

**Test criteria**
- Calling `/api/proxy/ping` returns `{
  "ping": "pong"
}`
- There is **one** config place to switch header name (`Authentication` vs `Authorization`)
- Using `/debug` or curl you confirmed:
  - how login/register credentials must be sent (query/body)
  - how upload expects `audio` (multipart/base64)
  - how downloads behave (content-type/headers)

---

## Phase 1 — Admin login + cookie session + logout
**Read before**
- `auth.md`
- `api.md` (login)

**Deliverable**
- `/login` form calls Next.js `POST /api/auth/login`
- Route handler calls backend `https://audiomonbackend.slicegames.nl/api/login`
- On success:
  - set cookies `am_token` + `am_role`
  - redirect to `/dashboard`
- Add `/api/auth/logout` to clear cookies

**Test criteria**
- Logging in with a known **admin** account:
  - creates `am_token` (HttpOnly)
  - creates `am_role=admin`
  - `/dashboard` loads
- Wrong credentials show friendly error
- Logout clears cookies and redirects to `/login`

---

## Phase 2 — Admin-only middleware (no users allowed)
**Read before**
- `auth.md`
- `conventions.md`

**Deliverable**
- Middleware blocks ALL `/dashboard/**` unless:
  - `am_token` exists AND `am_role === "admin"`
- If role is `user`:
  - deny access (redirect `/403` or logout + redirect `/login`)

**Test criteria**
- No cookie → `/dashboard` redirects to `/login`
- `am_role=user` (manually set or via login) → `/dashboard` denied
- `am_role=admin` → dashboard accessible

---

## Phase 3 — Admin: User management
**Read before**
- `api.md` (admin endpoints)
- `ui.md`
- `conventions.md`

**Deliverable**
- `/dashboard/users` page:
  - list: `GET /api/admin/user`
  - toggle: `PUT /api/admin/user/:id`
  - delete: `DELETE /api/admin/user/:id`
- All calls go through Next.js proxy route handlers (server-side), not directly from the browser

**Test criteria**
- List shows id/username/role
- Toggle role works and updates UI
- Delete works and updates UI
- If backend responds `Auth failed`:
  - cookies cleared
  - redirect to `/login`

---

## Phase 4 — Admin: Statistics
**Read before**
- `api.md`
- `ui.md`

**Deliverable**
- `/dashboard/statistics` shows cards for `users` and `tokens`
- Data via `GET /api/admin/statistics` through proxy

**Test criteria**
- Values match backend response
- Loading + error states exist

---

## Phase 5 — Admin: Audio (list + download + upload)
**Read before**
- `api.md`
- `ui.md`

**Deliverable**
- `/dashboard/audio`:
  - list via `GET /api/audioList`
  - download via `GET /api/audioDownload/:id`
  - upload via `GET /api/upload` (method/format confirmed earlier)

**Test criteria**
- List renders correctly
- Download saves a usable audio file
- Upload shows “Audio saved” and refreshes list (if applicable)

---

## Phase 6 (optional) — Hardening + Playwright E2E
**Read before**
- `auth.md`
- `conventions.md`

**Deliverable**
- Playwright E2E tests:
  - admin can login and view `/dashboard/users`
  - non-admin cannot access any dashboard page
- UX polish with shadcn/ui components

**Test criteria**
- `pnpm test:e2e` (or equivalent) passes
- Admin-only gating cannot be bypassed via direct URL navigation
