# 微前端

### 什么是微前端？微前端主要解决什么问题？

*微前端是一种借鉴了后端微服务架构的一种前端架构模式，主要是将大型前端应用拆分为多个独立开发、测试、部署的小型应用也称为微应用，然后在主应用中组合运行；类似于组合搭积木；也可以将微前端中的主应用当作是一个容器对应用进行聚合，常见于中后台项目；*

*微前端的特点包括：技术独立性、独立部署、渐进式升级；*

*微前端主要解决问题包括：老旧技术现代化改造迁移(新老应用共用)、大型复杂项目拆分、大型团队协作。*

### 2、`qiankun`微前端框架有什么特点？

`qiankun`是基于`single-spa`的微前端框架，提供了更加完整、易用的解决方案。

#### 2.1 核心特点

- **基于 single-spa**：继承 single-spa 的沙箱隔离机制，并进行了优化增强
- **HTML Entry 方式**：通过解析 HTML 文件自动获取静态资源，无需手动配置资源列表
- **样式隔离**：自动处理微应用之间的样式冲突，支持 CSS Modules、less、sass 等预处理器的样式隔离
- **JS 沙箱**：提供可靠的 JS 隔离机制，防止全局变量污染
- **预加载**：应用启动时预先加载微应用资源，提升切换体验
- **umd 输出**：兼容任何框架开发的子应用

#### 2.2 架构原理

```
┌─────────────────────────────────────────────────────────┐
│                      主应用 (Container)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  注册微应用  │  │   沙箱隔离   │  │  路由劫持    │      │
│  │ registerMicroApps │  │ Sandbox │  │            │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────┘
           │               │               │
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  微应用A  │    │  微应用B  │    │  微应用C  │
    │  Vue/React│    │  Vue/React│    │  Vue/React│
    └──────────┘    └──────────┘    └──────────┘
```

#### 2.2.1 微应用跨域问题如何解决？

微应用往往独立部署在不同端口或域名（如主应用在 `a.com`，子应用在 `b.com:3000`）。qiankun 采用 **HTML Entry**：主应用在浏览器里 **fetch 子应用的入口 HTML**，再解析其中的 `<script>`、`<link>` 并继续拉取 JS/CSS。这一步属于跨源网络请求，仍受浏览器 **同源策略 / CORS** 约束，qiankun 并不会像 iframe 那样自动绕过限制。

常见应对方式：

| 场景 | 做法 |
|------|------|
| **开发环境** | 子应用 `devServer` 响应头增加 `Access-Control-Allow-Origin`（或允许主应用源），使入口 HTML 与静态资源可被 fetch |
| **开发环境（推荐）** | 主应用 **反向代理**：把 `/micro-react/` 等路径代理到子应用本地地址，对外表现为 **同域**，无需浏览器跨域 |
| **生产环境** | 网关 / Nginx 将各微应用挂到 **同一主域** 的不同路径或子域，入口 URL 与主应用同源或已配置 CORS |
| **定制请求** | `start({ fetch: customFetch })` 统一加凭证、走 BFF，或配合代理改写请求 |

资源加载完成后，脚本在 **同一页面** 内通过 **JS 沙箱** 执行，子应用之间并不互相直接请求对方域名；跨域主要出现在 **「主应用加载子应用静态资源」** 这一环。应用间通信用 `props` / `initGlobalState`，与加载子应用时的 CORS 是不同问题。

**打个比方：** 主应用像 **商场前台**，子应用像 **隔壁街区的专柜**。qiankun 的工作是前台派人去专柜 **把「开业说明书」（HTML）和货品（JS/CSS）取回来**，在本店一块场地里搭开展示（沙箱里运行）。浏览器规定：去 **别的街区** 拿货，对方专柜必须 **同意放行**（CORS）；或者让 **商场统一从自家仓库门进出货**（同域 + 反向代理），顾客眼里全是「本商场内部流转」，就不算跨街了。

**本地开发小例子：**

- 主应用：`http://localhost:8080`（qiankun 基座）
- React 子应用：`http://localhost:3000`（`entry` 填这个地址）

注册时主应用会去拉 `http://localhost:3000` 的 HTML。端口不同 = **不同源**，控制台可能出现 *blocked by CORS*。

**做法 A — 子应用「同意放行」**（3000 端口 devServer 加响应头，示意）：

```javascript
// webpack / vue-cli 等 devServer 配置
devServer: {
  port: 3000,
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:8080', // 或开发阶段用 '*'
  },
}
```

**做法 B — 主应用「统一从自家门进货」**（推荐，8080 代理到 3000）：

```javascript
// 主应用 devServer
devServer: {
  port: 8080,
  proxy: {
    '/micro-react': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: { '^/micro-react': '' },
    },
  },
}

// qiankun 注册时 entry 改为同域路径，而不是直连 3000
registerMicroApps([
  { name: 'react-app', entry: '/micro-react/', container: '#container', activeRule: '/react' },
]);
```

浏览器只请求 `localhost:8080/micro-react/...`，由 devServer 转发到 3000，**对浏览器来说全程同源**，跨域问题自然消失。

#### 2.3 JS 沙箱原理

qiankun 通过代理 `window` 对象实现 JS 隔离：

```javascript
// 快照沙箱 (SnapshotSandbox)
- 应用激活时记录当前 window 状态快照
- 应用失活时恢复快照
- 适用于低版本浏览器

// 代理沙箱 (ProxySandbox)
- 为每个微应用创建独立的 window 代理
- 应用运行在独立的作用域内
- 支持同时运行多个微应用
```

#### 2.4 样式隔离策略

| 策略 | 说明 |
|------|------|
| **Shadow DOM** | 使用 Web Component 的 Shadow DOM 特性隔离样式 |
| **CSS Modules** | 通过命名空间前缀隔离样式类名 |
| **动态样式标签** | 微应用样式只对自身容器生效 |

#### 2.5 快速使用

**主应用配置：**

```javascript
import { loadMicroApp } from 'qiankun';

// 方式一：手动加载
const microApp = loadMicroApp({
  name: 'react-app',
  entry: '//localhost:3000',
  container: '#container',
  props: { data: '传递给子应用的数据' }
});

// 方式二：注册机制 + 路由匹配
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:3000',
    container: '#container',
    activeRule: '/react'
  },
  {
    name: 'vue-app',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/vue'
  }
]);

start({
  prefetch: true,      // 预加载
  sandbox: {           // 沙箱配置
    strictStyleIsolation: true  // 严格样式隔离
  }
});
```

**子应用配置：**

```javascript
// React 应用
import { lifecycle } from 'qiankun';

function App() {
  return <div>React 微应用</div>;
}

lifecycle.mount((props) => {
  ReactDOM.render(<App />, document.getElementById('root'));
  return () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  };
});

// Vue 应用
import { lifecycle } from 'qiankun';

let app = null;

lifecycle.mount((props) => {
  app = new Vue({
    render: h => h(App)
  }).$mount('#app');
  return () => {
    app.$destroy();
    app.$el.innerHTML = '';
  };
});
```

#### 2.6 微应用导出生命周期

子应用必须导出以下生命周期函数：

```javascript
export async function bootstrap() {
  // 应用初始化时调用一次
  console.log('微应用初始化');
}

export async function mount(props) {
  // 应用挂载时调用
  // props 包含主应用传递的数据
  console.log('微应用挂载', props);
}

export async function unmount() {
  // 应用卸载时调用
  console.log('微应用卸载');
}

export async function update(props) {
  // 可选：热更新时调用
  console.log('微应用更新', props);
}
```

#### 2.7 父子应用通信

**方式一：通过 props 传递：**

```javascript
// 主应用
<MicroApp name="app" data={{ token: 'xxx' }} />

// 子应用
export function mount(props) {
  const { data } = props;
  console.log(data.token); // 'xxx'
}
```

**方式二：使用 initGlobalState：**

```javascript
// 主应用
import { initGlobalState } from 'qiankun';

const actions = initGlobalState({ user: null });

// 监听全局状态变化
actions.onGlobalStateChange((state, prev) => {
  console.log('状态变化:', state, '之前:', prev);
});

// 设置全局状态
actions.setGlobalState({ user: { name: '张三' } });

// 子应用
import { initGlobalState } from 'qiankun';

const actions = initGlobalState({ name: 'app' });

// 获取最新状态
actions.getGlobalState();

// 监听状态变化
actions.onGlobalStateChange((state) => {
  console.log('状态变化:', state);
});
```

#### 2.8 常见问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| 样式污染 | 开启 `strictStyleIsolation` 或使用 CSS Modules |
| 全局事件监听未清理 | 在 unmount 中手动 removeEventListener |
| 子应用静态资源 404 | 配置 webpack devServer 的 `headers` 和 `port` |
| 入口 HTML / JS 跨域失败 | 子应用开 CORS，或主应用 devServer / Nginx 同源代理子应用 `entry` |
| 应用间通信复杂 | 使用 Redux/Vuex + initGlobalState |
| 子应用首次加载慢 | 开启 prefetch 预加载功能 |

#### 2.9 与其他方案对比

| 特性 | qiankun | iframe | single-spa |
|------|---------|--------|------------|
| 样式隔离 | ✅ | ✅ | ❌ |
| JS 沙箱 | ✅ | ✅ | ❌ |
| 接入成本 | 低 | 低 | 高 |
| 体验流畅度 | 优 | 一般 | 优 |
| SEO 友好 | ✅ | ❌ | ✅ |
| 通信机制 | 完善 | 受限 | 基础 |