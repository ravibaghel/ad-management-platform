# Phase 3: Advanced Features & Refinements

**Status**: 🚧 In Planning  
**Planned Start**: 2026-04-27+  
**Estimated Duration**: 36-44 hours (MVP: 15-18 hours)

## Overview

Phase 3 adds user management, advanced campaign lifecycle features, filtering/search, and operational polish. Users will be able to use email/password auth, fully manage campaigns throughout their lifecycle, and discover campaigns efficiently.

## High-Priority Features (MVP)

### 1. Email/Password Authentication

**Backend Changes**:
- Create `User` entity (email, password_hash, advertiser_id, created_at)
- Create `UserRepository` with findByEmail
- Update `AuthController`:
  - `POST /api/v1/auth/register` — Create new user account
  - Update `POST /api/v1/auth/login` — Validate email/password against User table
  - Add password hashing with bcrypt
- Create `RefreshToken` entity for token rotation
- Update `JwtService` to handle refresh token flow

**Frontend Changes**:
- Update `LoginPage`:
  - Change advertiser ID field to email input
  - Add password field
  - Add sign-up link
- Create `RegisterPage` (`/register`):
  - Email, password (with confirmation), advertiser name inputs
  - Form validation (email format, password strength)
  - Submit to `POST /api/v1/auth/register`
  - Redirect to login on success
- Update `authStore` to handle refresh tokens (timer to auto-refresh before expiry)

**Estimated**: 6-8 hours

### 2. Campaign Editing & Deletion

**Backend Changes**:
- `PUT /api/v1/campaigns/{id}` — Full update (most fields)
- `DELETE /api/v1/campaigns/{id}` — Soft delete (set deleted_at timestamp)
- Update `CampaignService.update()` with validation (cannot edit ACTIVE campaigns)
- Update `CampaignService.delete()` with ownership check

**Frontend Changes**:
- Update `CampaignsPage`:
  - Add Edit button in each row
  - Add Delete button with confirmation modal
  - Disable edit/delete for ACTIVE/COMPLETED campaigns
- Create `EditCampaignModal`:
  - Similar to CreateCampaignModal but prefilled with existing values
  - Show which fields are editable (not all)
- Create `DeleteConfirmationModal`:
  - Warning message about permanent deletion
  - Show campaign name being deleted
  - Confirm/Cancel buttons
- Update React Query mutations for edit + delete

**Estimated**: 4-5 hours

### 3. Advanced Campaign Filtering

**Backend**: Already supports `?status=X` in GET campaigns

**Frontend Changes**:
- Add filter sidebar or row above campaign table:
  - Status dropdown (select multiple, or single)
  - Date range picker (start date between X and Y)
  - Budget range sliders (min/max total budget)
  - Objective multi-select
- Store filter state in URL query params (`?status=ACTIVE&status=PAUSED&minBudget=100`)
- Bind to `useCampaigns()` hook
- Add "Clear Filters" button
- Add "Saved Filters" (Phase 4)

**Estimated**: 3-4 hours

### 4. Campaign Detail Page

**Routes**: `/campaigns/{id}`

**Backend**: Already have `GET /api/v1/campaigns/{id}`

**Frontend**:
- Show full campaign information in a card/panel layout
- Display status with color badge
- Show timeline: created_at, start_date, end_date
- Display budget breakdown (total, spent, remaining)
- Status transition buttons:
  - Show valid next states based on state machine
  - Click → confirmation dialog → PATCH status endpoint
  - Disable invalid transitions
- Link from campaign table row (click name)
- "Back to list" button
- Edit/Delete actions (use modals from feature #2)
- Placeholder for analytics preview (impressions, clicks, CTR from analytics-service)

**Estimated**: 4-5 hours

### 5. Status Transition UI

**Backend**: CampaignService already validates state machine (see CampaignService:31-39)

**Frontend**:
- In detail page: Status dropdown showing only valid next states
- Confirmation dialog before state change:
  - Old status → New status
  - Show consequences (e.g., "Cannot pause COMPLETED campaign")
- After confirmation: PATCH `/api/v1/campaigns/{id}/status?status=ACTIVE`
- Show success toast with new status

**Estimated**: 2-3 hours (bundled with detail page)

### 6. Optimistic Updates & Error Handling

**React Query Mutations**:
- Add `onMutate` to all mutations (edit, delete, status change)
- Optimistically update cache before server response
- Rollback on error with error toast
- Remove loading spinners (rely on cache updates for perceived speed)

**Error Handling**:
- Global error boundary component
- Toast notifications (success green, error red)
- Per-field validation errors in forms
- Handle 401 (unauthorized) → redirect to login
- Handle 403 (forbidden) → show permission denied
- Handle 400 (validation) → show validation errors
- Show retry buttons on network errors

**Estimated**: 3-4 hours

### 7. Campaign Search

**Backend**:
- Implement full-text search in PostgreSQL
- Endpoint: `GET /api/v1/campaigns/search?q=keyword`
- Search across: name, description fields

**Frontend**:
- Search box at top of campaigns page
- Real-time search (debounced, 300ms)
- Replace table results with search results
- Show "Clear search" button

**Estimated**: 2-3 hours

## Medium-Priority Features (Phase 3+)

### 8. Dashboard Metrics Integration

- Query analytics-service for: active campaigns, total impressions, overall CTR
- Update DashboardPage stat cards with real data
- Add metric sparklines using recharts
- Refresh button or auto-refresh (30 seconds)

**Estimated**: 3-4 hours

### 9. Campaign Duplication

- Backend: `POST /api/v1/campaigns/{id}/duplicate`
- Copy all fields except: id, status (→ DRAFT), timestamps, spent_budget (→ 0)
- Frontend: "Duplicate" button in detail page or table row
- Show notification "Campaign duplicated" with link to new campaign

**Estimated**: 2-3 hours

### 10. Testing Suite

- Unit tests (Jest + react-testing-library)
- Integration tests (React Query hooks)
- E2E tests (Playwright)
- Coverage target: >80% of critical paths

**Estimated**: 6-8 hours

## Lower-Priority / Phase 4

- Campaign analytics page (link to analytics-service)
- A/B testing UI
- Bulk operations (select multiple → batch actions)
- Export to CSV
- Webhooks/notifications on status changes
- Audit logs for compliance
- Multi-language support
- Dark mode

## Known Issues to Address

| Issue | Impact | Solution | Priority |
|-------|--------|----------|----------|
| JWT expiry without refresh | Users logged out after 24h | Implement refresh token rotation | High |
| Concurrent edits | Conflicts if two users edit same campaign | Add version/optimistic lock check | Medium |
| Date timezone confusion | Browser local time vs server UTC | Use UTC with user timezone setting | Medium |
| Mobile UX | Table doesn't work on small screens | Responsive card layout | Low |
| Performance at scale | Pagination insufficient for 100k campaigns | Cursor pagination, indexing | Low |

## Architecture Changes

### New Entities

**User** (PostgreSQL):
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  advertiser_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### New Java Classes

- `User.java` — JPA entity
- `RefreshToken.java` — JPA entity
- `UserRepository.java` — Spring Data JPA
- `UserService.java` — Business logic (register, login, refresh)
- `RegisterRequest.java`, `RefreshTokenRequest.java` — DTOs

### Updated Classes

- `AuthController.java` — Add register + refresh endpoints
- `AuthResponse.java` — Add expires_at field
- `JwtService.java` — Add refresh token logic
- `CampaignService.java` — Add update/delete methods

## Estimated Timeline

| Task | Effort | Hours | Start | End |
|------|--------|-------|-------|-----|
| Email/password auth | High | 6-8 | Day 1 | Day 1-2 |
| Campaign edit/delete | Medium | 4-5 | Day 2 | Day 2 |
| Filtering | Medium | 3-4 | Day 2 | Day 3 |
| Detail page | Medium | 4-5 | Day 3 | Day 3-4 |
| Error handling | Low-Medium | 5-6 | Day 4 | Day 4-5 |
| Testing | High | 6-8 | Day 5 | Day 6-7 |
| **Total** | - | **36-44** | - | **~7 days** |

**MVP (core only)**: 15-18 hours (~2 days intensive work)

## Success Criteria

- [ ] Users can sign up and log in with email/password
- [ ] Users cannot access other users' campaigns
- [ ] Users can fully CRUD campaigns
- [ ] Users can transition campaigns through state machine
- [ ] Users can filter by status, date, budget
- [ ] Users can search campaigns by name
- [ ] All mutations have optimistic updates
- [ ] Error messages are clear and actionable
- [ ] Tests cover happy path + error cases
- [ ] Performance: list 100+ campaigns in <200ms
- [ ] Mobile UI works on <768px screens

## Dependencies

- User service schema (needs design)
- analytics-service documented endpoints (TBD)
- Playwright or Cypress for E2E tests (need setup)
- Design/mockups for detail page (TBD)

## Git Strategy

- Create feature branches: `feat/email-auth`, `feat/campaign-edit`, etc.
- PR review before merge to main
- Commit message format: `feat: description` or `fix: description`
- Tag releases: `v0.2.0` after Phase 3 complete

## Monitoring

Post-Phase 3, monitor:
- JWT refresh failures (track refresh token expiry)
- Campaign mutation errors (failed edits/deletes)
- Search latency (ensure full-text search performant)
- Database query times (ensure indexes sufficient)

## Questions for Clarification

- [ ] Email/password or OAuth (Google, GitHub)?
- [ ] Should refresh tokens be stored in httpOnly cookies or localStorage?
- [ ] Soft delete or hard delete for campaigns?
- [ ] Should deleted campaigns be recoverable by admins?
- [ ] Multi-user collaboration on campaigns?
- [ ] Audit logging required for compliance?
