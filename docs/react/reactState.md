# 状态管理

状态放哪，是 React 应用架构的核心问题。本篇帮你建立选型直觉：**能本地就本地，能下传就下传，再考虑全局库。**

---

## 1、先画一张决策图

```text
只在一个组件用？ ──是──▶ useState / useReducer
        │否
        ▼
父子几层能说明白？ ──是──▶ Props 下传 + 回调上传
        │否
        ▼
主题 / 用户 / 语言这类「低频全局」？ ──是──▶ Context
        │否
        ▼
跨多页、频繁更新的业务数据？ ──是──▶ Zustand（轻）或 Redux Toolkit（重）
```

反模式：一上来就把所有东西丢进 Redux —— 会把简单问题复杂化。

---

## 2、状态分层

| 类型 | 例子 | 建议存放 |
| --- | --- | --- |
| UI 局部状态 | 弹窗开闭、输入框、tab | 组件内 `useState` |
| 页面状态 | 列表筛选、分页 | 页面组件或该页自定义 Hook |
| 服务端缓存 | 接口列表、详情 | React Query / SWR（专管服务端状态） |
| 真正的全局客户端状态 | 购物车、登录会话 | Context / Zustand / Redux |

服务端数据和客户端状态要分开想：接口结果更适合「缓存库」，而不是手写一堆 `loading/error` 到全局 store。

---

## 3、Context 进阶：拆分与优化

简单 Context 见 [Hooks 精讲](./reactHooks)。业务里建议 **状态与派发分离**，减少无关重渲染：

```jsx
import { createContext, useContext, useMemo, useState } from 'react'

const AuthStateContext = createContext(null)
const AuthDispatchContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const dispatch = useMemo(
    () => ({
      login: (u) => setUser(u),
      logout: () => setUser(null),
    }),
    []
  )

  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

export function useAuthUser() {
  return useContext(AuthStateContext)
}

export function useAuthActions() {
  return useContext(AuthDispatchContext)
}
```

使用方：

```jsx
function Header() {
  const user = useAuthUser()
  const { logout } = useAuthActions()

  if (!user) return <span>未登录</span>
  return (
    <span>
      {user.name} <button type="button" onClick={logout}>退出</button>
    </span>
  )
}
```

---

## 4、Zustand：轻量全局状态（强烈推荐入门）

```bash
npm install zustand
```

```jsx
// store/useCartStore.js
import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
  totalCount: () => get().items.length,
}))
```

```jsx
function CartBadge() {
  // 只订阅 items.length，其它字段变了也不一定让这里重渲染（按选择器）
  const count = useCartStore((s) => s.items.length)
  return <span>购物车({count})</span>
}

function AddButton({ product }) {
  const addItem = useCartStore((s) => s.addItem)
  return (
    <button type="button" onClick={() => addItem(product)}>
      加入购物车
    </button>
  )
}
```

优点：API 极简、无样板代码、按 selector 订阅、TypeScript 友好。  
多数中小型应用用 Zustand + React Query 就很够用。

### 持久化（可选）

```jsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'settings' } // localStorage key
  )
)
```

---

## 5、Redux Toolkit：何时才需要？

适合：

- 团队已有 Redux 规范 / 大型协作
- 需要强约束的时间旅行调试、中间件生态
- 状态更新规则极复杂、要集中审计

不适合：个人小项目硬上全家桶。

最小切片示例：

```bash
npm install @reduxjs/toolkit react-redux
```

```jsx
// store/counterSlice.js
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1 // Immer 允许「看起来像 mutate」
    },
    addBy: (state, action) => {
      state.value += action.payload
    },
  },
})

export const { increment, addBy } = counterSlice.actions
export default counterSlice.reducer
```

```jsx
// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'

export const store = configureStore({
  reducer: { counter: counterReducer },
})
```

```jsx
// main.jsx
import { Provider } from 'react-redux'
import { store } from './store'

<Provider store={store}>
  <App />
</Provider>
```

```jsx
import { useDispatch, useSelector } from 'react-redux'
import { increment } from './store/counterSlice'

function Counter() {
  const value = useSelector((s) => s.counter.value)
  const dispatch = useDispatch()
  return (
    <button type="button" onClick={() => dispatch(increment())}>
      {value}
    </button>
  )
}
```

---

## 6、服务端状态：React Query 一瞥

```bash
npm install @tanstack/react-query
```

```jsx
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Users />
    </QueryClientProvider>
  )
}

function Users() {
  const { data, isPending, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then((r) => r.json()),
  })

  if (isPending) return <p>加载中</p>
  if (error) return <p>失败</p>
  return <ul>{data.map((u) => <li key={u.id}>{u.name}</li>)}</ul>
}
```

它帮你处理：缓存、重试、窗口聚焦刷新、过期失效 —— 别再把这些手写进 Redux。

---

## 7、实战对比：同一购物车的三种写法

| 方案 | 代码量 | 适用 |
| --- | --- | --- |
| Props 层层传 | 少，但层级一深就痛苦 | 2～3 层组件树 |
| Context | 中 | 登录用户、主题 |
| Zustand | 少且清晰 | 购物车、跨页筛选条件 |

建议练习：把待办列表的 `todos` 抽到 Zustand，任意页面都能读写。

---

## 8、小练习

1. 用 Context 做主题切换（亮/暗），多个页面同步样式  
2. 用 Zustand 实现购物车：加购、改数量、清空  
3. （选做）同一接口分别用裸 `useEffect` 与 React Query 实现，对比代码量

下一篇：[综合实战](./reactPractice) —— 把组件、Hooks、路由、状态串成完整小应用。
