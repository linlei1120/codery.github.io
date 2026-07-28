# React 入门基础

本篇目标：理解 React 在解决什么问题，搭好开发环境，写出第一个能交互的组件，并搞懂 JSX 的「游戏规则」。

---

## 1、React 在解决什么？

传统操作 DOM 像「手写剧本每一帧」：找节点、改属性、拼 HTML 字符串，逻辑散、易出错。

React 换成 **声明式** 思路：

> 数据变了 → 告诉 React「现在界面应该长这样」→ React 算出差异并更新 DOM。

可以把 React 想成 **智能舞台监督**：你只负责报幕「演员站哪、说什么」，它负责调度布景切换。

### 核心概念速览

| 概念 | 一句话 |
| --- | --- |
| **组件（Component）** | 可复用的 UI 积木，本质是返回 JSX 的函数 |
| **JSX** | 在 JS 里写「像 HTML」的语法，最终编译成函数调用 |
| **Props** | 父组件传给子组件的只读参数 |
| **State** | 组件自己的可变数据；变了就会触发重新渲染 |
| **渲染（Render）** | 根据当前 Props/State 算出 UI 描述 |

---

## 2、创建项目与目录

```bash
npm create vite@latest hello-react -- --template react
cd hello-react
npm install
npm run dev
```

典型目录：

```text
hello-react/
├── index.html          # 挂载点，有一个 <div id="root">
├── src/
│   ├── main.jsx        # 入口：把 App 挂到 root
│   ├── App.jsx         # 根组件
│   ├── App.css
│   └── assets/
└── package.json
```

入口长这样：

```jsx
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- `createRoot(...).render(...)`：把 React 树挂到真实 DOM
- `StrictMode`：开发期帮你发现不安全写法（会故意双重调用部分逻辑，别慌）

---

## 3、第一个组件：点赞按钮

把 `App.jsx` 改成：

```jsx
import { useState } from 'react'

function LikeButton() {
  const [likes, setLikes] = useState(0)

  return (
    <button type="button" onClick={() => setLikes(likes + 1)}>
      👍 {likes}
    </button>
  )
}

export default function App() {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Hello React</h1>
      <p>点一下按钮，数字会增加 —— 这就是「状态驱动视图」。</p>
      <LikeButton />
    </main>
  )
}
```

发生了什么？

1. `useState(0)` 准备一份状态，初始值 `0`
2. 点击时调用 `setLikes`，状态变成新值
3. React 重新执行组件函数，用新 `likes` 画出按钮文字

**记住口诀：改状态 → 再渲染 → UI 自动对齐数据。** 不要自己去 `document.querySelector` 改文字。

---

## 4、JSX 规则（务必吃透）

JSX 看起来像 HTML，但本质是 JavaScript。

### ① 必须有一个根节点

```jsx
// ❌ 相邻多个根
return (
  <h1>标题</h1>
  <p>正文</p>
)

// ✅ 用 Fragment 包一层（不产生多余 DOM）
return (
  <>
    <h1>标题</h1>
    <p>正文</p>
  </>
)
```

### ② 属性用驼峰，类名是 className

```jsx
<div className="card" tabIndex={0} onClick={handleClick}>
  内容
</div>
```

| HTML | JSX |
| --- | --- |
| `class` | `className` |
| `for` | `htmlFor` |
| `onclick` | `onClick` |
| `tabindex` | `tabIndex` |

### ③ 花括号里写表达式

```jsx
const name = 'Codery'
const score = 95

return (
  <p>
    {name} 的分数是 {score >= 60 ? '及格' : '不及格'}
  </p>
)
```

花括号里可以放：变量、运算、函数调用、三元表达式。  
**不能**直接放 `if` 语句（那是语句不是表达式）。

### ④ 样式有两种常见写法

```jsx
// 对象内联（属性驼峰）
<div style={{ backgroundColor: '#f5f5f5', fontSize: 16 }} />

// 或引入 CSS / CSS Modules / 工具类（项目中更推荐）
import './Card.css'
<div className="card" />
```

### ⑤ 列表要加稳定的 key

```jsx
const tags = ['React', 'Hooks', 'JSX']

return (
  <ul>
    {tags.map((tag) => (
      <li key={tag}>{tag}</li>
    ))}
  </ul>
)
```

`key` 帮助 React 识别「哪一项是同一项」。能用业务唯一 id 就别用数组下标（列表会增删排序时下标会骗人）。

### ⑥ JSX 编译结果长什么样？

```jsx
<h1 className="title">Hello</h1>
// 大致等价于
React.createElement('h1', { className: 'title' }, 'Hello')
```

所以「写 JSX」=「描述一棵元素树」，不必手写 `createElement`。

---

## 5、组件就是函数

```jsx
// 函数组件：接收 props，返回 JSX
function Welcome({ name }) {
  return <h2>欢迎，{name}</h2>
}

// 使用
<Welcome name="小林" />
```

约定：

- 组件名 **首字母大写**（小写会被当成原生标签，如 `div`）
- 一个文件通常导出一个主组件；小组件可同文件内定义
- 保持组件「只干一件事」，太大就拆

---

## 6、小练习（建议动手）

1. 做一个计数器：有 `+1` / `-1` / `重置` 三个按钮  
2. 做一个问候语：输入框输入名字，下方显示「你好，xxx」  
3. 观察：不调用 `setXxx`，只改普通变量，界面会不会变？（答案：不会）

完成后进入下一篇：[组件与数据流](./reactComponents) —— 把 Props、条件渲染、列表渲染串起来。
