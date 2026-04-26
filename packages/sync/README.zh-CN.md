# @wangai/sync

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

```bash
wangai-sync login
wangai-sync init
wangai-sync push
wangai-sync pull --from remote
```
