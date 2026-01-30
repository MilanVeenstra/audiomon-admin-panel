# AudioMon Admin Panel - Architecture Guide

## 📁 Directory Structure

### Root Level
```
audiomon-admin-panel/
├── app/                          # Next.js App Router (main application code)
├── components/                   # Reusable UI components (shadcn/ui)
├── lib/                          # Utility functions and helpers
├── audiomon-admin-context.../   # Documentation folder
├── .env.local                    # Environment variables (backend URL)
├── middleware.ts                 # Auth middleware (protects /dashboard)
├── package.json                  # Dependencies
└── tailwind.config.ts            # Tailwind CSS configuration
```

---

## 📂 `/app` - Application Routes & Pages

This is where ALL your pages and API routes live (Next.js App Router).

### Route Groups (folders in parentheses don't appear in URL)

#### `(auth)/` - Authentication pages
```
app/(auth)/
└── login/
    └── page.tsx          # Login page at /login
```

#### `(dashboard)/` - Protected admin pages
```
app/(dashboard)/
└── dashboard/
    ├── page.tsx          # Main dashboard at /dashboard
    ├── users/
    │   └── page.tsx      # User management at /dashboard/users
    ├── statistics/
    │   └── page.tsx      # Statistics at /dashboard/statistics
    └── audio/
        └── page.tsx      # Audio management at /dashboard/audio
```

#### `api/` - Backend proxy routes (server-side)
```
app/api/
├── auth/
│   ├── login/
│   │   └── route.ts      # POST /api/auth/login (handles login)
│   └── logout/
│       └── route.ts      # POST /api/auth/logout (clears cookies)
├── proxy/
│   ├── ping/
│   │   └── route.ts      # GET /api/proxy/ping (test endpoint)
│   ├── admin/
│   │   ├── user/
│   │   │   ├── route.ts           # GET /api/proxy/admin/user (list users)
│   │   │   └── [id]/
│   │   │       └── route.ts       # PUT/DELETE /api/proxy/admin/user/:id
│   │   └── statistics/
│   │       └── route.ts           # GET /api/proxy/admin/statistics
│   └── audio/
│       ├── list/
│       │   └── route.ts           # GET /api/proxy/audio/list
│       ├── download/
│       │   └── [id]/
│       │       └── route.ts       # GET /api/proxy/audio/download/:id
│       └── upload/
│           └── route.ts           # POST /api/proxy/audio/upload
```

**What's in each route.ts?**
- `route.ts` files are API endpoints (like Express.js routes)
- They export functions: `GET`, `POST`, `PUT`, `DELETE`
- They run on the server (not in the browser)

---

## 📂 `/lib` - Shared Utilities

Reusable code that doesn't belong to specific pages.

```
lib/
├── api/
│   ├── config.ts         # API configuration (backend URL, header names)
│   ├── types.ts          # TypeScript interfaces (User, AudioItem, etc.)
│   └── backendClient.ts  # Functions to call backend API
└── auth/
    └── cookies.ts        # Cookie management (set, get, clear tokens)
```

**What's in each file?**
- `config.ts` - Central config (can switch between "Authentication" or "Authorization" header)
- `types.ts` - TypeScript interfaces for type safety
- `backendClient.ts` - Helper functions like `backendGet()`, `backendPost()`
- `cookies.ts` - Functions to manage HttpOnly cookies (am_token, am_role)

---

## 📂 `/components` - UI Components

Reusable shadcn/ui components.

```
components/ui/
├── button.tsx           # Button component
├── card.tsx             # Card component
├── input.tsx            # Input component
├── label.tsx            # Label component
├── table.tsx            # Table component
├── badge.tsx            # Badge component
├── separator.tsx        # Separator line
└── alert-dialog.tsx     # Alert dialog
```

**What are these?**
- Pre-built, styled, accessible UI components
- From shadcn/ui library
- Import and use in your pages: `import { Button } from "@/components/ui/button"`

---

## 🔄 Backend Flow - How Requests Travel

### Architecture: BFF (Backend for Frontend) Pattern

Your Next.js app acts as a **proxy** between the browser and the AudioMon backend.

```
Browser (Client)  →  Next.js Proxy (Server)  →  AudioMon Backend
                  ←                           ←
```

**Why?**
1. **Security**: Token stored in HttpOnly cookies (browser can't access via JavaScript)
2. **No CORS issues**: Browser never talks directly to backend
3. **Centralized auth**: All requests go through one place
4. **Hidden backend**: Backend URL never exposed to client

---

### Example Flow: Login

Let's trace what happens when you login:

#### 1. **Browser → Next.js**
```
User clicks "Sign in" button
  ↓
POST /api/auth/login
{
  "username": "admin",
  "password": "pass123"
}
```

#### 2. **Next.js receives request** (`app/api/auth/login/route.ts`)
```typescript
export async function POST(request: NextRequest) {
  // 1. Get username/password from request
  const { username, password } = await request.json();

  // 2. Call backend...
```

#### 3. **Next.js → Backend**
```
POST https://audiomonbackend.slicegames.nl/api/login
Body: { "username": "admin", "password": "pass123" }
```

#### 4. **Backend responds**
```json
{
  "token": "abc123xyz789",
  "role": "admin"
}
```

#### 5. **Next.js processes response** (still in `route.ts`)
```typescript
  // 3. Backend responded with token and role
  const { token, role } = response;

  // 4. Store in HttpOnly cookies
  await setAuthCookies(token, role);

  // 5. Send success to browser
  return NextResponse.json({ success: true, role });
}
```

#### 6. **Browser receives success**
```typescript
// In login page.tsx
const response = await fetch("/api/auth/login", { ... });

if (response.ok) {
  // Cookies are automatically stored by browser
  router.push("/dashboard");  // Redirect to dashboard
}
```

#### 7. **Middleware checks cookies**
```typescript
// middleware.ts runs BEFORE dashboard page loads
export function middleware(request: NextRequest) {
  const token = request.cookies.get("am_token");
  const role = request.cookies.get("am_role");

  if (!token || role !== "admin") {
    // Redirect to login
    return NextResponse.redirect("/login");
  }

  // Allow access
  return NextResponse.next();
}
```

---

### Example Flow: Fetching Users List

#### 1. **Browser loads `/dashboard/users` page**
```typescript
// In app/(dashboard)/dashboard/users/page.tsx
useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {
  const response = await fetch("/api/proxy/admin/user");
  const data = await response.json();
  setUsers(data);
};
```

#### 2. **Next.js proxy receives request** (`app/api/proxy/admin/user/route.ts`)
```typescript
export async function GET() {
  // 1. Get token from cookies (server can read HttpOnly cookies)
  const token = await getAuthToken();  // From cookies.ts

  // 2. Call backend with token...
```

#### 3. **Next.js → Backend**
```
GET https://audiomonbackend.slicegames.nl/api/admin/user
Headers:
  Authentication: abc123xyz789
```

#### 4. **Backend responds**
```json
[
  { "id": 1, "username": "admin", "role": "admin" },
  { "id": 2, "username": "john", "role": "user" }
]
```

#### 5. **Next.js forwards to browser**
```typescript
  // 3. Return data to browser
  return NextResponse.json(data);
}
```

#### 6. **Browser displays users**
```typescript
// Back in page.tsx
setUsers(data);  // State updates, table renders
```

---

## 🔐 Security: Cookie Flow

### How Cookies Work

```
Login Success
  ↓
Next.js Server sets cookies:
  - am_token (HttpOnly, Secure, SameSite)
  - am_role (HttpOnly, Secure, SameSite)
  ↓
Browser stores cookies automatically
  ↓
Every request to Next.js includes cookies
  ↓
Next.js reads cookies (server-side only)
  ↓
Next.js adds token to backend request
```

**HttpOnly = JavaScript can't read it**
- Prevents XSS attacks
- Only server can access

**Secure = Only sent over HTTPS**
- Production security

**SameSite = Only sent to same domain**
- Prevents CSRF attacks

---

## 🛡️ Middleware Protection

`middleware.ts` runs **before** every page load:

```typescript
export function middleware(request: NextRequest) {
  // Check if user is going to /dashboard/**
  if (pathname.startsWith("/dashboard")) {
    // Check cookies
    const token = request.cookies.get("am_token");
    const role = request.cookies.get("am_role");

    // No token? → Redirect to login
    if (!token || !role) {
      return NextResponse.redirect("/login");
    }

    // User role? → Redirect to login + clear cookies
    if (role !== "admin") {
      const response = NextResponse.redirect("/login");
      response.cookies.delete("am_token");
      response.cookies.delete("am_role");
      return response;
    }

    // Admin role → Allow access
    return NextResponse.next();
  }

  // Not a dashboard route → Allow
  return NextResponse.next();
}
```

---

## 📊 Data Flow Diagram

### Full Request Cycle

```
┌──────────────┐
│   Browser    │
│  (Client)    │
└──────┬───────┘
       │ 1. User clicks button
       ↓
┌──────────────┐
│ React Page   │  (app/(dashboard)/dashboard/users/page.tsx)
│ (Client)     │
└──────┬───────┘
       │ 2. fetch("/api/proxy/admin/user")
       ↓
┌──────────────┐
│ Next.js API  │  (app/api/proxy/admin/user/route.ts)
│ Route        │  [RUNS ON SERVER]
│ (Server)     │
└──────┬───────┘
       │ 3. Gets token from cookies
       │ 4. Calls backend with token
       ↓
┌──────────────┐
│ AudioMon     │  https://audiomonbackend.slicegames.nl
│ Backend      │
│ (External)   │
└──────┬───────┘
       │ 5. Returns data
       ↓
┌──────────────┐
│ Next.js API  │
│ Route        │  6. Forwards data
│ (Server)     │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ React Page   │  7. Displays data
│ (Client)     │
└──────────────┘
```

---

## 🎯 Key Concepts

### 1. **Client vs Server**
- **Client**: Runs in browser (React components, useState, useEffect)
- **Server**: Runs on Next.js server (API routes, middleware, cookies)

### 2. **Route Handlers (route.ts)**
- API endpoints that run on the server
- Can access cookies, environment variables
- Talk to external APIs
- Like Express.js routes

### 3. **Pages (page.tsx)**
- React components
- Run in the browser
- Use fetch() to call your API routes
- Cannot read HttpOnly cookies directly

### 4. **Middleware**
- Runs before every request
- Can redirect, modify headers, check auth
- Protects routes

### 5. **Proxy Pattern**
- Next.js sits between browser and backend
- Adds security layer
- Centralizes auth logic
- Hides backend details

---

## 📝 Quick Reference

### To add a new page:
1. Create `app/(dashboard)/dashboard/newpage/page.tsx`
2. Access at `/dashboard/newpage`
3. Automatically protected by middleware

### To add a new API endpoint:
1. Create `app/api/proxy/myendpoint/route.ts`
2. Export `GET`, `POST`, etc. functions
3. Call from pages: `fetch("/api/proxy/myendpoint")`

### To call backend:
```typescript
// In route.ts (server-side)
import { backendGet } from "@/lib/api/backendClient";
import { getAuthToken } from "@/lib/auth/cookies";

export async function GET() {
  const token = await getAuthToken();
  const data = await backendGet("/api/admin/user", token);
  return NextResponse.json(data);
}
```

### To manage cookies:
```typescript
// In route.ts
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";

// Set cookies
await setAuthCookies(token, role);

// Clear cookies
await clearAuthCookies();
```

---

## 🔍 File Type Guide

| Extension | Purpose | Example |
|-----------|---------|---------|
| `.tsx` | React component (with JSX) | `page.tsx` |
| `.ts` | TypeScript (no JSX) | `route.ts`, `cookies.ts` |
| `.css` | Styles | `globals.css` |
| `.json` | Config/data | `package.json` |
| `.md` | Documentation | `README.md` |

---

## 🎓 Learning Tips

1. **Follow a request**: Pick any feature and trace it from button click → API route → backend → response
2. **Check the console**: Browser DevTools shows fetch requests
3. **Check the terminal**: Next.js server logs show API route calls
4. **Read the code**: Start from `page.tsx`, follow the fetch, find the `route.ts`
5. **Modify and test**: Change a response in `route.ts`, see it in the browser

---

## 🚀 Next Steps

Want to understand more?
- Read `app/api/auth/login/route.ts` - See how login works
- Read `middleware.ts` - See how auth protection works
- Read `lib/api/backendClient.ts` - See how backend calls work
- Read any `page.tsx` - See how pages fetch data

Questions? Just ask! 🎉
