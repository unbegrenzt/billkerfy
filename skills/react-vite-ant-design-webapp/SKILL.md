---
name: react-vite-ant-design-webapp
description: Build, scaffold, and evolve TypeScript web applications using React, Vite, Ant Design, Appwrite, and Zustand. Use when the user asks to create a new frontend with this stack, add UI screens/components with Ant Design, configure themes/tokens, integrate Appwrite services, set up routing/state patterns with Zustand, or troubleshoot build/runtime issues in React+Vite+Ant Design+Appwrite+Zustand projects.
---

# React + Vite + Ant Design Webapp

Follow this workflow to deliver reliable web apps with TypeScript, React, Vite, and Ant Design.

## 1. Confirm project shape

Capture these defaults unless the user specifies otherwise:
- Use TypeScript strict mode.
- Use Vite for dev/build.
- Use React Router for navigation when multiple pages are needed.
- Use Ant Design for UI primitives, form patterns, and design tokens.
- Use Appwrite as backend platform (authentication, database, storage, and server integrations as required).
- Use Zustand as the default client state management layer.
- Use `mingcute_icon` as the default icon library (MingCute).
- Keep components small and composable.

## 2. Scaffold or align existing project

For a new app, initialize with Vite React TypeScript and add Ant Design dependencies.
For an existing app:
- Verify Vite config and TS paths.
- Verify `antd` styles and `ConfigProvider` setup at app root.
- Verify Appwrite SDK setup, environment variables, and a single shared client factory.
- Verify Zustand setup with feature-scoped stores and typed selectors/actions.
- Verify icons come from `mingcute_icon` unless the user explicitly requests another library.

## 3. Configure Ant Design correctly

Implement or verify:
- `ConfigProvider` wired in app root with theme token overrides when needed.
- Optional locale setup and global component size/radius configuration.
- Reusable wrappers for layout primitives (for example page shell, content section, card wrapper).
- Consistent spacing, radius, typography, and color token usage.

If theming complexity increases, load `/references/theming-guidelines.md`.

## 4. Build features with clear boundaries

Structure by feature, not by file type only:
- `src/app` for app shell/router.
- `src/features/*` for domain features.
- `src/components/ui` for reusable presentational primitives.
- `src/lib` for helpers and adapters.

Keep side effects in explicit hooks or services; keep view components declarative.
Prioritize shared logic through custom hooks.
Prefer cross-component communication through focused Zustand stores instead of prop drilling.
For global UI patterns (for example modals), use dedicated stores that control visibility and payload/state so any component can trigger them.

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
