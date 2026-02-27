# Project Agent Rules

## Language
- Write all code in English (identifiers, function names, variable names, file names, comments, and test descriptions).
- Use English text in technical messages and code-related outputs by default.
- Do not add code comments unless the user explicitly requests comments.

## Architecture
- Use Atomic Design as the default UI architecture.
- Organize reusable UI under Atomic Design layers: `atoms`, `molecules`, `organisms`, `templates`, and `pages`.
- Place components in the proper layer based on responsibility and composition level.
- Use absolute imports with the `@/` alias (for example: `@/components`, `@/features`, `@/lib`) instead of deep relative paths.

## Component File Structure
- Use one folder per component named with PascalCase: `NameComponent/`.
- Inside each component folder, use exactly this structure:
```text
NameComponent/
  index.tsx
  NameComponent.types.ts
  NameComponent.styles.ts
```
- Keep component logic and rendering in `index.tsx`.
- Keep all component type definitions in `NameComponent.types.ts`.
- Keep style declarations in `NameComponent.styles.ts`.

## State Management
- Use Zustand as the default client state management library.
- Create focused stores by domain/feature and avoid a single monolithic store.
- Keep async side effects isolated in store actions or dedicated service adapters.
- Prioritize shared logic through custom hooks.
- Prefer communication between distant components through Zustand stores instead of prop drilling.
- Use global UI stores for cross-cutting controls (for example modal visibility and modal payload/state) so any component can open or close them.

## Icons
- Use MingCute icons as the default and preferred icon set: mingcute_icon npm library.
- When installing an icon package, choose the MingCute package first unless the user explicitly requests a different library.

## Charts
- Use `@ant-design/charts` as the default library for dashboard and analytics diagrams.
- Prefer chart components from `@ant-design/charts` over custom SVG chart implementations.

## Data Model Reference
- Treat the Mermaid diagram in `/Users/unbegrenzt/Documents/GitHub/Billkerfy/docs/database-model.md` as the canonical reference for the Appwrite database structure.
- Assume that the Appwrite data model should match the Mermaid ER model unless the user explicitly requests otherwise.
- When adding or changing Appwrite collections, attributes, relations, or statuses, update the Mermaid diagram in `docs/database-model.md` in the same change.
- Before implementing data-layer changes, review `docs/database-model.md` first to align naming and relationships.
