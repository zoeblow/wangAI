# 更新日志

[English Version](./CHANGELOG.md)

本项目的重要变更会记录在此文件中。

格式参考 Keep a Changelog，并遵循语义化版本（SemVer）。


## [Unreleased]

### 新增
- 新增 GitHub Pages 项目落地页：`docs/index.html`，用于展示项目简介与快速开始。
- 在 `.gitignore` 与 `.npmignore` 中排除生成目录：`.claude/`、`.golutra/`。

### 变更
- 将 `package.json` 的 `homepage` 更新为 `https://zoeblow.github.io/wangAI/`。

## [0.1.0] - 2026-03-03

### 新增
- 初始化 CLI 包结构，包名为 `@wangai/cli`。
- 新增 `wangai init` 命令，支持交互和非交互模式。
- 基于 `templates/registry.json` 的模板驱动生成机制。
- `.claude`、`.codex`、`.gemini` 三套 workflow 模板。
- 项目上下文注入与缺失字段提醒能力。
- 双语文档：`README.md` 与 `readme-cn.md`。
- CLI 语言参数：`--lang zh|en`，支持帮助和交互提示双语。
- GitHub Actions：CI 与基于 tag 的 npm 发布。
- npm/发布配套文件：`.gitignore`、`.npmignore`、`LICENSE`、`release-checklist.md`。

### 变更
- 模板去除硬编码项目栈信息，改为可注入上下文。
- Gemini 模板从仅 README 扩展为完整 settings/commands/agents/skills。
- Codex 模板补齐 commands、policies、config 模板。
