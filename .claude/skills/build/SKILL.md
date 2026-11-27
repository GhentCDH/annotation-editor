---
name: build
description: Build one Nx project or all affected projects and fix build errors. Use when asked to build, or after changes to vite/package config.
---

Build a project in this workspace.

If `$ARGUMENTS` specifies a project name, build that specific project:

```
pnpm nx build <project-name>
```

If `$ARGUMENTS` is empty, build all affected projects:

```
pnpm nx affected -t build --base=origin/main --parallel=5
```

If the build fails, analyze the error output and fix the issues. After fixing, re-run the build to verify.
