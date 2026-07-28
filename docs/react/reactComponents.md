# 组件与数据流

本篇目标：用 **Props 传参、State 存状态、事件响应用户**，再配合条件渲染与列表，拼出接近真实业务的界面。

核心心智模型：

```text
父组件持有状态 ──props──▶ 子组件展示
       ▲                      │
       └──── 回调事件（onXxx）──┘
```

数据往下传，变化往上报 —— 这就是 React 的 **单向数据流**。

---

## 1、Props：组件的「入参」

Props 是只读的。子组件不要直接改 props，想改就通知父组件。

```jsx
function UserCard({ name, role, online }) {
  return (
    <article className="card">
      <h3>{name}</h3>
      <p>角色：{role}</p>
      <span>{online ? '🟢 在线' : '⚪ 离线'}</span>
    </article>
  )
}

// 使用
<UserCard name="小明" role="前端" online />
```

### 默认值与解构

```jsx
function Avatar({ src, size = 40, alt = '头像' }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ borderRadius: '50%' }}
    />
  )
}
```

### children：插槽感

```jsx
function Panel({ title, children }) {
  return (
    <section>
      <h2>{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  )
}

<Panel title="公告">
  <p>本周五下午系统维护。</p>
</Panel>
```

`children` 就是写在开闭标签中间的内容，非常适合做布局壳子。

---

## 2、State：组件的「可变记忆」

用 `useState` 声明状态：

```jsx
import { useState } from 'react'

function Switch() {
  const [on, setOn] = useState(false)

  return (
    <button type="button" onClick={() => setOn(!on)}>
      {on ? '开' : '关'}
    </button>
  )
}
```

### 更新要注意的三点

**① 基于旧值更新时，用函数式写法更稳**

```jsx
// ✅ 推荐：总是基于最新 prev
setCount((prev) => prev + 1)

// 连续点两次时，下面这种可能只 +1（闭包拿到旧值）
setCount(count + 1)
setCount(count + 1)
```

**② State 更新是「排队」，不是同步立刻改变量**

```jsx
setCount(count + 1)
console.log(count) // 仍是旧值！下一轮渲染才是新值
```

**③ 对象 / 数组要「不可变」更新（换新引用）**

```jsx
const [user, setUser] = useState({ name: '小明', age: 20 })

// ❌ 直接改原对象，React 可能检测不到变化
user.age = 21
setUser(user)

// ✅ 展开出新对象
setUser({ ...user, age: 21 })

// 数组同理
setList([...list, newItem])
setList(list.filter((item) => item.id !== id))
```

可以把它想成：React 只认「换了新盒子」，不认「你在旧盒子里偷偷换东西」。

---

## 3、事件处理

React 事件名是驼峰，传的是函数，不是字符串。

```jsx
function SearchBox() {
  const [keyword, setKeyword] = useState('')

  function handleSubmit(e) {
    e.preventDefault() // 阻止表单默认刷新
    alert(`搜索：${keyword}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="输入关键词"
      />
      <button type="submit">搜索</button>
    </form>
  )
}
```

常见模式：

| 场景 | 写法 |
| --- | --- |
| 简单点击 | `onClick={() => doSomething()}` |
| 需要事件对象 | `onClick={(e) => ...}` |
| 传额外参数 | `onClick={() => remove(id)}` |
| 受控输入 | `value` + `onChange` |

**受控组件**：输入框的值完全由 State 控制 —— 单一数据源，调试更清晰。

---

## 4、条件渲染

像说话一样描述「有就显示，没有就隐藏」。

```jsx
function Inbox({ unread }) {
  return (
    <div>
      <h2>收件箱</h2>
      {unread > 0 && <p>你有 {unread} 封未读</p>}
      {unread === 0 ? <p>暂无新消息</p> : <p>快去看看吧</p>}
    </div>
  )
}
```

| 写法 | 适用 |
| --- | --- |
| `条件 && <A />` | 条件为真才渲染 |
| `条件 ? <A /> : <B />` | 二选一 |
| 提前 `return null` | 整个组件不渲染 |

注意：`&&` 左边不要用可能为 `0` 的数字直接当条件（`0 && <X />` 会渲染出 `0`）。写成 `count > 0 && ...` 更安全。

---

## 5、列表渲染

```jsx
const products = [
  { id: 'p1', name: '键盘', price: 299 },
  { id: 'p2', name: '鼠标', price: 129 },
]

function ProductList({ items }) {
  if (items.length === 0) {
    return <p>暂无商品</p>
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name} — ¥{item.price}
        </li>
      ))}
    </ul>
  )
}
```

**key 的选择：**

- ✅ 后端 id、UUID、稳定业务键
- ⚠️ 数组下标：仅当列表静态、永不重排时勉强可用
- ❌ 随机数：每次渲染都变，等于没 key

---

## 6、组合实战：简易待办列表（无持久化）

把本篇知识串起来：

```jsx
import { useState } from 'react'

function TodoApp() {
  const [text, setText] = useState('')
  const [todos, setTodos] = useState([
    { id: 1, title: '学习 Props', done: true },
    { id: 2, title: '练习列表渲染', done: false },
  ])

  function addTodo(e) {
    e.preventDefault()
    const title = text.trim()
    if (!title) return

    setTodos((prev) => [
      ...prev,
      { id: Date.now(), title, done: false },
    ])
    setText('')
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  function removeTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div style={{ maxWidth: 420, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>今日待办</h1>

      <form onSubmit={addTodo} style={{ display: 'flex', gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="下一件要做的事"
          style={{ flex: 1 }}
        />
        <button type="submit">添加</button>
      </form>

      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 8,
              opacity: todo.done ? 0.5 : 1,
            }}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ flex: 1, textDecoration: todo.done ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
            <button type="button" onClick={() => removeTodo(todo.id)}>
              删除
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p>空空如也，去添加一条吧～</p>}
    </div>
  )
}

export default TodoApp
```

对照检查：

- 输入框是受控组件
- 列表用稳定 `id` 当 key
- 增删改都返回新数组 / 新对象
- 空列表有条件提示

---

## 7、组件拆分：别把一切塞进 App

当 `TodoApp` 变长时，可以拆：

```text
TodoApp          → 持有 todos 状态
 ├─ TodoForm     → 负责输入与提交（通过回调把 title 交上去）
 └─ TodoList
     └─ TodoItem → 展示单项，触发 toggle / remove
```

```jsx
function TodoItem({ todo, onToggle, onRemove }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.title}</span>
      <button type="button" onClick={() => onRemove(todo.id)}>删除</button>
    </li>
  )
}
```

父组件「拥有数据」，子组件「展示 + 上报意图」。这样职责清晰，后面接 Hooks、状态库也更顺。

---

## 8、小练习

1. 给待办加「已完成 / 未完成」筛选按钮  
2. 拆出 `TodoForm`、`TodoItem` 两个子组件  
3. 加一个统计行：`共 N 项，已完成 M 项`

下一篇进入 React 的「瑞士军刀」：[Hooks 精讲](./reactHooks)。
