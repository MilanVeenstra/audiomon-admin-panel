# Admin UI scope (what we build)

## Pages (admin-only)
1. `/login`
   - username + password
   - on success: redirect `/dashboard`
2. `/dashboard` (landing)
   - overview + links
3. `/dashboard/users`
   - list users
   - actions: toggle role, delete user
4. `/dashboard/statistics`
   - show `users` and `tokens`
5. `/dashboard/audio`
   - list audio items
   - download audio
   - upload audio

## Components (shadcn-friendly)
- `AuthForm`
- `DashboardShell` (sidebar + topbar)
- `DataTable`
- `ConfirmDialog`
- `Toast/Alert`
- `LoadingState`

## Permissions (strict)
- Only admins can access any dashboard route.
- If a non-admin logs in, do NOT allow dashboard access.
