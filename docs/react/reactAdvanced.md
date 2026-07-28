# 性能与工程化

本篇面向「能写功能」之后的进阶：少做无用渲染、用 TypeScript 护航、补上测试与工程习惯。

---

## 1、渲染性能：先量再优

React 很快；多数卡顿来自 **不必要的重渲染** 或 **超大列表**，而不是「没用 memo」。

### 排查思路

1. 用 React DevTools → Profiler 看谁在频繁渲染  
2. 问：这次渲染是否必要？数据变了吗？  
3. 再考虑 `memo` / `useMemo` / 虚拟列表

### React.memo：子组件浅比较

```jsx
import { memo } from 'react'

const TaskCard = memo(function TaskCard({ title, onRemove }) {
  console.log('render', title)
  return (
    <div>
      {title}
      <button type="button" onClick={onRemove}>删</button>
    </div>
  )
})
```

注意：父组件若每次传入 **新的函数/对象**，memo 会失效。需配合 `useCallback` / 稳定 props。

### 列表优化

```jsx
// 长列表（上千行）考虑虚拟滚动
// 例如 @tanstack/react-virtual 或 react-window
```

小列表（几十条）不必上虚拟列表，过早优化会增加复杂度。

### 关键状态位置

把频繁变化的状态尽量放在靠近使用它的组件，避免「输入框每敲一字，整棵大树重渲染」。

```text
❌ App 持有 searchKeyword，导致 Sidebar、Chart 全刷
✅ 把搜索框与结果列表抽成 SearchPanel，状态放面板内部
```

---

## 2、并发特性速览（React 18+）

### useTransition：保交互流畅

把「不紧急的更新」标为可中断，优先保证输入跟手：

```jsx
import { useState, useTransition } from 'react'

function FilterList({ items }) {
  const [keyword, setKeyword] = useState('')
  const [list, setList] = useState(items)
  const [isPending, startTransition] = useTransition()

  function onChange(e) {
    const value = e.target.value
    setKeyword(value) // 紧急：输入框立刻更新

    startTransition(() => {
      // 非紧急：过滤大列表可以稍后
      setList(items.filter((i) => i.name.includes(value)))
    })
  }

  return (
    <>
      <input value={keyword} onChange={onChange} />
      {isPending && <span>筛选中…</span>}
      <ul>{list.map((i) => <li key={i.id}>{i.name}</li>)}</ul>
    </>
  )
}
```

### Suspense：等待 UI

配合懒加载路由、数据框架使用，用 fallback 占位：

```jsx
<Suspense fallback={<Loading />}>
  <LazyPage />
</Suspense>
```

---

## 3、Error Boundary：别让白屏吓到用户

类组件（或现成库）可捕获子树渲染错误：

```jsx
import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error(error, info)
    // 可上报监控
  }

  render() {
    if (this.state.hasError) {
      return <h2>出了点问题，请刷新重试</h2>
    }
    return this.props.children
  }
}

// 使用
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

也可直接用 `react-error-boundary` 等封装。

---

## 4、TypeScript + React

```bash
npm create vite@latest my-app -- --template react-ts
```

### 给 Props 类型

```tsx
type Task = {
  id: string
  title: string
  done: boolean
}

type TaskItemProps = {
  task: Task
  onToggle: (id: string) => void
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
      />
      {task.title}
    </label>
  )
}
```

### 常见类型小抄

```tsx
import { useRef, type FormEvent, type ChangeEvent } from 'react'

const inputRef = useRef<HTMLInputElement>(null)

function onSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault()
}

function onChange(e: ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value)
}
```

### Zustand + TS

```ts
import { create } from 'zustand'

type CartState = {
  count: number
  inc: () => void
}

export const useCart = create<CartState>((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}))
```

---

## 5、测试入门（Vitest + Testing Library）

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

```tsx
// TaskForm.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import TaskForm from './TaskForm'

describe('TaskForm', () => {
  it('提交时把标题传给 onAdd', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()

    render(<TaskForm onAdd={onAdd} />)
    await user.type(screen.getByPlaceholderText(/新任务/), '学习测试')
    await user.click(screen.getByRole('button', { name: '添加' }))

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ title: '学习测试' })
    )
  })
})
```

测行为，不测实现细节：用户能看到什么、点了会发生什么。

---

## 6、工程清单与最佳实践

### 目录习惯

```text
src/
  components/     # 可复用 UI
  features/       # 按业务域（auth、cart、board）
  hooks/
  pages/ 或 routes/
  lib/            # 纯工具、api client
  stores/         # zustand 等
  types/
```

### 编码约定（实用向）

| 约定 | 说明 |
| --- | --- |
| 组件小而专 | 一个组件一件事，超过 200 行考虑拆 |
| 派生数据别存 state | 能从已有 state `filter/map` 出来就不要再 useState |
| Effect 少而准 | 先问「是不是同步外部系统」 |
| key 用业务 id | 列表增删排更安全 |
| 样式方案统一 | CSS Modules / Tailwind 选一种主方案 |
| 环境变量 | Vite 用 `import.meta.env.VITE_*`，勿把密钥塞前端 |

### 构建与部署注意

```bash
npm run build
npm run preview
```

- `BrowserRouter` 部署到静态托管时，需把所有路径 fallback 到 `index.html`  
- GitHub Pages 等子路径部署时配置 Vite `base`  
- 生产环境关掉无用 `console`、开启压缩（Vite 默认已处理大部分）

---

## 7、学习闭环建议

```text
官方文档 Tutorial
  → 本站学习路径实战
  → 仿一个真实小产品（记账 / 博客后台 / 问卷）
  → 读优秀开源组件源码（侧重 hooks 设计）
  → 补 TypeScript 与测试
```

遇到问题优先查：

1. [React 官方文档](https://react.docschina.org/)  
2. [React Router](https://reactrouter.com/)  
3. [Zustand](https://zustand.docs.pmnd.rs/) / [TanStack Query](https://tanstack.com/query)

---

## 8、小练习

1. 用 Profiler 观察看板应用：输入标题时哪些组件在渲染，能否缩小范围  
2. 给 `TaskCard` 加上 `memo`，并用 `useCallback` 稳定回调  
3. 把实战项目改成 `react-ts`，为 Task 与 Hook 补全类型  
4. 为「添加任务」写一条 Testing Library 测试

回到总览：[React 开发文档](./reactFiles)。
