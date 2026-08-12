# Mock Accounts for Development

While in development/mock mode, the application uses email domain parsing to automatically assign a user role. 

You can use the following email addresses on the Login page to access the different portals. The password can be any string that is at least 6 characters long (e.g., `password123`).

| Role / Actor | Mock Email Address | Password |
| :--- | :--- | :--- |
| **System Administrator** | `admin@school.edu` | *(Any 6+ chars)* |
| **Teacher** | `teacher@school.edu` | *(Any 6+ chars)* |
| **Advisor** | `advisor@school.edu` | *(Any 6+ chars)* |
| **Student** | `student@school.edu` | *(Any 6+ chars)* |
| **Parent / Guardian** | `parent@school.edu` | *(Any 6+ chars)* |

> **Note:** This behavior is defined in `src/features/auth/components/LoginForm.tsx`. Once the real backend API is integrated via the Backend Integration Guide, these mock accounts will be replaced by your actual database users.
