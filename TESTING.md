# Phase 2 Testing Guide

## Current Setup
✅ **Infrastructure running**:
- PostgreSQL on localhost:5432
- Redis on localhost:6379
- Frontend ready to start

## How to Test Phase 2

### Option 1: Frontend UI Testing (Recommended)

**Terminal 1: Start Frontend**
```bash
cd frontend
npm run dev
```
Navigate to: http://localhost:5173

**Test Flow:**

1. **Login Page UI**
   - ✅ Should see "AdTech Platform" title
   - ✅ Advertiser ID input field
   - ✅ "Sign In" button
   - ✅ Demo message at bottom

2. **Form Validation** (without backend)
   - Leave field empty → try to submit → error message
   - Enter "test-advertiser" → submit button should work (will fail on backend call)

3. **Component Structure**
   - ✅ Protected routes are in place (code structure)
   - ✅ All components exist and mount
   - ✅ Sidebar layout with logout button
   - ✅ Campaign table structure

### Option 2: API Testing (Requires Backend)

Since Docker build is having issues with the backend, you have these options:

**Option A: Build Backend Locally**
```bash
cd services/campaign-service

# If you have Gradle installed:
gradle bootRun

# Or with Java installed (slower):
java -version
```

**Option B: Test via API Manual Calls**
Once backend is running on :8080:

```bash
# Test 1: Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"advertiserId":"test-advertiser-1"}'

# Expected: 200 OK with token

# Test 2: List campaigns (no token → should fail)
curl http://localhost:8080/api/v1/campaigns

# Expected: 401 Unauthorized

# Test 3: List campaigns (with token)
curl -H "Authorization: Bearer <TOKEN_FROM_TEST_1>" \
  http://localhost:8080/api/v1/campaigns

# Expected: 200 OK with empty list
```

### Option 3: Quick Frontend-Only Test (No Backend)

```bash
cd frontend
npm run dev
```

Then in browser at http://localhost:5173:

1. **Inspect Components**:
   - Open DevTools (F12)
   - Elements tab → look for React components
   - Verify: LoginPage, Layout, CampaignsPage exist

2. **Check localStorage** (Application tab):
   - Should be empty on first load
   - Simulate login by manually adding token:
     ```js
     localStorage.setItem('jwt', 'test-token-123')
     localStorage.setItem('advertiserId', 'test-user')
     ```
   - Refresh → should bypass login page ✅

3. **Test Routing**:
   - http://localhost:5173/login → Login page ✅
   - http://localhost:5173/campaigns (no auth) → Redirect to /login ✅
   - After setting localStorage → http://localhost:5173/campaigns → Should show empty campaign list ✅

## Backend Build Fix

If you need to get backend running, create this gradlew on Windows:

**File**: `services/campaign-service/gradlew.bat`

```batch
@echo off
setlocal
where gradle >nul 2>&1
if %errorlevel% equ 0 (
    gradle %*
) else (
    echo Gradle not found. Please install Gradle or run from Docker.
    exit /b 1
)
endlocal
```

Then:
```bash
cd services/campaign-service
gradlew.bat bootRun
```

## Test Checklist

### Frontend Rendering ✅
- [ ] LoginPage renders without errors
- [ ] Form inputs are present
- [ ] "Sign In" button is clickable
- [ ] Tailwind colors applied (blue primary button)
- [ ] No console errors (F12 → Console tab)

### State Management ✅
- [ ] authStore created and exports useAuth hook
- [ ] localStorage is readable/writable
- [ ] useAuth hook returns correct shape:
  ```js
  { token, advertiserId, isAuthenticated, setAuth, logout }
  ```

### Routing ✅
- [ ] Protected routes redirect unauthenticated users to /login
- [ ] Login page is accessible at /login
- [ ] Dashboard/Campaigns routes exist (scaffolded)

### Form Validation ✅
- [ ] Empty advertiser ID shows error
- [ ] Valid input allows submit button
- [ ] Zod schema properly rejects invalid data

### Components ✅
- [ ] LoginPage component renders
- [ ] Layout component renders
- [ ] CampaignsPage component renders
- [ ] CreateCampaignModal exists (hidden by default)
- [ ] CampaignStatusBadge renders with correct colors
- [ ] ProtectedRoute wrapper works

## Code Review Points

Since full E2E may not work due to Docker build issues, review the code:

**Backend**: Open these files and verify syntax/logic:
```
services/campaign-service/src/main/java/com/adtech/campaign/
├── controller/AuthController.java ← Check login endpoint
├── dto/LoginRequest.java ← Check DTO structure
├── dto/AuthResponse.java ← Check response shape
└── config/JwtService.java ← Already existed, verify it's used
```

**Frontend**: Open these files and verify:
```
frontend/src/
├── store/authStore.ts ← Verify Zustand usage
├── hooks/useAuth.ts ← Verify hook implementation
├── pages/LoginPage.tsx ← Verify form handling
├── components/campaigns/CreateCampaignModal.tsx ← Verify modal
├── hooks/useCampaigns.ts ← Verify React Query
└── types/schemas.ts ← Verify zod schemas
```

## What Works Without Backend

✅ Frontend renders (no API calls)
✅ Form validation (zod schemas)
✅ Component structure (all exist)
✅ Routing (protected routes configured)
✅ Styling (Tailwind applied)
✅ localStorage (persist auth state)

## What Needs Backend

❌ Auth login endpoint
❌ Campaign creation/listing
❌ Database queries
❌ JWT validation
❌ Status code responses

## Workaround: Test with Mock API

Create mock responses in `frontend/src/services/api.ts`:

```ts
// Add after import statements
const MOCK_MODE = true

if (MOCK_MODE) {
  campaignApi.interceptors.response.use(config => {
    // Mock auth login
    if (config.url?.includes('/auth/login')) {
      return Promise.resolve({
        data: { token: 'mock-jwt', advertiserId: config.data.advertiserId },
        status: 200
      })
    }
    // Mock campaign list
    if (config.url?.includes('/campaigns')) {
      return Promise.resolve({
        data: { content: [], page: 0, totalPages: 0, totalElements: 0 },
        status: 200
      })
    }
    return config
  })
}
```

Then test full flow in browser!

## Next Steps

1. **Option A**: Fix backend build (create gradlew, use local Gradle/Java)
2. **Option B**: Add mock API responses to test frontend fully
3. **Option C**: Just review code structure and run `npm run build` to verify no TypeScript errors

Which would you prefer?
