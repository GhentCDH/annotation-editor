# @ghentcdh/annotation-api

NestJS module (`AnnotationApiModule.forResourceDir`) that serves annotation definitions through crouton and,
optionally, a W3C annotation CRUD API backed by your own repository and mapper.

**Usage:** [Backend integration](https://ghentcdh.github.io/annotation-editor/guide/backend-integration.html)

Peer dependencies: `@nestjs/common@^12`, `@nestjs/swagger@^12`, `zod@^4`, `@ghentcdh/w3c-utils`.

```sh
pnpm nx build annotation-api
pnpm nx test annotation-api
```
