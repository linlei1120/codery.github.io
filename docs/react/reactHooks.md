# Hooks 精讲

Hooks 让函数组件也能拥有状态、副作用、缓存等能力。现代 React **默认用函数组件 + Hooks**，类组件只需了解存量代码即可。

本篇覆盖：常用内置 Hook、自定义 Hook、以及容易踩的坑。

---

## Hooks 使用规则（铁律）

1. **只在函数组件或自定义 Hook 顶层调用** —— 不要放进 `if` / `for` / 嵌套函数  
2. **每次渲染调用顺序必须一致** —— 所以禁止条件调用  
3. 自定义 Hook 以 `use` 开头（约定，便于 lint 检查）

```jsx
// ❌ 错误
if (ok) {
  const [x, setX] = useState(0)
}

// ✅ 正确：无条件调用，再用条件决定逻辑
const [x, setX] = useState(0)
if (ok) {
  // 使用 x
}
```

---

## 1、useState：组件记忆

见 [组件与数据流](./reactComponents)。补充两个实用技巧：

### 惰性初始化

初始值计算很贵时，传函数，只在首次渲染执行：

```jsx
const [data, setData] = useState(() => {
  return JSON.parse(localStorage.getItem('cache') || '[]')
})
```

### 多个相关字段：一个对象还是多个 state？

- 总是一起更新 → 可以合成一个对象  
- 彼此独立 → 拆成多个 `useState` 更清晰  

```jsx
// 表单字段经常一起提交，用对象合适
const [form, setForm] = useState({ name: '', email: '' })

setForm((prev) => ({ ...prev, name: '小明' }))
```

---

## 2、useEffect：同步外部世界

「渲染完成后，去做点额外的事」：请求接口、订阅事件、改 `document.title`、读写 localStorage……

```jsx
import { useEffect, useState } from 'react'

function DocumentTitle({ title }) {
  useEffect(() => {
    document.title = title
  }, [title]) // 依赖变了才重新执行

  return <p>当前标题：{title}</p>
}
```

### 依赖数组怎么理解？

| 写法 | 行为 |
| --- | --- |
| `useEffect(fn)` | 每次渲染后都跑 |
| `useEffect(fn, [])` | 只在挂载后跑一次（类似 componentDidMount） |
| `useEffect(fn, [a, b])` | `a` 或 `b` 变化时再跑 |

### 清理函数：离开时收尾

订阅、定时器、AbortController 一定要清理，否则会泄漏或「卸载后还 setState」。

```jsx
useEffect(() => {
  const id = setInterval(() => {
    console.log('tick')
  }, 1000)

  return () => clearInterval(id) // 组件卸载或下次 effect 前执行
}, [])
```

### 经典实战：请求数据

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('加载失败')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setUser(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true // 避免快速切换 userId 时旧请求覆盖新结果
    }
  }, [userId])

  if (loading) return <p>加载中…</p>
  if (error) return <p>出错了：{error}</p>
  if (!user) return null

  return <h2>{user.name}</h2>
}
```

口诀：**Effect 负责「对接 React 之外的世界」，不是用来「根据 A 算 B」**（那种用渲染期直接算，或 `useMemo`）。

---

## 3、useRef：盒子里的可变值（不触发渲染）

两种常见用途：

### ① 拿到 DOM 节点

```jsx
function FocusInput() {
  const inputRef = useRef(null)

  return (
    <>
      <input ref={inputRef} />
      <button type="button" onClick={() => inputRef.current?.focus()}>
        聚焦
      </button>
    </>
  )
}
```

### ② 记住上一轮的值 / 定时器 id

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0)
  const idRef = useRef(null)

  function start() {
    if (idRef.current) return
    idRef.current = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
  }

  function stop() {
    clearInterval(idRef.current)
    idRef.current = null
  }

  useEffect(() => () => stop(), [])

  return (
    <div>
      <p>{seconds}s</p>
      <button type="button" onClick={start}>开始</button>
      <button type="button" onClick={stop}>停止</button>
    </div>
  )
}
```

`ref.current` 改了 **不会** 重新渲染 —— 适合存「和渲染无关」的东西。

---

## 4、useContext：跨层传参，告别层层 Props

当很多中间组件只是「把 props 往下传」，可以用 Context。

```jsx
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext('light')

function App() {
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={theme}>
      <button type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
      <Toolbar />
    </ThemeContext.Provider>
  )
}

function Toolbar() {
  return <ThemedButton />
}

function ThemedButton() {
  const theme = useContext(ThemeContext)
  return <button type="button">当前主题：{theme}</button>
}
```

适合：主题、当前用户、语言包。  
**不适合**把所有业务状态都塞进一个巨型 Context（一变全树重渲染）。复杂共享状态见 [状态管理](./reactState)。

---

## 5、useMemo / useCallback：按需缓存

先记住原则：**多数时候不需要。** 先写清楚，真有性能问题再加。

### useMemo：缓存计算结果

```jsx
const expensive = useMemo(() => {
  return heavyCompute(list)
}, [list])
```

### useCallback：缓存函数引用

常和 `React.memo` 子组件搭配，避免子组件因「新函数」而白重渲染：

```jsx
const handleRemove = useCallback((id) => {
  setItems((prev) => prev.filter((i) => i.id !== id))
}, [])

return <ItemList onRemove={handleRemove} />
```

类比：`useMemo` 记「算出来的答案」，`useCallback` 记「同一把钥匙（函数引用）」。

---

## 6、useReducer：复杂状态机

当 `useState` 的更新逻辑散落各处，可集中到 reducer：

```jsx
import { useReducer } from 'react'

function cartReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, action.item]
    case 'remove':
      return state.filter((i) => i.id !== action.id)
    case 'clear':
      return []
    default:
      return state
  }
}

function Cart() {
  const [items, dispatch] = useReducer(cartReducer, [])

  return (
    <>
      <button type="button" onClick={() => dispatch({ type: 'add', item: { id: 1, name: '书' } })}>
        加购
      </button>
      <button type="button" onClick={() => dispatch({ type: 'clear' })}>
        清空
      </button>
      <p>共 {items.length} 件</p>
    </>
  )
}
```

适合：多步骤表单、可撤销操作、状态转换规则多的场景。

---

## 7、自定义 Hook：把逻辑打包带走

自定义 Hook = 把一组 Hooks 抽成可复用函数。

### 示例：useLocalStorage

```jsx
import { useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw != null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

// 使用
function Notes() {
  const [notes, setNotes] = useLocalStorage('notes', [])
  // ...
}
```

### 示例：useOnlineStatus

```jsx
import { useEffect, useState } from 'react'

export function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  return online
}
```

抽 Hook 的信号：同一段「状态 + effect」在多个组件重复出现。

---

## 8、常见坑速查

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 改了对象界面不变 | 原地 mutate | 展开成新对象/数组再 set |
| Effect 死循环 | 依赖里放了每次新建的对象/函数 | 稳定依赖，或拆小依赖 |
| 卸载后仍 setState | 异步请求返回太晚 | cleanup 里取消 / 设 cancelled 标志 |
| StrictMode 下 Effect 跑两次 | 开发模式故意检测副作用 | 确保有正确 cleanup，生产不会双调挂载逻辑 |

---

## 9、小练习

1. 用 `useEffect` 实现：搜索框防抖 300ms 后再 `console.log` 关键词  
2. 写一个 `useToggle(initial)` 返回 `[value, toggle, setValue]`  
3. 用 `useReducer` 重写待办的增删改

下一篇：[路由与页面](./reactRouter) —— 把多个页面串成真正的应用。
