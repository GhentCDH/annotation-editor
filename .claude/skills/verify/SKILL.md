---
name: verify
description: Run the full pre-PR gate (lint, typecheck, test, build, knip) for this monorepo and report failures. Use before opening a PR, after a refactor, or when asked "is everything green?".
---

Run the same checks CI runs (crouton shared CI: lint, typecheck, test, build, knip).

1. Run:

```
pnpm nx run-many -t lint typecheck test build --parallel=5
pnpm knip
```

Add `--skip-nx-cache` when asked to verify from scratch.

2. Report one line per failing project/target with the first relevant error (file:line + message). Warnings: count only.
3. Do not fix anything unless asked. If asked to fix, fix the root cause, then re-run only the failing targets
   (`pnpm nx run <project>:<target>`) and finally the full gate once.
