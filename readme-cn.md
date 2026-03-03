# @wangai/cli

[English](./README.md)

用于为项目初始化 AI 工作流配置的 CLI 工具。

## 安装

```bash
npm i -g @wangai/cli
```

## 快速开始

```bash
wangai --help
wangai init
```

## 语言选项

可通过 `--lang` 控制命令行和交互提示语言：

```bash
wangai --help --lang zh
wangai init --lang zh
wangai init --lang en
```

## `init` 会生成什么

根据你选择的 workflow 生成：

- `.claude/*`
- `.codex/*`
- `.gemini/*`
- `wangai.config.json`

## 交互项

`wangai init` 支持以下选择：

- workflow：`claude`、`codex`、`gemini`、`all`
- 技术栈：`react`、`vue`、`next`、`nuxt`
- 功能开关：router、TypeScript、ESLint、状态管理
- 项目上下文：项目名、项目概述、框架、语言、样式方案

如果项目上下文字段未填写，会写入 `待补充`，并在命令行给出提醒。

## 非交互示例

```bash
wangai init --workflow all --stack next --router y --ts y --eslint y --state redux --project-name MyProject --project-summary "Internal developer platform" --framework "Next.js" --language "TypeScript" --styling "Tailwind CSS" --lang zh --git-exclude y --yes
```

## 模板系统

当前是模板驱动生成：

- `templates/registry.json`：模板到目标路径的映射
- `templates/claude/*`：Claude 模板
- `templates/codex/*`：Codex 模板
- `templates/gemini/*`：Gemini 模板

更新规则的步骤：

1. 修改 `templates/*` 下模板文件
2. 更新 `templates/registry.json` 映射
3. 重新执行 `wangai init`

## 发布

```bash
npm login
npm publish --access public
```
