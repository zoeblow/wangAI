---
name: frontend-standards
description: {{project_name}} 前端代码规范与最佳实践，在 React/Next.js 开发时默认遵循。
---

# Frontend Standards

## 组件规范
- 优先使用函数声明组件。
- Props 接口命名为 `ComponentNameProps`。
- 默认使用 Server Component，只有需要交互时才添加 `"use client"`。
- 单个组件超过 150 行时优先拆分。

## 样式规范
- 使用 项目约定的样式方案。
- className 复杂时统一用合并函数（如 `cn()`）。
- 响应式遵循 mobile-first。
- 暗色模式使用 `dark:` 前缀。

## 数据获取
- Server Component 中使用 async/await 直接取数。
- Client Component 使用 SWR 或 React Query。
- API 路由统一放在 `/api/*`。

## 性能检查
- 图片使用 `next/image`。
- 列表必须使用稳定 key，禁止 index。
- 大列表考虑虚拟滚动。
- 跳转优先 `next/link`。

## 错误处理
- 页面级错误边界使用 `error.tsx`。
- 加载状态使用 `loading.tsx` 或 `Suspense`。
- API 错误建议统一结构：`{ error: string, code: string }`。
