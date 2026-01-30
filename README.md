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
- shadcn/ui

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


