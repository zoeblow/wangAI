# Permission Policy (Migrated from .claude/settings*.json)

## Allowlist (recommended)
- `ls`, `cat`, `head`, `tail`, `wc`, `find`, `grep`, `rg`
- `npm install`, `npm run *`, `npm show *`, `npx *`
- `git status`, `git log`, `git diff`, `git show`, `git branch`
- browser/devtools and github MCP tools when needed

## Denylist (mandatory)
- `rm -rf *`
- `sudo *`
- `curl *`, `wget *`（如无明确批准）
- 读取或写入：`.env*`, `secrets/**`, `**/credentials*`

## Pre-check Hooks (logic)
- 命令包含高危片段时阻断：`rm -rf /`, `DROP TABLE`, `DROP DATABASE`
- 编辑路径命中敏感文件时阻断：`.env`, `package-lock.json`, `.git/`

## Post-write Hook (optional)
- 写入后执行格式化：`npx prettier --write <changed-file>`
