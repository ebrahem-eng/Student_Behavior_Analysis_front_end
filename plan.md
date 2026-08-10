# Frontend Implementation Plan
## Smart Platform for Student Behavior Analysis & Academic Dropout Prediction (Schools & Universities)

## 1. Overview

The frontend is a **React SPA/PWA** serving five human actors, each with a distinct portal behind role-based routing: **System Admin, Teacher/Faculty, Academic Advisor/Program Coordinator, Student, Parent/Guardian**. The sixth actor (System/AI Engine) is backend-only — the frontend simply consumes its output (risk scores, explanations, recommendations, chatbot answers) via the Laravel API.

Three requirements shape the architecture from day one:
- **Premium, Stunning & Modern UI** (utilizing modern typography, harmonious color palettes, micro-animations, and dynamic interactions to create a visually fantastic and highly engaging experience).
- **Bilingual RTL/LTR support** (the source requirements are in Arabic; the platform must support multiple languages including Arabic) — Student #10.
- **Multi-device responsiveness** (desktop, tablet, mobile) and a **PWA** for parents/students who need push notifications without repeated logins — Parent #6, Student #10, General #3.

## 2. Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript, Vite |
| Routing | React Router v6, role-based route guards |
| Server state | TanStack Query (React Query) for API caching/sync |
| Client state | Zustand (or Redux Toolkit if the team prefers) |
| Styling / UI kit | Tailwind CSS + shadcn/ui (accessible primitives), logical CSS properties for RTL |
| Forms & validation | React Hook Form + Zod |
| Charts | Recharts (dashboards, trend lines, risk distributions) |
| i18n / RTL | `react-i18next` + `dir="rtl"` switching (Arabic/English at minimum) |
| Real-time alerts | WebSocket client (Laravel Echo + Pusher/Reverb) |
| Auth | Sanctum SPA cookie-based auth (or JWT), route guards + permission-based UI hiding |
| PWA | Vite PWA plugin / Workbox (installable, push notifications) |
| Exports | Trigger backend PDF/Excel generation; client-side download handling |
| Accessibility | WCAG 2.1 AA target (keyboard nav, ARIA, color contrast) |
| Testing | Vitest + React Testing Library, Playwright for E2E |

## 3. Phased Plan

---

### Phase 0 — Project Setup & Design System
- Scaffold Vite + React + TypeScript project; configure ESLint/Prettier, path aliases.
- Set up Tailwind + shadcn/ui theme tokens; build the base design system (typography, spacing, color scales for risk levels: low/medium/high).
- Configure `react-i18next` with English + Arabic locale files and automatic `dir="rtl"`/`dir="ltr"` switching at the root layout — Student #10.
- Set up API client (Axios/fetch wrapper) with interceptors for auth tokens and error handling.
- Set up React Query provider, Zustand store scaffolding, and the WebSocket client wrapper.

**Deliverables:** running shell app, design tokens, working language switch.

---

### Phase 1 — Authentication & Role-Based Access
**Covers:** Admin #1 (consumer side)

- Login screen (single entry point for all 5 roles), session handling, password reset flow.
- Role-aware route guards: unauthorized routes redirect based on the user's role (Admin/Teacher/Advisor/Student/Parent).
- Permission-driven UI: hide/disable actions the current role/permission set doesn't allow, mirroring the backend's permission matrix.
- Global layout shell per role (top nav, side nav, notification bell, language switcher, profile menu).

**Deliverables:** auth flow, protected routing, per-role shell layout.

---

### Phase 2 — System Admin Console
**Covers:** Admin #1–#13

- **Accounts & permissions**: CRUD UI for the 5 user types with permission assignment — #1.
- **Institution management**: create schools/universities, configure structure (classes/sections or colleges/departments/programs) — #2.
- **Admin dashboard**: at-risk student count, top problem subjects, pass/absence rates (charts via Recharts) — #3.
- **Threshold configuration panel**: sliders/inputs to set the risk % that triggers an alert per institution — #4.
- **Alert-tier configuration**: define low/medium/high thresholds and their notification behavior — #5.
- **Audit log viewer**: searchable/filterable table of who accessed what data, when, why — #6.
- **Data policy settings**: toggle compliance rules (FERPA-style), encryption/anonymization options — #7.
- **Backup & disaster-recovery panel**: schedule backups, trigger/monitor restores — #8.
- **Operational monitoring view**: embed or link Grafana dashboards for system health — #9.
- **API key management**: issue/revoke keys for external researchers, view usage — #10.
- **Academic calendar setup**: configure number/type of terms per institution — #11.
- **University role configuration**: enable extra roles (program coordinator, college advisor) in university mode — #12.
- **Load-test / scalability monitoring view**: surface capacity metrics as institution count grows — #13.

**Deliverables:** full admin console covering all 13 admin requirements.

---

### Phase 3 — Teacher / Faculty Portal
**Covers:** Teacher #1–#9

- **Data entry forms**: grades, exam results, assignment submission status — #1.
- **Attendance & behavior entry**: attendance %, lateness, class participation — #2.
- **Student performance dashboard**: per-student GPA, attendance rate, activity level, trend over time — #3.
- **Early-alert inbox**: real-time (WebSocket) list of students entering risk range — #4.
- **Recommendation panel**: view AI-suggested interventions and mark them as implemented — #5.
- **Intervention outcome logging**: record whether the student improved after intervention — #6.
- **Report generation**: export class/section/course report as PDF/Excel — #7.
- **Per-course view**: switch between courses for university faculty teaching multiple sections — #8.
- **UX priority**: this portal must be usable with zero technical training — favor simple, guided forms over dense data tables — #9.

**Deliverables:** teacher portal covering all 9 teacher requirements, usability-tested with non-technical users.

---

### Phase 4 — Academic Advisor / Program Coordinator Portal
**Covers:** Advisor #1–#9

- **At-risk students list**, sortable/filterable by risk score, to prioritize intervention — #1.
- **Early-alert inbox** scoped to the advisor's assigned students — #2.
- **Recommendation review/edit UI**: approve, adjust, or reject AI-generated recommendations before sending — #3.
- **Parent communication portal**: threaded, documented messages tied to a student record — #4.
- **Academic chatbot UI**: ask analytical questions ("Why did this student's level drop?") and display grounded answers with supporting data — #5.
- **Discovered-patterns view**: surface recurring correlations (e.g. absence ↔ failure) for proactive planning — #6.
- **Graduation progress tracker** for university students — #7.
- **Registration review screen**: view/adjust student course & section registrations at term start — #8.
- **Retrospective accuracy dashboard**: compare past predictions to actual outcomes — #9.

**Deliverables:** advisor portal covering all 9 advisor requirements.

---

### Phase 5 — Student Portal
**Covers:** Student #1–#10

- **Personal dashboard**: current GPA, attendance %, activity level, weak subjects — #1.
- **Early-alert notifications**: in-app + push when entering a risk range — #2.
- **Personalized recommendations feed**: actionable, specific suggestions — #3.
- **Academic chatbot**: ask why performance dropped, get immediate explanation — #4.
- **Future-performance projection view**: projected end-of-term grade if current trend continues — #5.
- **Well-being survey forms**: feed sentiment-analysis pipeline — #6.
- **Consent management screen**: explicit consent (or parental consent flow if a minor) before data analysis — #7.
- **Course registration flow** — #8.
- **Graduation progress tracker** — #9.
- **Multi-device, multi-language access**: fully responsive, RTL/LTR, installable PWA — #10.

**Deliverables:** student portal covering all 10 student requirements.

---

### Phase 6 — Parent/Guardian Portal
**Covers:** Parent #1–#6

- **Early-alert notifications** for their child — #1.
- **Periodic/monthly report viewer** — #2.
- **Advisor communication portal** (documented messaging tied to the student) — #3.
- **Consent management** on behalf of a minor — #4.
- **Notification preferences**: channel (email/SMS/app) and frequency — #5.
- **Mobile/PWA push notifications** without needing to repeatedly log in from a computer — #6.

**Deliverables:** parent portal covering all 6 parent requirements.

---

### Phase 7 — Shared Cross-Cutting Components
- Unified **notification center** (bell icon, toast, and push notification handling) used across all 5 portals.
- Reusable **risk badge / risk-level color system** (low/medium/high) used consistently across dashboards.
- Shared **chatbot widget** component (used by both Advisor and Student portals, scoped differently per role).
- Shared **export button** component (PDF/Excel) wired to backend report endpoints.
- Shared **charts library wrappers** (trend line, distribution, comparison) built once, reused across dashboards.
- Centralized **RTL/LTR + i18n** verification pass across every screen built so far.

**Deliverables:** shared component library documented (e.g. via Storybook).

---

### Phase 8 — PWA & Mobile Experience
**Covers:** Parent #6, Student #10, General #3

- Configure installable PWA manifest, service worker, and offline caching for key read-only screens (dashboard, alerts).
- Web push notification integration (with user opt-in) for parents and students.
- Full responsive QA pass across major browsers and device sizes (phones, tablets, desktop) — General #3.

**Deliverables:** installable PWA, push notifications working end-to-end.

---

### Phase 9 — Performance, Accessibility & Testing
**Covers:** General #1, #3

- Performance budget: dashboards/reports render in under 2 seconds — code-split routes, virtualize large tables, cache with React Query — General #1.
- Accessibility audit (axe, keyboard navigation, screen-reader pass) — important given the non-technical teacher/parent/student audience.
- Unit tests (Vitest + RTL) for shared components and hooks; Playwright E2E flows for each role's critical path (login → dashboard → key action).
- Cross-browser compatibility testing (Chrome, Safari, Firefox, Edge) — General #3.

**Deliverables:** performance report, accessibility audit report, CI test suite green.

---

### Phase 10 — Deployment & CI/CD
- Production build pipeline (Vite build, asset optimization, CDN-ready static output).
- Environment-based config (staging/production API base URLs, feature flags).
- CI (GitHub Actions): lint → test → build → deploy on merge to main.
- Final smoke test across all 5 portals in staging before go-live.

**Deliverables:** automated deploy pipeline, staging sign-off, production release.

---

## 4. Suggested Folder Structure

```
/frontend
  src/
    app/                 # router, providers, layout shells
    features/
      admin/
      teacher/
      advisor/
      student/
      parent/
      shared/            # notifications, chatbot widget, charts, exports
    i18n/                # en.json, ar.json
    lib/                 # api client, auth, websocket
    components/ui/       # shadcn/ui-based primitives
  tests/
```

## 5. Notes on the Python/AI Dependency

The frontend never talks to Python directly. All AI/ML output (risk scores, explanations, recommendations, chatbot answers, sentiment results) is served through the **Laravel API**, which internally calls the Python microservice described in the backend plan. The React app only needs to render whatever structured JSON Laravel returns (e.g. `risk_level`, `risk_score`, `top_factors[]`, `recommendation_text`, `chatbot_answer`) — no Python tooling is required on the frontend.
