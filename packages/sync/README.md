# @wangai/sync

中文 | [English](#english)

`@wangai/sync` 用于把多 AI CLI（Codex / Claude / Gemini / Cursor / OpenClaw）的 `skills` 和 `agents` 统一成一份 baseline，并通过坚果云 WebDAV 同步。

## 功能特性

- 默认中文命令行输出（可 `--lang en` 切英文）
- `login / init / push / pull / status` 命令模型
- 统一 baseline（不按平台拆分）
- pull 自动分发到各平台根目录
- 仅处理 `*.md` 文件（非 markdown 不纳入 baseline）
- 支持平台启用/禁用（例如禁用 `.cursor`）
- Windows / macOS 兼容（默认根目录基于用户主目录）

## 安装

```bash
npm i -g @wangai/sync
```

## 命令

```bash
wangai-sync login
wangai-sync init
wangai-sync push
wangai-sync pull --from baseline
wangai-sync pull --from remote
wangai-sync status
```

## 推荐流程

1. 登录（可重复登录更新密码）

```bash
wangai-sync login
```

2. 初始化平台配置并重建 baseline

```bash
wangai-sync init
```

3. 推送到 WebDAV

```bash
wangai-sync push
```

4. 其他机器拉取并分发

```bash
wangai-sync pull --from remote
```

## 语言切换

默认中文：

```bash
wangai-sync status
```

切英文：

```bash
wangai-sync --lang en status
```

## 配置文件

- `~/.wangai/sync/config.json`：WebDAV 地址、平台根目录、平台启用状态
- `~/.wangai/sync/credentials.json`：WebDAV 用户名和密码
- `~/.wangai/sync/baseline/baseline.json`：统一 baseline

## 安全说明

- 建议使用坚果云应用密码，不要使用主账号密码
- 密码不写入 `config.json`，单独保存在 `credentials.json`
- 如需更高安全等级，可在后续版本接入系统钥匙串

## 文档

- Web 文档页：`docs/index.html`

---

## English

`@wangai/sync` builds one unified baseline of `skills` + `agents` across Codex / Claude / Gemini / Cursor / OpenClaw, then syncs it via Jianguoyun WebDAV.

### Features

- Bilingual CLI (default Chinese, optional English via `--lang en`)
- `login / init / push / pull / status` command model
- Unified baseline (not split by platform)
- `pull` auto fan-out to all enabled platform roots
- Markdown-only baseline (`*.md` only)
- Per-platform enable/disable switch
- Windows / macOS compatible defaults

### Install

```bash
npm i -g @wangai/sync
```

### Commands

```bash
wangai-sync login
wangai-sync init
wangai-sync push
wangai-sync pull --from baseline
wangai-sync pull --from remote
wangai-sync status
```

### Typical flow

```bash
wangai-sync login
wangai-sync init
wangai-sync push
wangai-sync pull --from remote
```

### Language

```bash
wangai-sync --lang en status
```
