# .codex Migration Notes

本目录由 `.claude/` 迁移生成，目标是让 Codex 在本仓库按相同约束工作。

## 对应关系
- `.claude/skills/*` -> `.codex/skills/*`
- `.claude/agents/*` -> `.codex/agents/*`
- `.claude/commands/*` -> `.codex/commands/*`
- `.claude/settings*.json` -> `.codex/policies/permissions.md` + `.codex/config.template.toml`

## 使用方式
- 会话执行规则入口：`.codex/AGENTS.md`
- 前端规范：`.codex/skills/frontend-standards/SKILL.md`
- 审查代理：`.codex/agents/code-reviewer.md`
- 安全代理：`.codex/agents/security-auditor.md`
- 测试代理：`.codex/agents/test-writer.md`

## 安全说明
- 迁移时已去除原配置中的明文 token。
- 敏感密钥请保存在用户本地安全配置，不要写入仓库。
