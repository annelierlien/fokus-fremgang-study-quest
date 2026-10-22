# Fokus Fremgang Study Quest

Build a small web app called StudyQuest - a gamified study planner for students. UI language: Norwegian Bokmål.

PROBLEM: Students struggle to keep track of deadlines and stay motivated.

CORE FEATURES (only these 3, make them all work):

1. Add subject and task with deadline: form with subject name, task title, deadline date. List sorted by deadline. Delete and mark as done.

2. Gamification: When a task is marked done, give 100 XP. Show Level (Level = XP / 500 + 1), progress bar to next level, and streak counter for consecutive days with a completed task.

3. Dashboard: Show total tasks, completed this week, XP, level, and a simple weekly activity view.

PAGES:

- Dashboard (stats + this week's tasks)

- My tasks (full list, filter: all / active / done)

- Add task (simple form)

DESIGN:

Clean, modern student style. Light mode, rounded cards, mobile-friendly. No copied logos from other apps.

TECH:

React + localStorage for storage (no login, no backend). Use synthetic demo data on first start: 3 subjects (Diskret matte, Java, Web-applikasjoner) and 5 example tasks.

DO NOT:

- Do not use real personal data, passwords or API keys

- Do not copy design or logos from existing apps

ACCEPTANCE TEST:

I can add a task, mark it done and see XP increase, reload the page and data is still there, and everything works on mobile width.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://fokus-fremgang-study-quest.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d061d91f-95d1-45d3-a859-c9f0ec95bc85).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
