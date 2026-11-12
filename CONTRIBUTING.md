# Contributing to annotation-editor

Thanks for helping out! Open an issue before starting anything large so we can agree on the approach first.

By participating you agree to follow our [Code of Conduct](./CODE_OF_CONDUCT.md).
Security issues go through the [Security Policy](./SECURITY.md), **not** public issues.

## Ways to contribute

- **Report a bug** — use the _Bug report_ issue form. A minimal example that reproduces the problem helps a lot.
- **Suggest a feature or improvement** — use the _Feature request_ or _Improvement_ form.
- **Improve the docs** — everything under `docs/guide/` is fair game.
- **Send a pull request** — for bugs, small improvements, or anything already agreed on in an issue.

## Development setup

Requirements: **Node 24** and **pnpm** (version pinned in `package.json` → `packageManager`; `corepack enable`
picks it up).

```sh
git clone https://github.com/GhentCDH/annotation-editor.git
cd annotation-editor
pnpm install

pnpm nx run-many -t build        # build all packages
pnpm nx run-many -t test         # unit tests
pnpm nx run-many -t lint         # lint (CI fails on lint errors — typecheck does not catch them)
pnpm nx run-many -t typecheck
pnpm nx run docs:serve           # docs site on localhost
```

This is an [Nx](https://nx.dev) monorepo — always run tasks through `pnpm nx`, and prefer
`pnpm nx affected -t lint test` while iterating.

## Where does code go?

| Package             | Contains                                              |
| ------------------- | ----------------------------------------------------- |
| `annotation-core`   | Shared schemas, types and utilities. No Vue, no Nest. |
| `annotation-api`    | NestJS backend module                                 |
| `annotation-editor` | Editor UI (private, bundled into `annotation-vue`)    |
| `annotation-ui`     | Shared Vue UI pieces (private)                        |
| `annotation-vue`    | Published Vue bundle                                  |

## Code style

- Formatting is Prettier (`singleQuote`); ESLint enforces import order and type-only imports.
- The pre-commit hook runs lint on affected projects; `pnpm nx run-many -t lint --fix` fixes most findings.

## Commits and pull requests

- Branch from `main`.
- Use [Conventional Commits](https://www.conventionalcommits.org/) with the package as scope, e.g.
  `fix(api): …`, `feat(core): …`, `refactor(core,api): …`, `docs: …`. Mark breaking changes with `!`
  (`refactor(core)!: …`).
- PR titles follow the same format — they end up in the release notes.
- Keep PRs focused; one logical change per PR.
- Add or update tests, and update `docs/guide` for user-facing changes.
- Fill in the pull request template.

## Releasing (maintainers)

```sh
pnpm release prerelease --preid alpha
```

`nx release` bumps the versions, updates `RELEASE_NOTES.md`, commits and tags; the `postrelease` script pushes.
The pushed tag triggers the `Publish` workflow, which publishes to npm and creates the GitHub release.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).
