# Electron 学习与面试要点

&emsp;&emsp;**Electron 是一个用 Web 技术开发跨平台桌面应用的框架**。它把 **Chromium（负责渲染界面）** 和 **Node.js（负责系统能力、文件、网络、进程等）** 组合在一起，让你用 HTML/CSS/JavaScript 写出 Windows、macOS、Linux 上的桌面应用。VS Code、Slack、Discord、Notion、Postman 等都用了 Electron。
&emsp;&emsp;Electron 是网页应用 (web apps) 的一个原生包装层，在 Node.js 环境中运行。Electron 通过将最新版本的 Chromium、V8 和 Node.js 直接与应用程序二进制文件打包在一起，在所有目标平台（macOS、Windows、Linux）上提供出色的体验。

## 核心架构

- **主进程 Main Process**：通常只有一个，运行 Node.js 环境，负责应用生命周期、创建窗口、菜单、托盘、原生对话框、IPC 等。
- **渲染进程 Renderer Process**：每个窗口通常一个，运行 Chromium，负责显示页面。
- **预加载脚本 Preload Script**：在渲染进程加载前执行，充当主进程和渲染进程之间的安全桥梁。
- **IPC 进程通信**：主进程和渲染进程通过 `ipcMain` / `ipcRenderer` 通信。
- **GPU 进程、Utility 进程等**：Chromium 自带的多进程架构。

**优点**：跨平台、前端技术栈复用、生态成熟、Chromium 一致性高。

**缺点**：包体积大、内存占用高、启动相对慢、安全配置不当风险大。

---

## 常见 Electron 面试题及答题要点

### 一、基础与架构

#### 1. 为什么 Electron 选择 Chromium 和 Node.js？

- Electron 的首要目标是提供最佳的用户体验，其次是打造同样出色的开发者体验。
- Chromium 是目前市面上最好的跨平台渲染技术栈。
- Node.js 使用 Chromium 的 V8 JavaScript 引擎，可以同时将两者的优势结合起来。

#### 2. Electron 是什么？原理是什么？

- 基于 Chromium + Node.js + V8。
- Chromium 渲染页面，Node.js 提供系统能力。
- 通过主进程、渲染进程、预加载脚本和 IPC 协作。

#### 3. 主进程和渲染进程有什么区别？

- **主进程**：Node 环境，管理窗口和应用生命周期，只有一个。
- **渲染进程**：Chromium 环境，每个窗口一个，负责 UI。
- 渲染进程默认不能直接访问 Node，需要 preload + IPC。

#### 4. Electron 的进程模型有哪些？

- 主进程、渲染进程、GPU 进程、Utility 进程、插件进程等。
- 每个渲染进程独立，一个页面崩溃通常不影响其他窗口。

#### 5. 为什么 Electron 应用体积大？

- 自带 Chromium 和 Node 运行时，每个应用都打包一份。
- **优化方式**：
  - **asar**：将 `app` 目录打成单个 `.asar` 归档（`electron-builder` 默认 `asar: true`），减少散文件、加快读取；不能当作加密，体积收益有限。
  - **裁剪 locales**：Chromium 自带大量语言包（`locales/*.pak`），只保留目标语言（如 `en-US`、`zh-CN`）；可在 `electron-builder` 配置 `electronLanguages`，或打包脚本里删除多余 `.pak`。
  - **压缩**：前端构建开启 minify、tree-shaking、代码分割；压缩图片/字体/SVG；安装包侧可用 NSIS `compression: maximum` 等选项进一步减小分发体积。
  - **移除无用依赖**：用 `depcheck`、bundle 分析工具审计依赖，删掉未使用的 npm 包；避免 devDependencies 进生产包；大库按需引入，不把整包 SDK 打进主进程。
  - **electron-builder 配置**：用 `files` 白名单排除测试/文档/源码；`asarUnpack` 只解包必须读写的原生模块；按需选择 target（如只要 `portable` 不要 `nsis`）；用 `dir` 目标先分析 `resources/app` 体积再调优。

### 二、IPC 与安全

#### 6. 主进程和渲染进程如何通信？

- **渲染到主**：`ipcRenderer.invoke` + `ipcMain.handle`，推荐异步。
- **主到渲染**：`win.webContents.send` + `ipcRenderer.on`。
- **同步**：`sendSync`，会阻塞，不推荐。
- **渲染到渲染**：通过主进程转发，或 `MessageChannelMain`。

#### 7. preload 和 contextBridge 的作用？

- preload 在页面加载前运行，可访问部分 Node 和 Electron API。
- `contextBridge.exposeInMainWorld` 把白名单 API 暴露给页面，避免直接暴露 `ipcRenderer`。
- 示例：

```js
contextBridge.exposeInMainWorld('api', {
  readFile: (p) => ipcRenderer.invoke('read-file', p)
})
```

#### 8. Electron 安全最佳实践？

- `nodeIntegration: false`
- `contextIsolation: true`
- `sandbox: true`
- 禁用 `remote` 模块
- 设置 CSP，限制导航和新窗口
- IPC 校验 sender 和参数，不暴露危险 API

#### 9. nodeIntegration、contextIsolation、sandbox 分别是什么？

- **nodeIntegration**：渲染进程是否可直接用 Node，默认应关闭。
- **contextIsolation**：隔离页面和 preload 上下文，默认开启。
- **sandbox**：渲染进程沙箱，限制系统访问，Electron 20+ 默认开启。

### 三、生命周期与窗口

#### 10. Electron 应用启动流程？

- `app.whenReady()` 后创建窗口。
- `window-all-closed`：Windows/Linux 退出，macOS 通常不退出。
- `activate`：macOS 点击 Dock 图标时重建窗口。
- `before-quit`、`will-quit` 做清理。

#### 11. 如何避免白屏？

- 使用 `ready-to-show` 后再 `show()`。
- 设置 `backgroundColor`。
- 处理加载失败，开发环境等 dev server 就绪。

#### 12. 如何实现单实例应用？

```js
const gotLock = app.requestSingleInstanceLock()
if (!gotLock) app.quit()
app.on('second-instance', () => { /* 聚焦已有窗口 */ })
```

#### 13. 如何创建无边框、透明、置顶窗口？

- `frame: false`、`transparent: true`、`alwaysOnTop: true`。
- 注意透明窗口在部分平台有兼容问题。

### 四、工程化与性能

#### 14. 如何打包和分发？

- 常用 `electron-builder`、`electron-forge`。
- 生成安装包、便携版、dmg、exe、AppImage 等。
- 需要代码签名，避免系统安全警告。

#### 15. asar 是什么？

- Electron 的归档格式，把源码打包成一个文件。
- 提高读取性能，减少文件数量，但不是加密，仍可解包。

#### 16. 如何自动更新？

- 常用 `electron-updater`。
- 流程：检查更新 → 下载 → 退出安装。
- 需要更新服务器、版本号、签名。

#### 17. 如何使用原生模块？

- Node 原生模块需匹配 Electron ABI。
- 使用 `electron-rebuild` 重新编译。
- 常见问题：ABI 不匹配、Node 版本差异。

#### 18. 主进程被阻塞会怎样？

- 整个应用窗口无响应、菜单卡顿。
- CPU 密集任务放 `utilityProcess`、`worker_threads` 或子进程。
- 不要在主进程做大量同步 IO。

#### 19. 如何优化启动速度和内存？

- 延迟加载、代码分割、减少窗口数。
- 避免大依赖进主进程。
- 使用 asar、压缩、裁剪语言包。
- 及时销毁窗口和监听器，防内存泄漏。

#### 20. 如何调试 Electron？

- **渲染进程**：DevTools。
- **主进程**：`--inspect=5858` 或 VS Code launch 配置。
- **日志**：`electron-log`，**崩溃**：`crashReporter`。

### 五、对比与选型

#### 21. Electron 和 Tauri、NW.js、WebView 有什么区别？

- **Electron**：自带 Chromium + Node，一致性好，体积大。
- **Tauri**：Rust + 系统 WebView，体积小、内存低，但平台 WebView 有差异。
- **NW.js**：类似 Electron，入口和 API 不同。
- **WebView**：只是控件，不是完整桌面框架。

#### 22. Electron 的优缺点？

- **优点**：跨平台、生态好、前端上手快、Chromium 一致。
- **缺点**：包大、内存高、启动慢、安全面大、需处理跨平台差异。

#### 23. 如何拦截新窗口和导航？

- `webContents.setWindowOpenHandler` 控制 `window.open`。
- `will-navigate` 限制页面跳转。
- 只允许可信域名，外部链接用系统浏览器打开。

---

## 面试复习小结

&emsp;&emsp;面试重点通常是：**进程模型、IPC、preload/contextBridge、安全配置、生命周期、打包更新、性能优化、与 Tauri 对比**。能结合一个实际项目讲清楚「怎么创建窗口、怎么通信、怎么保证安全、怎么打包更新」，基本就覆盖了 Electron 面试的核心。
