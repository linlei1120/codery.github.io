# 综合实战：任务看板

把前面学过的内容收成一个可运行的小应用：**任务看板（Kanban Lite）**。

功能清单：

- 新增任务（标题 + 优先级）
- 按状态分栏：待办 / 进行中 / 已完成
- 拖拽感操作：一键「推进」到下一状态
- 筛选：全部 / 高优先级
- 本地持久化（刷新不丢）
- 两页路由：看板页 + 关于页

学完后你应能独立拆分组件、管理状态、接路由。

---

## 1、目标结构

```text
src/
├── main.jsx
├── App.jsx                 # 路由表
├── layouts/AppLayout.jsx
├── pages/
│   ├── BoardPage.jsx
│   └── AboutPage.jsx
├── components/
│   ├── TaskForm.jsx
│   ├── TaskFilters.jsx
│   ├── Column.jsx
│   └── TaskCard.jsx
├── hooks/useTasks.js       # 状态 + localStorage
└── styles/board.css
```

---

## 2、任务模型与 Hook

```jsx
// hooks/useTasks.js
import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'kanban-lite-tasks'

const STATUSES = ['todo', 'doing', 'done']

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  const [filter, setFilter] = useState('all') // all | high

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask({ title, priority }) {
    const trimmed = title.trim()
    if (!trimmed) return

    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: trimmed,
        priority: priority || 'normal', // normal | high
        status: 'todo',
        createdAt: Date.now(),
      },
    ])
  }

  function advance(id) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const idx = STATUSES.indexOf(t.status)
        const next = STATUSES[Math.min(idx + 1, STATUSES.length - 1)]
        return { ...t, status: next }
      })
    )
  }

  function removeTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const visible = useMemo(() => {
    if (filter === 'high') return tasks.filter((t) => t.priority === 'high')
    return tasks
  }, [tasks, filter])

  const columns = useMemo(() => {
    return {
      todo: visible.filter((t) => t.status === 'todo'),
      doing: visible.filter((t) => t.status === 'doing'),
      done: visible.filter((t) => t.status === 'done'),
    }
  }, [visible])

  return {
    columns,
    filter,
    setFilter,
    addTask,
    advance,
    removeTask,
    total: tasks.length,
  }
}
```

这里把「数据怎么变」收进 Hook，页面只负责组装 UI —— 和真实项目里的习惯一致。

---

## 3、UI 组件

### TaskForm

```jsx
// components/TaskForm.jsx
import { useState } from 'react'

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('normal')

  function handleSubmit(e) {
    e.preventDefault()
    onAdd({ title, priority })
    setTitle('')
    setPriority('normal')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新任务，例如：写 React 实战小结"
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="normal">普通</option>
        <option value="high">高优先</option>
      </select>
      <button type="submit">添加</button>
    </form>
  )
}
```

### TaskFilters

```jsx
// components/TaskFilters.jsx
export default function TaskFilters({ filter, onChange, total }) {
  return (
    <div className="filters">
      <span>共 {total} 条任务</span>
      <div className="filter-btns">
        <button
          type="button"
          className={filter === 'all' ? 'active' : ''}
          onClick={() => onChange('all')}
        >
          全部
        </button>
        <button
          type="button"
          className={filter === 'high' ? 'active' : ''}
          onClick={() => onChange('high')}
        >
          仅高优先
        </button>
      </div>
    </div>
  )
}
```

### TaskCard & Column

```jsx
// components/TaskCard.jsx
export default function TaskCard({ task, onAdvance, onRemove }) {
  return (
    <article className={`task-card ${task.priority === 'high' ? 'high' : ''}`}>
      <h3>{task.title}</h3>
      <p className="meta">
        {task.priority === 'high' ? '🔥 高优先' : '普通'} · {task.status}
      </p>
      <div className="actions">
        {task.status !== 'done' && (
          <button type="button" onClick={() => onAdvance(task.id)}>
            推进 →
          </button>
        )}
        <button type="button" className="danger" onClick={() => onRemove(task.id)}>
          删除
        </button>
      </div>
    </article>
  )
}
```

```jsx
// components/Column.jsx
import TaskCard from './TaskCard'

const TITLES = {
  todo: '待办',
  doing: '进行中',
  done: '已完成',
}

export default function Column({ status, tasks, onAdvance, onRemove }) {
  return (
    <section className="column">
      <header>
        <h2>{TITLES[status]}</h2>
        <span>{tasks.length}</span>
      </header>
      <div className="column-body">
        {tasks.length === 0 && <p className="empty">暂无任务</p>}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onAdvance={onAdvance}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  )
}
```

---

## 4、页面与路由

```jsx
// pages/BoardPage.jsx
import TaskForm from '../components/TaskForm'
import TaskFilters from '../components/TaskFilters'
import Column from '../components/Column'
import { useTasks } from '../hooks/useTasks'
import '../styles/board.css'

export default function BoardPage() {
  const { columns, filter, setFilter, addTask, advance, removeTask, total } =
    useTasks()

  return (
    <div className="board-page">
      <h1>Kanban Lite</h1>
      <p className="subtitle">用 React 状态驱动三列看板 —— 刷新页面数据还在。</p>

      <TaskForm onAdd={addTask} />
      <TaskFilters filter={filter} onChange={setFilter} total={total} />

      <div className="board">
        {['todo', 'doing', 'done'].map((status) => (
          <Column
            key={status}
            status={status}
            tasks={columns[status]}
            onAdvance={advance}
            onRemove={removeTask}
          />
        ))}
      </div>
    </div>
  )
}
```

```jsx
// pages/AboutPage.jsx
export default function AboutPage() {
  return (
    <article>
      <h1>关于这个实战</h1>
      <ul>
        <li>组件拆分与单向数据流</li>
        <li>自定义 Hook + localStorage</li>
        <li>列表 / 条件渲染 / 受控表单</li>
        <li>React Router 多页面</li>
      </ul>
    </article>
  )
}
```

```jsx
// layouts/AppLayout.jsx
import { NavLink, Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="app">
      <nav className="nav">
        <NavLink to="/" end>
          看板
        </NavLink>
        <NavLink to="/about">关于</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}
```

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import BoardPage from './pages/BoardPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<BoardPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  )
}
```

```jsx
// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

记得安装路由：`npm install react-router-dom`。

---

## 5、样式（够用即可）

```css
/* styles/board.css */
.board-page { max-width: 1100px; margin: 0 auto; padding: 1.5rem; font-family: system-ui, sans-serif; }
.subtitle { color: #666; margin-bottom: 1.25rem; }
.task-form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.task-form input { flex: 1; padding: 0.5rem 0.75rem; }
.filters { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.filter-btns button.active { font-weight: 700; }
.board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.column { background: #f4f4f5; border-radius: 12px; padding: 0.75rem; min-height: 280px; }
.column header { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
.task-card { background: #fff; border-radius: 10px; padding: 0.75rem; margin-bottom: 0.5rem; box-shadow: 0 1px 2px rgb(0 0 0 / 6%); }
.task-card.high { border-left: 3px solid #e11d48; }
.task-card .meta { font-size: 0.85rem; color: #71717a; }
.actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
.actions .danger { color: #b91c1c; }
.empty { color: #a1a1aa; font-size: 0.9rem; }
.nav { display: flex; gap: 1rem; padding: 1rem 1.5rem; border-bottom: 1px solid #eee; }
.nav a { text-decoration: none; color: #333; }
.nav a.active { font-weight: 700; }

@media (max-width: 800px) {
  .board { grid-template-columns: 1fr; }
}
```

---

## 6、对照学习检查表

做完后逐项打勾：

- [ ] 状态集中在 `useTasks`，组件通过 props/回调通信  
- [ ] 列表使用稳定 `id` 作为 `key`  
- [ ] 更新任务时用展开语法产生新对象/数组  
- [ ] `useEffect` 同步 localStorage，并理解依赖是 `tasks`  
- [ ] 路由切换时状态仍在（因为 Hook 挂在仍存活的页面；若把状态升到 Layout 可跨页共享）  
- [ ] 筛选不修改原始 `tasks`，而是派生 `visible` / `columns`

---

## 7、加分挑战

1. 用 Zustand 替换 `useTasks`，让「关于页」也能显示任务总数  
2. 给任务加编辑标题（双击进入输入框）  
3. 支持「回退」到上一状态  
4. 接入 React Router 的 `?filter=high`，刷新筛选条件仍保留  

下一篇：[性能与工程化](./reactAdvanced) —— 优化渲染、TypeScript、测试与上线清单。
