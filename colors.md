# SBA Platform - Color Palette & Design Tokens

This file contains all the design tokens, hex codes, HSL values, and Tailwind CSS classes used across the Student Behavior Analysis (SBA) platform for easy copying.

---

## 1. Core System Colors Table

| Token Name | Light Mode (HEX) | Light Mode (HSL) | Dark Mode (HEX) | Dark Mode (HSL) | Tailwind Class |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary (Blue)** | `#2563EB` | `221.2 83.2% 53.3%` | `#3B82F6` | `217.2 91.2% 59.8%` | `bg-primary`, `text-primary` |
| **Background** | `#FFFFFF` | `0 0% 100%` | `#09090B` | `240 10% 3.9%` | `bg-background` |
| **Card / Surface** | `#FFFFFF` | `0 0% 100%` | `#0F172A` | `240 10% 3.9%` | `bg-card` |
| **Foreground (Text)**| `#0F172A` | `222.2 47.4% 11.2%` | `#FAFAFA` | `0 0% 98%` | `text-foreground` |
| **Muted Text** | `#64748B` | `215.4 16.3% 46.9%` | `#94A3B8` | `240 5% 64.9%` | `text-muted-foreground` |
| **Secondary / Subtle**| `#F1F5F9` | `210 40% 96.1%` | `#27272A` | `240 3.7% 15.9%` | `bg-secondary` |
| **Border** | `#E2E8F0` | `214.3 31.8% 91.4%` | `#27272A` | `240 3.7% 15.9%` | `border-border` |
| **Destructive (Red)**| `#EF4444` | `0 84.2% 60.2%` | `#DC2626` | `0 62.8% 30.6%` | `bg-destructive`, `text-destructive` |

---

## 2. Role & Semantic Accent Colors Table

| Role / Status | Primary Hex | Accent Hex | Gradient Tailwind Class | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `#3B82F6` | `#6366F1` | `from-blue-600 to-indigo-600` | System Architecture & Management |
| **Teacher** | `#10B981` | `#14B8A6` | `from-emerald-500 to-teal-500` | Classroom & Attendance Logging |
| **Advisor** | `#8B5CF6` | `#A855F7` | `from-purple-600 to-indigo-600` | Student Caseload & Risk Triage |
| **Student** | `#06B6D4` | `#3B82F6` | `from-cyan-500 to-blue-500` | Learning Goals & AI Companion |
| **Parent** | `#D946EF` | `#F43F5E` | `from-fuchsia-500 to-rose-500` | Family Engagement & Communication |
| **Critical Risk** | `#EF4444` | `#F43F5E` | `text-rose-500 bg-rose-500/10` | High Risk / Immediate Attention |
| **Warning Risk** | `#F59E0B` | `#D97706` | `text-amber-500 bg-amber-500/10`| Moderate Risk / Performance Drop |
| **Normal / Safe** | `#10B981` | `#059669` | `text-emerald-500 bg-emerald-500/10`| On-Track / Good Standing |

---

## 3. Copyable CSS Variables (`index.css`)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 47.4% 11.2%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 47.4% 11.2%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.75rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}
```

---

## 4. Copyable JSON Tokens (`tokens.json`)

```json
{
  "theme": {
    "light": {
      "primary": "#2563EB",
      "background": "#FFFFFF",
      "card": "#FFFFFF",
      "foreground": "#0F172A",
      "muted": "#64748B",
      "border": "#E2E8F0"
    },
    "dark": {
      "primary": "#3B82F6",
      "background": "#09090B",
      "card": "#0F172A",
      "foreground": "#FAFAFA",
      "muted": "#94A3B8",
      "border": "#27272A"
    },
    "roles": {
      "admin": { "primary": "#3B82F6", "gradient": "from-blue-600 to-indigo-600" },
      "teacher": { "primary": "#10B981", "gradient": "from-emerald-500 to-teal-500" },
      "advisor": { "primary": "#8B5CF6", "gradient": "from-purple-600 to-indigo-600" },
      "student": { "primary": "#06B6D4", "gradient": "from-cyan-500 to-blue-500" },
      "parent": { "primary": "#D946EF", "gradient": "from-fuchsia-500 to-rose-500" }
    },
    "riskLevels": {
      "critical": "#EF4444",
      "warning": "#F59E0B",
      "good": "#10B981"
    }
  }
}
```
