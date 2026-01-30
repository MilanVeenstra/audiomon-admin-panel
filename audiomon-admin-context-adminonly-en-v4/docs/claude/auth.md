# Authentication + authorization (Admin-only)

## Goal
- You must login as **admin** to access any dashboard page.
- Non-admin users must never enter `/dashboard/**` (redirect to `/login` or `/403`).

## Recommended approach (BFF / proxy via Next.js)
- Use Next.js route handlers to talk to the backend.
- Store the backend token in an **HttpOnly cookie**.

### High-level login flow
1. Client → `POST /api/auth/login` (Next.js)
2. Next.js server → backend `/api/login`
3. Backend → `{ token, role }`
4. Next.js server sets cookies:
   - `am_token` (HttpOnly)
   - `am_role` (can be HttpOnly too)
5. Server redirects to `/dashboard`

## Admin-only gating (critical)
- Middleware must enforce BOTH:
  - token exists
  - role is exactly `"admin"`

If role is `"user"`:
- immediately logout (clear cookies) OR redirect to `/403` + do not allow dashboard entry.

## Backend header
- Send `Authentication: <token>` on every backend call
- Keep a single constant/config so you can switch header name if needed

## Logout behavior
- Clear cookies
- Redirect to `/login`

## Error behavior
- Backend returns `{ error: "Auth failed" }`:
  - clear cookies
  - redirect `/login`
  - show a friendly message
