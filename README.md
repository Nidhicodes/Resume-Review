# Resume Submission and Review Platform

This is a web-based platform where users can upload their resumes and view their review status. It also features an admin dashboard that allows reviewers to update statuses, add notes, and assign scores.

## Features

- **User Authentication:** Secure, passwordless login using magic links provided by Supabase Auth.
- **Resume Upload:** A clean, drag-and-drop UI for uploading PDF resumes, with a file preview before submission.
- **User Dashboard:** An authenticated-only page where users can view the status of their submitted resumes.
- **Admin Panel:** A protected area for administrators to view all submissions, review resume files, and update the status, notes, and score for each submission.
- **Email Notifications:** Automatic email notifications (using Resend) are sent to users when their submission status is updated by an admin.
- **Public Leaderboard:** A public page displaying a ranked list of the top-scoring resumes, with user identities kept anonymous.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Backend & DB:** [Supabase](https://supabase.com/) (PostgreSQL, Storage, Auth)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Libraries:**
  - `react-dropzone` for drag-and-drop functionality.
  - `react-pdf` for PDF previews.
  - `@supabase/auth-ui-react` for a pre-built login form.
- **Email:** [Resend](https://resend.com/)

### Why this stack?

- **Next.js** provides a powerful, hybrid framework that makes it easy to build both static and server-rendered components, which is perfect for an application with both public and protected pages.
- **Supabase** offers a fantastic all-in-one backend solution. It provides a robust PostgreSQL database, file storage, and authentication out of the box, significantly speeding up development time. Its Row Level Security is a powerful feature for building secure, multi-tenant applications.
- **Tailwind CSS** allows for rapid UI development with a utility-first approach, keeping styling consistent and maintainable.

## Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [npm](https://www.npmjs.com/) or a compatible package manager
- A [Supabase](https://supabase.com) project.
- A [Resend](https://resend.com) account for email notifications.

### 1. Clone the repository

```bash
git clone <repository-url>
cd resume-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

This project requires a `.env.local` file in the `resume-platform` directory. Create this file and add the following variables.

**Note:** The running instance of this agent had issues with `.env.local` files, so the keys were hardcoded. For a proper setup, you **must** use an environment file.

```
# Get these from your Supabase project settings (Settings > API)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

SUPABASE_URL=
SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

GMAIL_USER=
GMAIL_APP_PASSWORD=
```

You will also need to update the hardcoded "from" email address in `src/app/admin/resume/actions.ts` and the hardcoded admin User ID in `src/lib/admin.ts`.

### 4. Set up the Supabase database

Log in to your Supabase project and run all the SQL scripts provided by the agent during the development process in the **SQL Editor**. This includes creating the `resumes` table, the `is_admin` function, the `get_leaderboard` function, and all Row Level Security policies.

### 5. Run the development server

```bash
npm run dev
```

The application should now be running at `http://localhost:3000`.

## Future Improvements

- **Pagination:** On the admin dashboard, implement pagination for the list of resumes.
- **More Robust Role Management:** Instead of a hardcoded list, admin roles could be managed in a dedicated database table.
- **Email Templates:** Use a library like `react-email` to create more visually appealing email notifications.
- **Comprehensive Testing:** Add a suite of unit and integration tests using a framework like Jest and React Testing Library.
