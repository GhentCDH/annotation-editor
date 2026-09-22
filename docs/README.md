[![Build](https://github.com/GhentCDH/annotation-editor/actions/workflows/merge-request.yml/badge.svg)](https://github.com/GhentCDH/annotation-editor/actions/workflows/merge-request.yml)
[![Publish](https://github.com/GhentCDH/annotation-editor/actions/workflows/publish.yml/badge.svg)](https://github.com/GhentCDH/annotation-editor/actions/workflows/publish.yml)
[![Publish Docs](https://github.com/GhentCDH/annotation-editor/actions/workflows/publish-docs.yml/badge.svg)](https://github.com/GhentCDH/annotation-editor/actions/workflows/publish-docs.yml)
[![annotation-core](https://img.shields.io/npm/v/@ghentcdh/annotation-core.svg?label=annotation-core)](https://www.npmjs.com/package/@ghentcdh/annotation-core)
[![annotation-api](https://img.shields.io/npm/v/@ghentcdh/annotation-api.svg?label=annotation-api)](https://www.npmjs.com/package/@ghentcdh/annotation-api)
[![annotation-vue](https://img.shields.io/npm/v/@ghentcdh/annotation-vue.svg?label=annotation-vue)](https://www.npmjs.com/package/@ghentcdh/annotation-vue)
[![Docs](https://img.shields.io/badge/docs-ghentcdh.github.io-blue)](https://ghentcdh.github.io/annotation-editor/)

# Annotation Editor

Monorepo for W3C-compliant annotation editing. Provides a NestJS API module for serving annotation definitions, a shared core library for types and validation, and a Vue 3 editor component for creating and managing annotations on text sources.

**Documentation:** https://ghentcdh.github.io/annotation-editor/

## Packages

| Package                     | Description                                                            |
|-----------------------------|------------------------------------------------------------------------|
| `@ghentcdh/annotation-core` | Shared types, Zod schemas, and configuration utilities                 |
| `@ghentcdh/annotation-vue`  | Vue 3 annotation editor and preview components (bundled, ready to use) |
| `@ghentcdh/annotation-api`  | NestJS module for serving annotation definitions                       |

## Getting started

See the [documentation](https://ghentcdh.github.io/annotation-editor/) for installation, configuration, and usage guides.

## Architecture

```
┌─────────────────────┐
│  annotation-vue     │  Vue 3 editor + preview components
│  (frontend)         │
└────────┬────────────┘
         │ uses types from
┌────────▼────────────┐
│  annotation-core    │  Shared types, Zod schemas, config
└────────┬────────────┘
         │ used by
┌────────▼────────────┐
│  annotation-api     │  NestJS module (serves definitions)
│  (backend)          │
└─────────────────────┘
```

- **annotation-core** — shared dependency used by both frontend and backend
- **annotation-api** — loads annotation definitions from JSON files and serves them via REST
- **annotation-vue** — renders sources and annotations, provides CRUD UI using the W3C annotation standard via `@ghentcdh/w3c-utils`

## Development

```bash
# Install dependencies
pnpm install

# Lint
pnpm nx affected -t lint --base=origin/main

# Test
pnpm nx affected -t test --base=origin/main

# Type check
pnpm nx affected -t typecheck --base=origin/main
```

---

## License

MIT — see [LICENSE](./LICENSE).

## Credits

Bo Vandersteene, Ghent University.

Development by [Ghent Centre for Digital Humanities — Ghent University](https://www.ghentcdh.ugent.be/). Funded by the [GhentCDH research projects](https://www.ghentcdh.ugent.be/projects).

<img src="https://www.ghentcdh.ugent.be/ghentcdh_logo_blue_text_transparent_bg_landscape.svg" alt="GhentCDH" width="500">
