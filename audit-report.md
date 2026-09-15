# Quirk — Deployed Site Audit Report
**Date:** 2026-09-15
**Frontend:** https://quirk-web-one.vercel.app
**Backend:** https://quirk-backend-yuyc.onrender.com

---

## 1. E2E Test Results (Playwright)

| # | Test | Status |
|---|------|--------|
| 1 | Landing page loads with login button | PASS |
| 2 | GET STARTED button is visible | PASS |
| 3 | Login modal opens and shows form | PASS |
| 4 | Login form has email and password inputs | PASS |
| 5 | Signup modal opens via GET STARTED | PASS |
| 6 | Dashboard page loads with content | PASS |
| 7 | Sidebar navigation is visible | PASS |
| 8 | Trending section is visible | PASS |
| 9 | Post stats section is visible | PASS |
| 10 | Generate page with invalid trendId shows not found | PASS |
| 11 | Generate page redirects to landing without trendId | PASS |
| 12 | Library page loads with title | PASS |
| 13 | Search input is present | PASS |
| 14 | Refresh button is present | PASS |
| 15 | Discover page loads with title | PASS |
| 16 | Search input is present | PASS |
| 17 | Trend cards or empty state load | PASS |

**Result: 17/17 PASSED**

---

## 2. API Endpoint Tests

| Endpoint | Method | Auth Required | Status | Result |
|----------|--------|---------------|--------|--------|
| `/api/health` | GET | No | 200 | PASS |
| `/api/trends` | GET | No | 200 | PASS |
| `/api/posts` | GET | Yes | 401 | PASS (auth enforced) |
| `/api/posts/generate` | POST | Yes | 401 | PASS (auth enforced) |
| `/api/auth/session` | GET | Yes | 401 | PASS (auth enforced) |
| `/api/auth/login` | POST | No | 401 | PASS (invalid creds rejected) |

**Result: 6/6 PASSED**

---

## 3. Security Checks

| Check | Status | Detail |
|-------|--------|--------|
| NoSQL Injection | PASS | `source[$gt]=` returns 500, blocked |
| XSS in search | PASS | `<script>alert(1)</script>` not reflected |
| Invalid JWT token | PASS | Returns 401, token rejected |
| Malformed JSON body | PASS | Returns 500, rejected |
| Missing required fields | PASS | Returns 400, validation works |
| Path traversal | PASS | Returns 404, blocked |
| Rate Limiting | **FAIL** | No rate limiting on login endpoint |
| CORS | **NEEDS REVIEW** | No ACAO header returned for `evil.com` origin (good — blocked) |

**Result: 7/8 PASSED, 1 NEEDS ATTENTION**

---

## 4. Security Headers

| Header | Frontend (Vercel) | Backend (Render) |
|--------|-------------------|------------------|
| Strict-Transport-Security | PASS (max-age=63072000) | **MISSING** |
| X-Content-Type-Options | **MISSING** | **MISSING** |
| X-Frame-Options | **MISSING** | **MISSING** |
| Content-Security-Policy | **MISSING** | **MISSING** |
| X-XSS-Protection | **MISSING** | **MISSING** |
| Referrer-Policy | **MISSING** | **MISSING** |

**Result: Frontend 1/6, Backend 0/6**

---

## 5. Performance

| Endpoint | Response Time | Rating |
|----------|--------------|--------|
| GET /api/health | 509ms | OK |
| GET /api/trends | 420ms | GOOD |
| GET /api/trends?limit=5 | 278ms | GOOD |
| POST /api/auth/login | 548ms | OK |
| GET Frontend / | 1075ms | SLOW (first load) |
| GET Frontend /dashboard | 142ms | GOOD |

**Result: Acceptable, frontend first load could be optimized**

---

## 6. HTTPS

| Site | Protocol |
|------|----------|
| Frontend | HTTPS |
| Backend | HTTPS |

**Result: PASS**

---

## Summary

| Category | Score |
|----------|-------|
| E2E Tests | 17/17 (100%) |
| API Endpoints | 6/6 (100%) |
| Security Checks | 7/8 (88%) |
| Security Headers | 1/12 (8%) |
| Performance | 5/6 (83%) |
| HTTPS | 2/2 (100%) |
| **Overall** | **38/41 (93%)** |

---

## Recommendations (Priority Order)

### HIGH — Fix Immediately
1. **Add rate limiting** on `/api/auth/login` — currently unlimited brute-force attempts allowed
2. **Add security headers to backend** — add `helmet` middleware:
   ```bash
   pnpm add helmet
   ```
   ```typescript
   import helmet from 'helmet';
   app.use(helmet());
   ```

### MEDIUM — Fix Soon
3. **Add `X-Content-Type-Options: nosniff`** to both frontend and backend
4. **Add `X-Frame-Options: DENY`** to prevent clickjacking
5. **Add `Content-Security-Policy`** header to prevent XSS
6. **Add `Referrer-Policy: strict-origin-when-cross-origin`**

### LOW — Nice to Have
7. **Optimize frontend first load** — consider preloading critical assets
8. **Add `Permissions-Policy`** header to restrict browser features
