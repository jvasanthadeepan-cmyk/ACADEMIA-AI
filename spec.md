# Specification

## Summary
**Goal:** Build “Academia AI,” a dark-mode SaaS-style student dashboard with Internet Identity auth, core academic productivity modules (planner, assistant, roadmap, focus tracker), and persistent per-user data.

**Planned changes:**
- Create a public landing page with the specified hero text, CTAs (Get Started/Login), features list, pricing (Free, Pro ₹299/month), and footer links.
- Implement Internet Identity authentication, onboarding/profile capture (Full Name, College Name, Course, Year 1–4, Target Career), route protection, and logout.
- Build the authenticated app shell: responsive left sidebar navigation (collapsible on mobile) and top bar (user name, notification icon, profile dropdown).
- Implement Dashboard widgets: today’s study tasks, focus score %, upcoming exams section, weekly productivity graph, and a Quick Ask assistant box.
- Implement Study Planner: create/edit tasks (subject, topic, deadline), calendar and list views, completion toggles, subject filtering, and subject progress bars.
- Add “Syllabus text to plan” deterministic planner that converts syllabus + date range into a multi-day editable task breakdown (no external AI).
- Implement AI Study Assistant: chat UI with prebuilt prompt buttons, per-user chat history persistence, loading/error states, and Quick Ask parity.
- Enforce assistant plan limits: Free = 10 queries/day, Pro = unlimited, quota display, and upgrade modal blocking over-limit queries.
- Implement Career Roadmap: inputs (Degree, Target Job, Timeline) and deterministic generation of a structured roadmap (skills, tools, projects, internships) in a timeline-style UI with per-user persistence.
- Implement Focus Tracker: 25-minute Pomodoro timer, daily focus score, habit streaks, weekly productivity chart, and persisted focus sessions.
- Implement Settings: edit profile fields, theme toggle (dark/light) with persistence, subscription status display (Free/Pro), change password via identity-provider UX where applicable, and logout.
- Implement a single Motoko canister actor with data models + CRUD APIs for Users (incl. plan), StudyTasks, FocusSessions, and ChatHistory, all scoped/authorized by caller principal.
- Add production UX states across the app: loading indicators, error handling, and toast notifications for key actions (including quota reached modal).

**User-visible outcome:** Users can visit a landing page, sign in with Internet Identity, complete a profile, and use a responsive dark-mode dashboard to manage study tasks (including auto-planning from syllabus text), chat with a quota-limited assistant, generate a deterministic career roadmap, track focus with Pomodoro and streaks, and manage settings with all data saved per account.
