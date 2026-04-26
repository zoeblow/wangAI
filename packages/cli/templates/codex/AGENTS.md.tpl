# Codex Workspace Rules ({{project_name}})

你在 `{{project_name}}` 项目中工作。请结合项目上下文与工具约束执行任务。

## 优先级
1. 安全与数据保护优先。
2. 类型安全与可维护性优先。
3. 保持项目既定技术栈与风格：`{{framework}} + {{language}} + {{styling}}`。

## 触发规则
- 用户提到 `review` 或 `代码审查`：使用 `.codex/agents/code-reviewer.md`。
- 用户提到 `security` 或 `安全审计`：使用 `.codex/agents/security-auditor.md`。
- 用户提到 `test` 或 `测试`：使用 `.codex/agents/test-writer.md`。
- 用户提到 `doc` 或 `文档`：使用 `.codex/commands/doc.md`。
- 涉及前端实现细节：遵循 `.codex/skills/frontend-standards/SKILL.md`。

## 执行约束
- 不读取或修改敏感文件：`.env*`、`secrets/**`、`**/credentials*`。
- 禁止危险命令：`rm -rf`、`sudo`、破坏性数据库命令。
- 优先使用 `rg` 搜索文件和文本。

## 输出约束
- 审查与安全报告直接输出到会话。
- 文档与测试任务应生成实际文件，不只输出文本。
