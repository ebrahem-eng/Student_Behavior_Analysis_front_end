# Student Behavior Analysis (SBA) - Front-End System

A cutting-edge, AI-enhanced educational platform designed to monitor, analyze, and support student behavioral and academic journeys. Built with modern web technologies, this system provides specialized portals for Administrators, Teachers, Advisors, Students, and Parents to foster proactive interventions and student success.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🌟 Key Features

### 🔐 Role-Based Access Control (RBAC)
The platform seamlessly adapts its interface and available toolsets based on the logged-in user's role:
- **Admin**: System oversight, user management, global analytics, and security audits.
- **Teacher**: Academic tracking, grade/attendance management, and behavioral incident logging.
- **Advisor**: Caseload management, risk intervention workflows, and direct parent/student communication.
- **Student**: Personal performance tracking, course registration, wellbeing surveys, and AI assistant access.
- **Parent/Guardian**: Child monitoring, data consent management, notification preferences, and advisor communications.

### 🧠 AI-Powered Insights & Analytics
- **Proactive Risk Identification**: Algorithms analyze attendance, grades, and behavioral logs to flag students requiring early intervention.
- **Interactive Chatbot**: An embedded AI Assistant widget helps students navigate campus resources and assists advisors in generating student reports.
- **Rich Visualizations**: Reusable chart components (Trends, Distributions, Comparisons) powered by Recharts provide deep insights into data.

### 🌍 Global Accessibility
- **i18n & RTL Support**: Full Arabic and English localization with automatic Right-to-Left (RTL) layout switching via `react-i18next`.
- **PWA Ready**: Configured as a Progressive Web App (PWA) with offline caching and installability, ensuring access on mobile devices and unreliable networks.
- **Modern UI/UX**: Built with `shadcn/ui` and Tailwind CSS, featuring glassmorphism, micro-animations, and a highly responsive design.

---

## 🏗️ Architecture & Tech Stack

### Core Technologies
- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for strict type safety.
- **Routing**: [React Router DOM](https://reactrouter.com/)

### State Management & Data Fetching
- **Global State**: [Zustand](https://github.com/pmndrs/zustand) (Used for Session/Role management).
- **Server State**: [TanStack React Query](https://tanstack.com/query/latest) (Ready for API integration).

### Styling & UI Library
- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives).
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)

### Testing & QA
- **Unit Testing**: [Vitest](https://vitest.dev/) + React Testing Library + jsdom.
- **E2E Testing**: [Playwright](https://playwright.dev/) (Setup ready).

---

## 📂 Project Structure

\`\`\`text
src/
├── app/                  # Application core (Router, Layouts, Providers)
│   ├── layouts/          # e.g., DashboardLayout, AuthLayout
│   └── router.tsx        # Centralized route definitions
├── components/
│   ├── shared/           # Cross-cutting components (Charts, Badges, Chatbot, Notifs)
│   └── ui/               # shadcn/ui generic components (Buttons, Inputs, Cards)
├── features/             # Feature-sliced modules (The core of the app)
│   ├── admin/            # Admin pages (Dashboard, User Mgmt, Settings)
│   ├── advisor/          # Advisor pages (Caseload, Interventions)
│   ├── auth/             # Login & Authentication flow
│   ├── parent/           # Parent pages (Dashboard, Communications, Settings)
│   ├── student/          # Student pages (Dashboard, Wellbeing, Registration)
│   └── teacher/          # Teacher pages (Dashboard, Academic Tracking, Behavioral Logging)
├── lib/                  # Utilities, API clients, and Zustand stores
│   ├── api.ts            # (Pending) Axios/Fetch instances
│   ├── store.ts          # Zustand global state (e.g., useUserStore)
│   └── utils.ts          # Tailwind merge & clsx utility
├── locales/              # i18n translation files (en/ar)
├── tests/                # Unit test files and setup
└── types/                # Global TypeScript definitions
\`\`\`

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `pnpm` or `yarn`

### Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone <repository-url>
   cd System/Front-End
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup:**
   Copy the example environment file and configure it:
   \`\`\`bash
   cp .env.example .env.development
   \`\`\`

4. **Start the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   The application will be available at \`http://localhost:5173\`.

### Simulated Login (Development Mode)
While in mock mode, the application uses email domain parsing to determine your role. Use the following emails on the login screen to access different portals (any password works):
- **Admin**: \`admin@school.edu\`
- **Teacher**: \`teacher@school.edu\`
- **Advisor**: \`advisor@school.edu\`
- **Student**: \`student@school.edu\`
- **Parent**: \`parent@school.edu\`

---

## 🛠️ Available Scripts

- \`npm run dev\`: Starts the Vite development server with HMR.
- \`npm run build\`: Compiles TypeScript and builds the production-ready assets (including PWA generation).
- \`npm run preview\`: Previews the locally built production application.
- \`npm run lint\`: Runs ESLint to identify code quality issues.
- \`npm run test\`: Runs the Vitest test suite.

---

## 🔗 Backend Integration
This front-end is currently configured with mock data for demonstration purposes. A comprehensive **Backend Integration Guide** (\`backend_integration_guide.md\`) has been provided to assist the back-end team in wiring up real endpoints. 

**Key Integration Points:**
1. Secure JWT Authentication flow.
2. Replacing static \`useUserStore\` mock data with real \`/auth/me\` responses.
3. Connecting Recharts components to real time-series analytical endpoints.
4. Implementing WebSockets for the \`UnifiedNotificationCenter\`.

---

## 📜 License
This project is proprietary and confidential. Unauthorized copying of this file, via any medium is strictly prohibited.
