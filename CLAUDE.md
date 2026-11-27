@AGENTS.md

# Claude Code

- Project skills live in `.claude/skills/`; prefer them over ad-hoc commands (`verify` before a PR).
- The Nx Claude plugin (`.claude/settings.json`) provides the `nx-*` skills and Nx MCP.
- Never commit or push without asking. Conventional Commits.

# Branches for AI-authored work

AI agents (Claude Code, Copilot, Codex, …) must start every branch name with `claude/` (or `ai/`, `copilot/`,
`codex/`), e.g. `claude/feat/date-filter`. The `merge-gate` workflow then labels the PR `needs review` and blocks
merging until a human removes the label. See `.github/rulesets/README.md`.
