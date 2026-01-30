# Conventions (keep Claude consistent)

## Tech
- Next.js (prefer App Router)
- TypeScript
- UI: **shadcn/ui** components (preferred)

## Backend base URL
- Use `.env.local`:
  - `BACKEND_BASE_URL=https://audiomonbackend.slicegames.nl`

## Suggested folder structure (App Router)
```
src/
  app/
    (auth)/
      login/
        page.tsx
    (dashboard)/
      dashboard/
        layout.tsx
        page.tsx
        users/
          page.tsx
        statistics/
          page.tsx
        audio/
          page.tsx
    api/
      auth/
        login/route.ts
        logout/route.ts
      proxy/
        ping/route.ts
        users/route.ts
        users/[id]/route.ts
        statistics/route.ts
        audioList/route.ts
        audioDownload/[id]/route.ts
        upload/route.ts
  lib/
    api/
      backendClient.ts
      types.ts
    auth/
      cookies.ts
      requireAdmin.ts
  middleware.ts
```

## Notes
- No `/register` page in the admin panel by default (optional later). Admin accounts can be created/managed out-of-band if needed.

## Backend client
One central wrapper:
- baseUrl + path
- inject auth header (`Authentication` by default)
- JSON helper
- file/binary helper (download)
- upload helper (multipart/base64 depending on contract-check)

## Types
- `LoginResponse { token: string; role: "admin" | "user" }`
- `ApiError { error: string }`
- `User { id: number; username: string; role: "admin" | "user" }`
- `AudioItem { id: number; title: string; artist: string; description?: string; lat: number; lon: number }`
- `Statistics { users: number; tokens: number }`

## Testing
- Use Playwright for E2E tests starting in Phase 6 (or earlier if easy).
