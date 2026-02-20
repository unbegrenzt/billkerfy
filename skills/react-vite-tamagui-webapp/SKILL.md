---
name: react-vite-tamagui-webapp
description: Build, scaffold, and evolve TypeScript web applications using React, Vite, Tamagui, and Appwrite. Use when the user asks to create a new frontend with this stack, add UI screens/components with Tamagui, configure themes/tokens, integrate Appwrite services, set up routing/state patterns, or troubleshoot build/runtime issues in React+Vite+Tamagui+Appwrite projects.
---

# React + Vite + Tamagui Webapp

Follow this workflow to deliver reliable web apps with TypeScript, React, Vite, and Tamagui.

## 1. Confirm project shape

Capture these defaults unless the user specifies otherwise:
- Use TypeScript strict mode.
- Use Vite for dev/build.
- Use React Router for navigation when multiple pages are needed.
- Use Tamagui for layout primitives, tokens, and themes.
- Use Appwrite as backend platform (authentication, database, storage, and server integrations as required).
- Keep components small and composable.

## 2. Scaffold or align existing project

For a new app, initialize with Vite React TypeScript and add Tamagui dependencies.
For an existing app:
- Verify Vite config and TS paths.
- Add missing Tamagui provider setup.
- Normalize `App` entry so it renders under `TamaguiProvider`.
- Verify Appwrite SDK setup, environment variables, and a single shared client factory.

## 3. Configure Tamagui correctly

Implement or verify:
- `tamagui.config.ts` with tokens and themes.
- `TamaguiProvider` wired in app root.
- Reusable UI primitives (for example `Screen`, `Section`, `Card`, `Stack`).
- Consistent spacing, radius, font, and color tokens.

If theming complexity increases, load `/references/theming-guidelines.md`.

## 4. Build features with clear boundaries

Structure by feature, not by file type only:
- `src/app` for app shell/router.
- `src/features/*` for domain features.
- `src/components/ui` for reusable presentational primitives.
- `src/lib` for helpers and adapters.

Keep side effects in explicit hooks or services; keep view components declarative.

## 5. Enforce quality gates

Before finalizing:
- Run typecheck.
- Run lint if configured.
- Run build.
- Smoke-test main routes and responsive layouts.

Prefer fixing root causes over suppressing warnings.

## 6. Apply language and commit conventions

Enforce these conventions unless the user explicitly overrides them:
- Write all code in English (identifiers, function names, variable names, file names, comments, and test descriptions).
- Prefer English UI copy by default unless localization requirements are given.
- Create commit messages using commitlint-compatible Conventional Commits with a leading gitmoji.
- Use format: `<gitmoji> <type>(<scope>): <subject>`.
- Keep `<subject>` in lowercase imperative style without trailing period.

Examples:
- `✨ feat(auth): add login form validation`
- `🐛 fix(router): handle unknown route redirect`
- `♻️ refactor(ui): split dashboard card component`

## 7. Output style

When delivering changes:
- Summarize what was scaffolded or modified.
- List key files touched.
- Mention any assumptions.
- Provide clear next steps only if needed.
