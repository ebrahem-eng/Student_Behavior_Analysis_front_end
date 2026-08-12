# Frontend Implementation Tasks

## Phase 0 — Project Setup & Design System
- [x] Scaffold Vite + React + TypeScript project; configure ESLint/Prettier, path aliases.
- [x] Set up Tailwind + shadcn/ui theme tokens; build the base design system (typography, spacing, color scales for risk levels: low/medium/high).
- [x] Establish a premium, stunning, and modern UI design framework (incorporating glassmorphism, micro-animations, dynamic hover states, and curated harmonious palettes).
- [x] Configure `react-i18next` with English + Arabic locale files and automatic `dir="rtl"`/`dir="ltr"` switching at the root layout.
- [x] Set up API client (Axios/fetch wrapper) with interceptors for auth tokens and error handling.
- [x] Set up React Query provider, Zustand store scaffolding, and the WebSocket client wrapper.

## Phase 1 — Authentication & Role-Based Access
- [x] Implement login screen (single entry point for all 5 roles), session handling, password reset flow.
- [x] Implement role-aware route guards: unauthorized routes redirect based on the user's role.
- [x] Implement permission-driven UI: hide/disable actions the current role/permission set doesn't allow.
- [x] Create global layout shell per role (top nav, side nav, notification bell, language switcher, profile menu).

## Phase 2 — System Admin Console
- [x] Implement Accounts & permissions CRUD UI for the 5 user types with permission assignment.
- [x] Implement Institution management: create schools/universities, configure structure.
- [x] Build Admin dashboard: at-risk student count, top problem subjects, pass/absence rates (charts via Recharts).
- [x] Create Threshold configuration panel: sliders/inputs to set the risk %.
- [x] Implement Alert-tier configuration: define low/medium/high thresholds.
- [x] Build Audit log viewer: searchable/filterable table.
- [x] Add Data policy settings: toggle compliance rules, encryption/anonymization options.
- [x] Implement Backup & disaster-recovery panel.
- [x] Embed Operational monitoring view: Grafana dashboards for system health.
- [x] Build API key management: issue/revoke keys.
- [x] Configure Academic calendar setup: number/type of terms per institution.
- [x] Implement University role configuration: enable extra roles in university mode.
- [x] Add Load-test / scalability monitoring view.

## Phase 3 — Teacher / Faculty Portal
- [x] Create Data entry forms: grades, exam results, assignment submission status.
- [x] Create Attendance & behavior entry forms: attendance %, lateness, class participation.
- [x] Build Student performance dashboard: per-student GPA, attendance rate, activity level.
- [x] Implement Early-alert inbox: real-time (WebSocket) list of students entering risk range.
- [x] Create Recommendation panel: view AI-suggested interventions and mark them as implemented.
- [x] Implement Intervention outcome logging: record whether the student improved.
- [x] Add Report generation: export class/section/course report as PDF/Excel.
- [x] Build Per-course view: switch between courses for university faculty.
- [x] Perform usability testing with non-technical users: favor simple, guided forms.

## Phase 4 — Academic Advisor / Program Coordinator Portal
- [x] Build At-risk students list, sortable/filterable by risk score.
- [x] Implement Early-alert inbox scoped to the advisor's assigned students.
- [x] Create Recommendation review/edit UI: approve, adjust, or reject AI-generated recommendations.
- [x] Build Parent communication portal: threaded, documented messages.
- [x] Integrate Academic chatbot UI: ask analytical questions and display grounded answers.
- [x] Create Discovered-patterns view: surface recurring correlations.
- [x] Build Graduation progress tracker for university students.
- [x] Implement Registration review screen: view/adjust student course & section registrations.
- [x] Build Retrospective accuracy dashboard: compare past predictions to actual outcomes.

## Phase 5 — Student Portal
- [x] Build Personal dashboard: current GPA, attendance %, activity level, weak subjects.
- [x] Implement Early-alert notifications: in-app + push when entering a risk range.
- [x] Create Personalized recommendations feed: actionable, specific suggestions.
- [x] Integrate Academic chatbot: ask why performance dropped, get immediate explanation.
- [x] Build Future-performance projection view: projected end-of-term grade.
- [ ] Implement Well-being survey forms: feed sentiment-analysis pipeline.
- [ ] Build Consent management screen: explicit consent before data analysis.
- [ ] Implement Course registration flow.
- [ ] Build Graduation progress tracker.
- [ ] Ensure multi-device, multi-language access: fully responsive, RTL/LTR, installable PWA.

## Phase 6 — Parent/Guardian Portal
- [ ] Implement Early-alert notifications for their child.
- [ ] Create Periodic/monthly report viewer.
- [ ] Build Advisor communication portal (documented messaging tied to the student).
- [ ] Implement Consent management on behalf of a minor.
- [ ] Add Notification preferences: channel (email/SMS/app) and frequency.
- [ ] Enable Mobile/PWA push notifications without needing to repeatedly log in.

## Phase 7 — Shared Cross-Cutting Components
- [ ] Build unified notification center (bell icon, toast, and push notification handling).
- [ ] Create reusable risk badge / risk-level color system (low/medium/high).
- [ ] Develop shared chatbot widget component (used by both Advisor and Student portals).
- [ ] Create shared export button component (PDF/Excel).
- [ ] Build shared charts library wrappers (trend line, distribution, comparison).
- [ ] Perform centralized RTL/LTR + i18n verification pass across every screen.

## Phase 8 — PWA & Mobile Experience
- [ ] Configure installable PWA manifest, service worker, and offline caching for key screens.
- [ ] Integrate Web push notification (with user opt-in) for parents and students.
- [ ] Perform full responsive QA pass across major browsers and device sizes.

## Phase 9 — Performance, Accessibility & Testing
- [ ] Ensure dashboards/reports render in under 2 seconds (code-split, virtualize, cache).
- [ ] Conduct accessibility audit (axe, keyboard navigation, screen-reader pass).
- [ ] Write Unit tests (Vitest + RTL) for shared components and hooks.
- [ ] Write Playwright E2E flows for each role's critical path.
- [ ] Perform cross-browser compatibility testing (Chrome, Safari, Firefox, Edge).

## Phase 10 — Deployment & CI/CD
- [ ] Set up production build pipeline (Vite build, asset optimization, CDN-ready static output).
- [ ] Configure environment-based variables (staging/production API base URLs, feature flags).
- [ ] Set up CI (GitHub Actions): lint → test → build → deploy on merge to main.
- [ ] Perform final smoke test across all 5 portals in staging before go-live.
