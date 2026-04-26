# wangAI Monorepo

多包仓库，当前包含：

- `packages/cli` -> `@wangai/cli`
- `packages/sync` -> `@wangai/sync`

## 目录结构

```text
wangAI/
  packages/
    cli/
    sync/
```

## 本地开发

```bash
npm install
npm run start:cli
npm run start:sync
```

## 文档发布（GitHub Pages /docs）

根目录 `docs/` 作为统一入口：

- `/docs/index.html`：文档导航页
- `/docs/cli/*`：`packages/cli/docs` 同步结果
- `/docs/sync/*`：`packages/sync/docs` 同步结果

每次更新子包文档后执行：

```bash
npm run docs:sync
```

## 发布说明

- `@wangai/cli`：在 `packages/cli` 下发布
- `@wangai/sync`：在 `packages/sync` 下发布
