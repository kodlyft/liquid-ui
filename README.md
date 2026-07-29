<div align="center">

# Liquid UI

**A Vue 3 component library with the iOS 26 Liquid Glass aesthetic.**

[![npm version](https://img.shields.io/npm/v/@kodlyft/liquid-ui.svg?style=flat-square)](https://www.npmjs.com/package/@kodlyft/liquid-ui)
[![CI](https://img.shields.io/github/actions/workflow/status/kodlyft/liquid-ui/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/kodlyft/liquid-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![semantic-release](https://img.shields.io/badge/semantic--release-conventional-e10079?style=flat-square&logo=semantic-release)](https://github.com/semantic-release/semantic-release)

Layered blur, tinted glass, soft specular highlights, spring micro-interactions
rendered as 22 production-ready Vue 3 components.

</div>

---

## Features

- **22 components** across 7 categories: buttons, forms, display, overlays,
  navigation, media, and input.
- **Authentic iOS 26 Liquid Glass treatment** backdrop blur + saturation, top
  inner highlight, soft inset shadow, specular sheen overlay, accent halo glow.
- **Vue 3 SFCs with `<script setup lang="ts">`** full type inference, v-model,
  slots, emits.
- **Light & dark themes** out of the box with a single `data-theme` attribute.
- **Themeable** every glass, accent, blur, and radius value is a CSS custom
  property you can override at runtime.
- **Tree-shakable** named ESM exports; pay only for what you use.
- **Zero runtime deps** beyond Vue itself.

## Install

```bash
npm install @kodlyft/liquid-ui
# or: pnpm add @kodlyft/liquid-ui  / yarn add @kodlyft/liquid-ui
```

Peer dep: **Vue 3.3+**.

## Quick start

```ts
// main.ts
import { createApp } from 'vue'
import LiquidUI from '@kodlyft/liquid-ui'
import '@kodlyft/liquid-ui/style.css'
import App from './App.vue'

createApp(App).use(LiquidUI).mount('#app')
```

Or import components individually for better tree-shaking:

```vue
<script setup lang="ts">
import { LiquidButton, LiquidToggle } from '@kodlyft/liquid-ui'
import 'liquid-ui/style.css'
import { ref } from 'vue'

const wifi = ref(true)
</script>

<template>
  <LiquidButton variant="primary" icon="play">Play</LiquidButton>
  <LiquidToggle v-model="wifi" color="green" />
</template>
```

## Components

| Category   | Components                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| Actions    | `LiquidButton`, `LiquidIconButton`                                                                                  |
| Forms      | `LiquidToggle`, `LiquidCheck`, `LiquidSegmented`, `LiquidSlider`, `LiquidStepper`, `LiquidInput`, `LiquidSearchBar` |
| Display    | `LiquidCard`, `LiquidBadge`, `LiquidAvatar`, `LiquidListRow`, `LiquidProgress`, `LiquidSpinner`                     |
| Overlays   | `LiquidModal`, `LiquidContextMenu`, `LiquidToast`, `LiquidNotification`, `LiquidPopover`                            |
| Navigation | `LiquidTabBar`                                                                                                      |
| Media      | `LiquidAudioPlayer`                                                                                                 |
| Input      | `LiquidKeyboard`                                                                                                    |

## Theming

Toggle dark / light with a single attribute on `<html>`:

```html
<html data-theme="dark">
  <!-- or "light" -->
</html>
```

Override any token at the root of your app:

```css
:root {
  --accent: #bf5af2; /* purple */
  --glass-blur: 32px;
  --glass-opacity: 1.1;
  --radius-scale: 1.1;
}
```

## Component example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LiquidButton, LiquidModal } from '@kodlyft/liquid-ui'

const open = ref(false)
const onConfirm = () => console.log('confirmed!')
</script>

<template>
  <LiquidButton variant="destructive" @click="open = true">
    Delete account
  </LiquidButton>

  <LiquidModal
    v-model="open"
    title="Delete account?"
    message="This action cannot be undone."
    confirm-text="Delete"
    destructive
    icon="trash"
    @confirm="onConfirm"
  />
</template>
```

## Development

```bash
# Install
npm install

# Start dev server (showcase)
npm run dev

# Run tests
npm test
npm run test:watch

# Lint & format
npm run lint
npm run format

# Type-check
npm run typecheck

# Build the library
npm run build
```

### Project structure

```
.
├── src/
│   ├── components/         Vue 3 SFCs (one folder per category)
│   ├── styles/             Per-component CSS files
│   ├── icons.ts            SF Symbols-style icon registry
│   ├── style.css           Public stylesheet entry
│   └── index.ts            Named exports + install plugin
├── Liquid UI.html          Standalone showcase (uses CDN Vue)
├── .github/workflows/      CI + release automation
├── vite.config.ts          Library build config
├── vitest.config.ts        Test config
├── release.config.cjs      semantic-release
├── commitlint.config.cjs   Conventional commits
└── lint-staged.config.cjs  Pre-commit hooks
```

## Contributing

We use **conventional commits**, **commitlint**, and **lint-staged** with a
husky pre-commit hook. Read **[CONTRIBUTING.md](./CONTRIBUTING.md)** before
opening a PR.

PRs and commit messages must follow the
[Conventional Commits](https://www.conventionalcommits.org/) spec:

```
feat(button): add tinted variant
fix(toggle): correct thumb travel on small size
docs(README): clarify install steps
```

## Release process

Releases are fully automated by
[semantic-release](https://github.com/semantic-release/semantic-release):

1. PR merges to `main` trigger `.github/workflows/release.yml`.
2. Conventional commits are analyzed to determine the next version.
3. The package is built, tested, type-checked, and published to npm with
   provenance.
4. A GitHub release is created with auto-generated notes.
5. `CHANGELOG.md` and `package.json` version are committed back to `main`.

Pre-releases ship from `next` and `beta` branches.

## License

MIT © Liquid UI Contributors

> Inspired by Apple's iOS 26 Liquid Glass language. Not affiliated with or
> endorsed by Apple.
