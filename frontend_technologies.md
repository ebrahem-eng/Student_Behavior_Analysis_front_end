# Frontend Technologies & Libraries

This document outlines the technologies, languages, and libraries used in the Frontend section of the Student Behavior Analysis system, along with their specific use cases within the project.

## Core Technologies & Languages

*   **React (v19):** The foundational UI library used for building the user interfaces as a Single Page Application (SPA).
*   **TypeScript:** The primary programming language used. It adds static typing to JavaScript, improving code reliability, developer experience, and maintainability.
*   **HTML5 & CSS3:** Underlying web standards for structuring and styling the application.
*   **Vite (v8):** The build tool and development server used. It provides extremely fast Hot Module Replacement (HMR) and optimized production builds.

## State Management & Data Fetching

*   **Zustand:** A small, fast, and scalable bearbones state-management solution used for managing global client-side state across the application.
*   **TanStack React Query:** Used for server-state management. It handles data fetching, caching, synchronization, and updating of asynchronous data (likely from the backend API).

## Routing

*   **React Router DOM:** The standard routing library for React, used to navigate between different pages and views within the SPA without reloading the browser.

## Styling & UI Components

*   **Tailwind CSS:** A utility-first CSS framework used for rapid and responsive UI development directly within the markup.
*   **Radix UI (`@radix-ui/react-*`):** A collection of unstyled, accessible UI components (like Dialogs, Dropdowns, Tabs, Selects). These are likely used as the foundation for a custom component library (often styled using Tailwind).
*   **Lucide React:** A library providing a comprehensive set of scalable SVG icons used throughout the application's interface.
*   **class-variance-authority (CVA) & clsx & tailwind-merge:** Utilities used for dynamically constructing and managing complex CSS classes and variants, especially useful when building reusable UI components with Tailwind.
*   **Framer Motion:** A production-ready motion library for React, used to implement smooth animations and complex UI transitions.
*   **Recharts:** A composable charting library built on React components, used for data visualization (likely for displaying student behavior trends and analytics).

## Forms & Validation

*   **React Hook Form:** A performant and flexible library for managing form state and validation.
*   **Zod:** A TypeScript-first schema declaration and validation library. It is used in conjunction with React Hook Form (via `@hookform/resolvers`) to strongly type and validate form inputs before submission.

## API Communication & Real-time Features

*   **Axios:** A promise-based HTTP client used for making requests to the backend REST API.
*   **Laravel Echo & Pusher JS:** Libraries used to implement real-time web sockets. They listen for events broadcasted by the backend (which is likely Laravel based on these specific libraries), enabling features like live notifications or real-time dashboard updates.

## Internationalization (i18n)

*   **i18next & react-i18next:** Frameworks used for internationalization, allowing the application to support multiple languages and translate UI text dynamically.

## Progressive Web App (PWA)

*   **Vite Plugin PWA & Workbox (`workbox-*`):** Used to add Progressive Web App capabilities to the application, enabling features like offline support, service workers, and installability on user devices.

## Testing & Code Quality

*   **Vitest:** A blazing fast unit test framework powered by Vite, used for unit and integration testing of React components and utility functions.
*   **React Testing Library:** Used alongside Vitest to test React components from the perspective of how a user interacts with them.
*   **Playwright (`@playwright/test`):** Used for end-to-end (E2E) testing, ensuring the entire application flow works correctly in real browsers.
*   **oxlint:** An extremely fast JavaScript/TypeScript linter used to enforce code quality and catch potential errors early in development.
