# Photophile — System Architecture

This guide explains how Photophile's frontend (Next.js 15) and backend (Express/TypeScript) talk to each other, how we keep the app secure, and how we handle things like loading screens, error states, filter sharing, and portfolio bento grids.

---

## 🏗️ System Flow & Topography

Here is the single map of how a request flows through the entire system:

```
                  ┌───────────────────────────────┐
                  │     FRONTEND (Next.js 15)     │
                  └──────────────┬────────────────┘
                                 │
                   [Page Request │ Intercepted]
                                 ▼
                  ┌───────────────────────────────┐
                  │      Edge Middleware          │
                  │  (Session & Role Gate Checks) │
                  └──────────────┬────────────────┘
                                 │ Pass (Cookie Checked)
                                 ▼
                  ┌───────────────────────────────┐
                  │     Feature-Sliced Pages      │
                  │  QueryErrorBoundary ->        │
                  │  Suspense -> Render UI        │
                  └──────────────┬────────────────┘
                                 │
                     API Call    │ (CORS Allowed Origins)
                                 ▼
                  ┌───────────────────────────────┐
                  │     BACKEND (Express.js)      │
                  ├───────────────────────────────┤
                  │  Security Pipeline:           │
                  │  1. Helmet (Security Headers) │
                  │  2. rateLimiter (Max 5/15m)   │
                  │  3. cors (Origin vetting)     │
                  │  4. cookieParser              │
                  │  5. csrfCheck (Guard)         │
                  │  6. authMiddleware (JWT Check)│
                  │  7. isPhotographer (Role Gate)│
                  │  8. validateRequest (Zod)     │
                  └──────────────┬────────────────┘
                                 │ Passed Checks
                                 ▼
                  ┌───────────────────────────────┐
                  │    Service & Controller       │
                  │ (Router -> Controller -> Serv)│
                  └──────┬─────────────────┬──────┘
                         │                 │
                         ▼                 ▼
                  ┌────────────┐     ┌────────────┐
                  │  MongoDB   │     │ Cloudinary │
                  │ (Mongoose) │     │ (Media CDN)│
                  └────────────┘     └────────────┘
```

---

## 📌 Table of Contents

- [1. Security & Authentication](#1-security--authentication)
  - [1.1 Next.js Edge Middleware](#11-nextjs-edge-middleware)
  - [1.2 Express Backend Middleware Pipeline](#12-express-backend-middleware-pipeline)
- [2. Frontend UI Architecture](#2-frontend-ui-architecture)
  - [2.1 Precision Loading & Cache Recovery](#21-precision-loading--cache-recovery)
  - [2.2 Layout Composition without Div Soup](#22-layout-composition-without-div-soup)
- [3. Discovery Search & URL Synchronization](#3-discovery-search--url-synchronization)
  - [3.1 URL as Single Source of Truth](#31-url-as-single-source-of-truth)
  - [3.2 Immediate vs. Draft Filter State](#32-immediate-vs-draft-filter-state)
- [4. Responsive Portfolio Bento Grid](#4-responsive-portfolio-bento-grid)
  - [4.1 Responsive Bento Grid Templates](#41-responsive-bento-grid-templates)
  - [4.2 Dynamic CDN Image Optimization](#42-dynamic-cdn-image-optimization)
  - [4.3 Full-Screen Lightbox View](#43-full-screen-lightbox-view)

---

## 1. Security & Authentication

We verify user identity and session integrity at both frontend and backend boundaries.

### 1.1 Next.js Edge Middleware
Before any page is rendered on the client, our Next.js middleware (`middleware.ts`) intercepts the request:
* **Token Verification:** It reads the `accessToken` from secure HttpOnly cookies and checks if it's valid.
* **Role/Route Gates:**
  - If a user tries to access a protected route (like `/photographer/dashboard`, `/photographer/onboard`, or `/profile`) and is not logged in, the middleware redirects them to `/login`.
  - It saves their original path in a redirect query (e.g., `/login?redirect=/profile`) so they return right back where they wanted to go after logging in.
  - If a logged-in user tries to open `/login` or `/register`, the middleware redirects them away to their `/profile`.

### 1.2 Express Backend Middleware Pipeline
When the frontend makes API calls, every request passes through a sequential chain of Express middlewares:
* **Helmet (Security Headers):** Sets standard headers to prevent clickjacking, MIME sniffing, and cross-site scripting (XSS).
* **Rate Limiter:** Restricts request rates per IP. General routes allow 100 requests per minute, but auth routes (like login/register) are restricted to 5 attempts per 15 minutes to block brute-force attacks.
* **CORS Guard:** Inspects request origins and blocks requests from domains not configured in the `ORIGIN_HOSTS` variable.
* **CSRF check:** Checks matching custom request headers to prevent Cross-Site Request Forgery.
* **JWT Verifier (`auth.middleware.ts`):** Decodes the `accessToken`, checks if it has expired, and attaches the user's details to `req.user`.
* **Photographer Gate (`isPhotographer` in `photographer.middleware.ts`):** Checks the database to confirm if the current user has a registered photographer profile. If not, it returns a `403 Forbidden` response. If they do, it attaches the profile directly to `req.photographer` so controllers can access it instantly.
* **Zod Validator (`validateRequest.ts`):** Checks the request body, query parameters, or file uploads against a strict schema. If any validation fails, it triggers the error handler immediately.
* **Email Verification:** Creates secure, time-limited cryptographic tokens that are emailed to users for secure account activation.

---

## 2. Frontend UI Architecture

We design client-side screens using a modern, boundary-first pattern to keep code clean and maintainable.

### 2.1 Precision Loading & Cache Recovery
Every data-heavy page (like the public profile and search dashboard) is wrapped inside a predictable boundary stack:
```
QueryErrorBoundary ──► Suspense (Skeleton UI) ──► Custom Data Component
```

* **React Suspense & Loading Skeletons:**
  Instead of manual `if (isLoading)` flags cluttering our react files, we let React handle loading states. While data is being fetched, React renders a visual mock layout (like `ProfileSkeleton`).
  * *Why?* This keeps the actual component code simple, avoids page elements shifting around awkwardly as they load, and speeds up rendering since layouts do not wait on each other.
* **React Query Cache Recovery (`QueryErrorBoundary`):**
  If the network drops or an API returns an error, the `QueryErrorBoundary` intercepts the failure. Instead of crashing the page, it renders a custom `DataState.Error` screen with a **Try Again** button. Clicking it clears React Query's local cache and automatically retries the API fetch.

### 2.2 Layout Composition without Div Soup
Rather than nesting hundreds of unreadable structural `div` tags, we use a single compound component pattern (`Page.tsx`) to structure pages:
* `Page`: The viewport container (`min-h-screen`, responsive flex behaviors).
* `Page.Header`: Sticky header wrapper with default borders.
* `Page.Title` and `Page.Description`: Semi-bold headings and paragraph tags.
* `Page.Body`: Primary layout grid container that automatically scales to the user's device.
* `Page.Section` and `Page.Aside`: Layout blocks representing primary contents and narrow sidebars.
* `Page.Stack`, `Page.Row`, and `Page.Grid`: Simple, style-agnostic layout blocks that replace raw divs.

**Example:**
```tsx
<Page>
  <Page.Header>
    <Page.Title>Dashboard</Page.Title>
    <Page.Description>Manage your portfolio.</Page.Description>
  </Page.Header>
  <Page.Body>
    <Page.Section>
       {/* Main Content goes here */}
    </Page.Section>
    <Page.Aside>
       {/* Sidebar controls go here */}
    </Page.Aside>
  </Page.Body>
</Page>
```

---

## 3. Discovery Search & URL Synchronization

Our search page keeps all filter states (search keywords, location, specialties, prices, sorting, pagination) in perfect sync with the browser's URL using Zustand.

### 3.1 URL as Single Source of Truth
* **`writeFiltersToURL`:** When a user selects a filter, the state is converted to URL query parameters and saved using `window.history.replaceState`. This updates the address bar without triggering a slow, full-page reload.
* **`hydrateFromURL`:** When a user opens a link or presses the back button, the store automatically reads the URL query parameters and populates the search filters.
* *Why?* Users can copy and paste their search link (e.g. `?location=paris&specialty=wedding`) and share it with others. Anyone opening that link will see the exact same search results instantly.

### 3.2 Immediate vs. Draft Filter State
To keep queries efficient and prevent spamming the database:
* **Immediate Actions:** Sorting or page number changes trigger the API query instantly.
* **Draft Actions:** Filters like specialty checkboxes, location selects, or pricing inputs are stored in a local `drafts` object. They only trigger a database query when the user clicks **Apply Filters**.
* **Search Debounce:** Text inputs are debounced by `400ms`. The search API only runs after the user stops typing, preventing API spam.

---

## 4. Responsive Portfolio Bento Grid

Public photographer profile pages are built to feel like premium, editorial layouts.

### 4.1 Responsive Bento Grid Templates
Portfolios are organized into a responsive Bento Grid using five distinct slot templates:
* **Slot 0:** Large square layout (`2x2` grid size).
* **Slots 1 & 2:** Tall vertical portrait layout (`aspect-[4/5]`).
* **Slots 3 & 4:** Wide landscape layout (`aspect-[16/9]`).

On mobile devices, this automatically transitions into a clean, 2-column scrollable grid. On tablets and desktops, it expands into a balanced 4-column collage.

### 4.2 Dynamic CDN Image Optimization
To speed up page loads, we don't load original raw photos. Instead, we use Cloudinary to automatically crop, resize, and compress each image (`c_fill`, `q_auto`, `f_auto`) to match the exact bento slot aspect ratio.

### 4.3 Full-Screen Lightbox View
Clicking an image brings up a clean, full-screen lightbox modal. It utilizes subtle blurs (`backdrop-blur-3xl`), entrance animations (`zoom-in-95`), and exit animations, making the interaction feel premium.
