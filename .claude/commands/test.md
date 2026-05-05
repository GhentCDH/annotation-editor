Run tests for this project.

If `$ARGUMENTS` specifies a project name, run tests for that specific project:
```
npx nx test <project-name>
```

If `$ARGUMENTS` is empty, run tests for all affected projects:
```
npx nx affected -t test --base=origin/master --parallel=5
```

If tests fail, analyze the failures and suggest or apply fixes. After fixing, re-run the failing tests to verify.