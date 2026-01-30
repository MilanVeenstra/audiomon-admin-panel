# API contract (AudioMon Backend)

Base URL:
- `https://audiomonbackend.slicegames.nl`

> Source: your endpoint summary.

## Debug
- Debug client: `/debug` (simple UI to call the API)

## Ping
- `GET /api/ping` → `{
  "ping": "pong"
}`

## Auth (no authentication required)
### Register
- Route: `GET /api/register`
- Input: `username`, `password`
- Success: `{
  "token": "abcdefghijklmnopqrstuvwxyz",
  "role": "admin"
}`
- Error: `{
  "error": "This username is already in use"
}`

### Login
- Route: `GET /api/login`
- Input: `username`, `password`
- Success: `{
  "token": "abcdefghijklmnopqrstuvwxyz",
  "role": "user"
}`
- Error: `{
  "error": "This username and password combination couldn't be found"
}`

## Authentication mechanism
- After login/register you receive a `token`.
- For protected routes send a header:
  - **Header name:** `Authentication`
  - **Value:** `<token>`
- If authentication fails:
  - `{
    "error": "Auth failed"
  }`

## Routes (authenticated user)
> Even though these are listed as "user" routes, in this project **we will only expose them in the dashboard for admins** (admin-only UI).
### Upload audio
- `GET /api/upload`
- Expects: `title`, `artist`, `lat`, `lon`, `audio`, optional `description`
- Success: `{
  "success": "Audio saved"
}`
> Confirm upload format for `audio` (multipart vs base64) in Phase 0.

### Audio list
- `GET /api/audioList` → list of audio items (see example in your summary)

### Audio download
- `GET /api/audioDownload/:id` → binary audio file

## Routes (admin)
### Users list
- `GET /api/admin/user`

### Toggle user role
- `PUT /api/admin/user/:userid`

### Delete user
- `DELETE /api/admin/user/:userid`

### Statistics
- `GET /api/admin/statistics`

## Contract-check list (verify first)
1. Are the HTTP methods correct? (register/login/upload are listed as GET)
2. For GET credentials: are they query params, body, or both?
3. Upload format for `audio`: multipart, base64, or something else?
4. Download headers/content-type (so the browser downloads correctly)
5. Is the header strictly `Authentication`, or does it also accept `Authorization: Bearer ...`?
