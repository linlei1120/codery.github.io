# 路由与页面

单页应用（SPA）不会整页刷新，靠 **前端路由** 根据 URL 切换页面组件。React 生态最常用的是 [React Router](https://reactrouter.com/)。

本篇以 React Router v6+ 的数据路由 / 常用 API 为主，带你搭起「布局 + 多页面」骨架。

---

## 1、安装与最小示例

```bash
npm install react-router-dom
```

```jsx
// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
```

- `BrowserRouter`：用真实 URL（需部署时配置 fallback 到 `index.html`）
- `Routes` / `Route`：声明路径与组件映射
- 嵌套 `Route`：子路由渲染到父布局的 `<Outlet />` 里

---

## 2、布局路由与 Outlet

```jsx
// layouts/AppLayout.jsx
import { NavLink, Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div>
      <header style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #eee' }}>
        <NavLink to="/" end>
          首页
        </NavLink>
        <NavLink to="/about">关于</NavLink>
      </header>

      <main style={{ padding: 16 }}>
        <Outlet /> {/* 子路由页面出现在这里 */}
      </main>
    </div>
  )
}
```

```jsx
// pages/Home.jsx
export default function Home() {
  return <h1>首页</h1>
}
```

`NavLink` 比 `Link` 多一个「当前页」状态，方便加高亮样式：

```jsx
<NavLink
  to="/about"
  style={({ isActive }) => ({ fontWeight: isActive ? 700 : 400 })}
>
  关于
</NavLink>
```

---

## 3、动态路由与参数

```jsx
<Route path="posts/:postId" element={<PostDetail />} />
```

```jsx
import { useParams, Link } from 'react-router-dom'

export default function PostDetail() {
  const { postId } = useParams()

  return (
    <article>
      <h1>文章 #{postId}</h1>
      <Link to="/posts">返回列表</Link>
    </article>
  )
}
```

查询参数用 `useSearchParams`：

```jsx
import { useSearchParams } from 'react-router-dom'

function ProductList() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''

  return (
    <input
      value={q}
      onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})}
      placeholder="搜索商品"
    />
  )
}
```

---

## 4、编程式导航

```jsx
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const navigate = useNavigate()

  async function handleLogin() {
    // await loginApi(...)
    navigate('/dashboard', { replace: true }) // replace：登录后不要回退到登录页
  }

  return <button type="button" onClick={handleLogin}>登录</button>
}
```

| API | 用途 |
| --- | --- |
| `<Link to="...">` | 声明式跳转（优先） |
| `navigate(path)` | 事件 / 请求成功后跳转 |
| `navigate(-1)` | 后退 |
| `{ replace: true }` | 替换历史记录 |

---

## 5、路由守卫（鉴权）

思路：包一层组件，没登录就重定向。

```jsx
import { Navigate, useLocation } from 'react-router-dom'

function RequireAuth({ children, isLogin }) {
  const location = useLocation()

  if (!isLogin) {
    // 记下原本想去的地方，登录后可跳回
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

// 路由里
<Route
  path="dashboard"
  element={
    <RequireAuth isLogin={isLogin}>
      <Dashboard />
    </RequireAuth>
  }
/>
```

```jsx
// Login.jsx
import { useLocation, useNavigate } from 'react-router-dom'

function Login({ onSuccess }) {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  function login() {
    onSuccess()
    navigate(from, { replace: true })
  }

  return <button type="button" onClick={login}>登录</button>
}
```

---

## 6、懒加载页面（减小首包）

```jsx
import { lazy, Suspense } from 'react'
import { Route } from 'react-router-dom'

const Admin = lazy(() => import('./pages/Admin'))

<Route
  path="admin"
  element={
    <Suspense fallback={<p>页面加载中…</p>}>
      <Admin />
    </Suspense>
  }
/>
```

大后台、低频页面特别适合懒加载。

---

## 7、推荐目录结构

```text
src/
├── layouts/
│   └── AppLayout.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── posts/
│   │   ├── PostList.jsx
│   │   └── PostDetail.jsx
│   └── NotFound.jsx
├── components/
├── hooks/
└── main.jsx
```

原则：`pages` 对应路由页面，`components` 放可复用 UI，布局单独放 `layouts`。

---

## 8、完整示意路由表

```jsx
<Routes>
  <Route path="/" element={<AppLayout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="posts" element={<PostList />} />
    <Route path="posts/:postId" element={<PostDetail />} />
    <Route
      path="dashboard"
      element={
        <RequireAuth isLogin={isLogin}>
          <Dashboard />
        </RequireAuth>
      }
    />
  </Route>
  <Route path="/login" element={<Login onSuccess={() => setLogin(true)} />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## 9、小练习

1. 做「首页 / 博客列表 / 博客详情」三页，详情用 `:id`  
2. 列表页支持 `?tag=react` 筛选（`useSearchParams`）  
3. 加一个需登录才能进的「写作」页

下一篇：[状态管理](./reactState) —— 当 props 传来传去太累时怎么办。
