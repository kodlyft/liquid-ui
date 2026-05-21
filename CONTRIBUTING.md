# Contributing to Liquid UI

Thanks for wanting to make Liquid UI better! This guide covers everything you
need to know to land a PR.

## Setup

```bash
git clone https://github.com/kodlyft/liquid-ui.git
cd liquid-ui
npm install
```

The `prepare` script installs husky git hooks automatically.

## Development workflow

```bash
npm run dev         # Vite dev server with the showcase
npm test            # Run vitest once
npm run test:watch  # Watch mode
npm run lint        # ESLint
npm run format      # Prettier on src/
npm run typecheck   # vue-tsc
npm run build       # Production library bundle
```

## Adding a new component

1. Create the SFC at `src/components/<Category>/Liquid<Name>.vue`.
2. Add matching CSS to `src/styles/components-<category>.css` (use the
   `lq-<name>` BEM-ish prefix).
3. Export it from `src/index.ts` (named export + plugin registration).
4. Add tests at `src/__tests__/Liquid<Name>.test.ts` covering: rendering, prop
   variants, v-model / emits, disabled state.
5. Optionally add a page entry to `js/docs-registry.js` so it shows up in the
   showcase.

## Code style

- **TypeScript with `<script setup lang="ts">`.** Prefer `withDefaults` +
  `defineProps<Props>` over the runtime form.
- **Type emits explicitly:**
  `defineEmits<{ (e: 'click', event: MouseEvent): void }>()`.
- **CSS class naming:** `lq-<component>__<element>--<modifier>`. Component
  modifiers go on the root; never style your component from the outside.
- **No magic numbers** in CSS use the tokens in `src/styles/tokens.css`.
- Run `npm run lint:fix` and `npm run format` before opening a PR.

## Commit messages Conventional Commits

This is enforced by **commitlint** on every commit. Format:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

Allowed types: `feat`, `fix`, `perf`, `refactor`, `docs`, `style`, `test`,
`build`, `ci`, `chore`, `revert`.

Examples:

```
feat(button): add tinted variant
fix(toggle): clamp thumb travel on small size
docs(readme): add theming section
test(modal): cover destructive confirm path
```

**Breaking changes** trigger a major-version bump add `!` after the type or a
`BREAKING CHANGE:` footer:

```
feat(card)!: rename `padded` prop to `padding`
```

## Pull requests

- One concern per PR. Smaller PRs ship faster.
- PR titles must also follow Conventional Commits (validated by
  `.github/workflows/pr-title.yml`).
- Include screenshots / screen recordings for visual changes.
- All CI checks (lint, typecheck, test, build) must pass.

## Release process

Maintainers don't release by hand. Merging to `main` runs semantic-release
which:

1. Analyzes the commits since the last release.
2. Bumps the version per semver (`fix` → patch, `feat` → minor, breaking →
   major).
3. Builds, type-checks, tests, publishes to npm with provenance.
4. Creates a GitHub release with notes.
5. Commits the new `CHANGELOG.md` and `package.json` back.

That's why commit messages matter they _are_ the changelog.

## Reporting bugs

Open an issue with:

- Liquid UI version + Vue version
- Minimal reproduction (StackBlitz link is gold)
- Expected vs. actual behavior
- Browser + OS

Thanks for contributing!
