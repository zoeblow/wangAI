# @wangai/cli

[中文文档](./readme-cn.md)

CLI to initialize AI workflow configs for projects.

## Install

```bash
npm i -g @wangai/cli
```

## Quick Start

```bash
wangai --help
wangai init
```

## Language Option

You can control CLI and prompt language:

```bash
wangai --help --lang zh
wangai init --lang zh
wangai init --lang en
```

## What `init` Generates

Based on selected workflows:

- `.claude/*`
- `.codex/*`
- `.gemini/*`
- `wangai.config.json`

## Interactive Options

`wangai init` supports these choices:

- workflow: `claude`, `codex`, `gemini`, `all`
- stack: `react`, `vue`, `next`, `nuxt`
- features: router, TypeScript, ESLint, state manager
- project context: project name, summary, framework, language, styling

If project context is omitted, fields are set to `待补充` and a reminder is printed.

## Non-Interactive Example

```bash
wangai init --workflow all --stack next --router y --ts y --eslint y --state redux --project-name MyProject --project-summary "Internal developer platform" --framework "Next.js" --language "TypeScript" --styling "Tailwind CSS" --lang zh --git-exclude y --yes
```

## Template System

Template-driven generation:

- `templates/registry.json`: template-to-target mapping
- `templates/claude/*`: Claude templates
- `templates/codex/*`: Codex templates
- `templates/gemini/*`: Gemini templates

To update behavior:

1. Edit template files under `templates/*`
2. Update mappings in `templates/registry.json`
3. Run `wangai init` again

## Publish

```bash
npm login
npm publish --access public
```
