# Changelog

[中文版本](./CHANGELOG-cn.md)

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning.


## [0.1.0] - 2026-03-03

### Added
- Initial CLI package setup as `@wangai/cli`.
- `wangai init` command with interactive and non-interactive options.
- Template-driven generation using `templates/registry.json`.
- Workflow templates for `.claude`, `.codex`, and `.gemini`.
- Project context injection and missing-field reminders.
- Bilingual docs: `README.md` and `readme-cn.md`.
- CLI language option: `--lang zh|en` for help output and interactive prompts.
- GitHub Actions workflows: CI and tag-based npm publish.
- npm/release support files: `.gitignore`, `.npmignore`, `LICENSE`, `release-checklist.md`.

### Changed
- Reworked templates to remove hardcoded project-specific stack names.
- Expanded Gemini templates from README-only to full settings/commands/agents/skills.
- Added Codex template coverage for commands, policies, and config template.
