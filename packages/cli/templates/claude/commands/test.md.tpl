---
description: 为组件或函数生成单元测试
argument-hint: <文件路径>
---

请为以下代码生成单元测试：$ARGUMENTS

## 执行步骤

1. 读取指定路径的代码文件
2. 分析组件/函数的 Props、逻辑、边界情况
3. 生成完整的测试代码
4. **使用 Write 工具将测试文件写入 `src/components/__tests__/ComponentName.test.tsx`（或 `src/lib/__tests__/functionName.test.ts`）**

## 测试框架

- Vitest + React Testing Library
- 如需 Mock，优先使用 `vi.fn()` / `vi.mock()`

## 测试覆盖范围

1. **正常路径**：组件正常渲染、函数正常返回
2. **边界情况**：空值、undefined、空数组、超长字符串
3. **错误处理**：网络请求失败、无效参数
4. **用户交互**：点击、输入、表单提交（如果是交互组件）
5. **Props 变化**：不同 Props 组合下的渲染结果

## 代码规范

- 每个测试用例上方用中文注释说明"测试什么场景"
- `describe` 用组件名 / 函数名
- `it` / `test` 的描述用英文
- 使用 `screen.getByRole` 优先于 `getByTestId`
- Mock 外部依赖，不要发真实网络请求

## 输出要求

- 生成可直接运行的测试代码
- **必须使用 Write 工具保存测试文件**
- 如果 `__tests__/` 目录不存在，自动创建
- 完成后简要告知用户文件路径

## 示例格式

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ArticleCard } from "../ArticleCard";

describe("ArticleCard", () => {
  // 正常渲染：传入完整的文章数据
  it("should render article title and author", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
  });

  // 边界情况：作者名为空
  it("should handle empty author name gracefully", () => {
    render(<ArticleCard article={{ ...mockArticle, author: { name: "", bio: "" } }} />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });
});
```
