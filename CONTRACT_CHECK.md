# Backend API Contract Check Plan

This document outlines what needs to be verified about the backend API before implementing auth and upload features.

## Base URL
- https://audiomonbackend.slicegames.nl

## Items to Verify

### 1. HTTP Methods ✅ VERIFIED
The API docs list register/login/upload as `GET`, which is unusual:
- [ ] **Register**: Confirm if truly `GET /api/register` or should be `POST`
- [x] **Login**: ✅ CONFIRMED - It's `POST /api/login` (docs were incorrect)
  - Works with JSON body: `{"username": "x", "password": "y"}`
  - Also works with query params: `?username=x&password=y`
- [ ] **Upload**: Confirm if truly `GET /api/upload` or should be `POST`

### 2. Credential Format (Register/Login)
Since these are listed as GET requests, need to verify:
- [ ] Are credentials sent as **query parameters**? (e.g., `?username=x&password=y`)
- [ ] Are they sent in **request body** (would be unusual for GET)
- [ ] Is it actually POST with body?

**Test approach:**
```bash
# Try as GET with query params
curl "https://audiomonbackend.slicegames.nl/api/login?username=test&password=test"

# Or use the /debug endpoint to test
```

### 3. Upload Format
- [ ] How is the `audio` field sent?
  - **Multipart form-data** (standard for file uploads)
  - **Base64 encoded** in JSON
  - Other format?

**Test approach:**
```bash
# Test with /debug endpoint or curl with different formats
```

### 4. Download Behavior
- [ ] What `Content-Type` header does `/api/audioDownload/:id` return?
- [ ] Does it include `Content-Disposition` header for browser downloads?
- [ ] What audio format? (mp3, wav, etc.)

**Test approach:**
```bash
curl -I "https://audiomonbackend.slicegames.sl/api/audioDownload/1"
```

### 5. Authentication Header
- [ ] Confirm header name is strictly `Authentication` (not `Authorization`)
- [ ] Confirm format is just the token value (not `Bearer <token>`)
- [ ] Does backend also accept `Authorization: Bearer <token>`?

**Test approach:**
```bash
# After getting a token from login, test both formats
curl -H "Authentication: <token>" https://audiomonbackend.slicegames.nl/api/audioList
curl -H "Authorization: Bearer <token>" https://audiomonbackend.slicegames.nl/api/audioList
```

## Testing Tools

### Option 1: Backend /debug Endpoint
The backend has a `/debug` endpoint with a simple UI to test all endpoints.

### Option 2: curl Commands
Test directly with curl as shown above.

### Option 3: Postman/Insomnia
Import the API and test interactively.

## Next Steps
- Complete this verification in Phase 0 (before implementing auth in Phase 1)
- Update this checklist with findings
- Adjust implementation based on actual API behavior
