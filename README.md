# AudioMon Admin Panel

Admin-only dashboard for AudioMon, built with Next.js (App Router) + TypeScript.

## Backend
- Base URL: `https://audiomonbackend.slicegames.nl`
- Authentication: Token-based with role-based access control
- **Only admin users can access the dashboard**

## Tech Stack
- Next.js 15+ (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui (to be added)

## Development

### Install dependencies
```bash
npm install
```

### Run dev server
```bash
npm run dev
```

### Environment Variables
Create `.env.local` with:
```env
BACKEND_BASE_URL=https://audiomonbackend.slicegames.nl
```

## Project Status
Currently at **Phase 0** - Project skeleton and basic structure.

See `CONTRACT_CHECK.md` for backend API verification plan before implementing auth in Phase 1.

## Documentation
Full project context and phase plan in `audiomon-admin-context-adminonly-en-v4/docs/claude/`
