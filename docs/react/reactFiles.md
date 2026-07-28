# React 开发文档

React 是由 Meta（原 Facebook）开源并维护的 **UI 库**，专注于用组件化方式构建用户界面。它采用 **单向数据流** 与 **声明式渲染**：你描述「界面长什么样」，React 负责高效地更新 DOM。

一句话概括：把界面拆成可复用的组件，用 **状态（State）** 驱动视图变化；现代写法以 **函数组件 + Hooks** 为主。

官方文档：[React 中文文档](https://react.docschina.org/)

---

## 和 Vue 的直觉对比

| 维度 | React | Vue |
| --- | --- | --- |
| 定位 | UI 库（路由、状态需自行选型） | 渐进式框架（官方全家桶齐全） |
| 模板 | JSX：HTML 与 JS 写在一起 | SFC：template / script / style 分离 |
| 数据流 | 单向（props 向下，事件向上） | 单向为主，也有 `v-model` 双向语法糖 |
| 响应式 | 调用 `setState` / Hooks 触发更新 | 依赖追踪，改数据自动更新 |
| 复用逻辑 | 自定义 Hooks | Composables / Mixins |

经验法则：大型、高度定制、强 TypeScript 生态的项目里 React 很常见；两者都能做好应用，关键是把 **组件边界** 和 **状态放哪** 想清楚。

---

## 学习路径

按阶段推进，每篇可独立阅读，建议顺序学习：

| 阶段 | 章节 | 你将能做到 |
| --- | --- | --- |
| ① 建立心智模型 | [入门基础](./reactIntro) | 搭好环境，写第一个组件，理解 JSX |
| ② 拼装界面 | [组件与数据流](./reactComponents) | 用 Props / 条件 / 列表拼出真实页面 |
| ③ 管好状态与副作用 | [Hooks 精讲](./reactHooks) | 熟练使用常用 Hooks，会写自定义 Hook |
| ④ 多页面应用 | [路由与页面](./reactRouter) | 用 React Router 做导航与嵌套布局 |
| ⑤ 跨组件共享数据 | [状态管理](./reactState) | 会选 Context / Zustand，知道何时上 Redux |
| ⑥ 动手做完整功能 | [综合实战](./reactPractice) | 完成「待办 + 筛选」迷你应用 |
| ⑦ 上线前的功课 | [性能与工程化](./reactAdvanced) | 性能优化、TS、测试与最佳实践 |

```text
环境与 JSX → 组件与 Props/State → Hooks
    → 路由 → 状态管理 → 实战项目 → 性能与工程化
```

---

## 建议前置知识

- JavaScript ES6+：箭头函数、解构、模块、Promise / async
- HTML / CSS 基础
- （推荐）TypeScript 基础类型，便于阅读进阶篇

---

## 本地快速起步

推荐用 Vite 创建 React 项目（比 CRA 更快、更轻）：

```bash
# npm
npm create vite@latest my-react-app -- --template react

# 或 TypeScript 模板
npm create vite@latest my-react-app -- --template react-ts

cd my-react-app
npm install
npm run dev
```

打开终端提示的本地地址，看到默认页面即表示环境就绪。接下来从 [入门基础](./reactIntro) 开始。
