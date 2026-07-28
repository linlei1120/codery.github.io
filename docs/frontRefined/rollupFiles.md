# Rollup 开发文档

Rollup 是面向 **ES Module** 的 JavaScript 模块打包器，擅长产出体积小、结构清晰的库与应用产物。Vite 生产构建、许多组件库（Vue、React 生态等）都以它为底层。

一句话概括：用 ESM 的静态结构做 **Tree Shaking**，把分散模块「卷」成干净、可发布的产物。

---

## 学习路径

| 阶段 | 章节 | 目标 |
| --- | --- | --- |
| 建立心智模型 | [Rollup 概述](#rollup-概述) | 知道它解决什么、和 Webpack/Vite 怎么分工 |
| 动手跑通 | [实践入门](#rollup-实践入门) → [常用命令行](#常用命令行) | 能本地打包并看懂输出 |
| 写对配置 | [配置选项](#配置选项) → [ESM 语法](#rollup-的-esm-语法) | 会配 `input` / `output` / 外部依赖 |
| 进阶能力 | [API 使用](#api-的使用) → [集成](#rollup-集成) → [插件开发](#插件开发) | 能脚本化构建、对接生态、写简单插件 |

---

## Rollup 概述

### 1、它是什么？

Rollup 从入口文件出发，沿 `import` / `export` 解析依赖图，再按目标格式（ESM、CJS、UMD、IIFE、AMD 等）生成一个或多个文件。因为它以 **静态 ESM** 为第一公民，未使用的导出更容易被安全删除（Tree Shaking）。

### 2、核心能力

| 能力 | 说明 |
| --- | --- |
| **Tree Shaking** | 基于 ESM 静态分析，剔除未引用导出 |
| **多格式输出** | 一次构建可同时产出 `esm` / `cjs` / `umd` 等 |
| **插件体系** | 解析、转换、生成阶段均可扩展（Babel、TS、JSON、Node resolve…） |
| **代码分割** | 支持动态 `import()` 与多入口拆包 |
| **库友好** | 产物扁平、可读，适合发布 npm 包 |

### 3、和 Webpack / Vite 的关系

| 工具 | 定位 | 典型场景 |
| --- | --- | --- |
| **Webpack** | 全能应用打包器 | 复杂 Web App、历史项目、多样资源管线 |
| **Rollup** | ESM 优先的打包器 | 组件库、工具库、需要干净产物的包 |
| **Vite** | 开发服务器 + 生产构建 | 开发用原生 ESM；**生产构建默认用 Rollup** |

经验法则：

- 做 **库 / SDK**：优先 Rollup（或基于 Rollup 的封装如 `unbuild`、`tsup`）
- 做 **应用**：日常用 Vite；需要深入理解生产打包时，看的就是 Rollup 配置能力
- 存量 Webpack 应用不必强行迁移；新库项目很少再从 Webpack 起步

### 4、打包流程（心智模型）

```text
读取配置 → 解析入口与依赖图 → 插件转换模块
  → Tree Shaking / 作用域提升 → 按 output 生成代码 → 写出文件
```

插件贯穿全流程：`resolveId` 找文件、`load` 读内容、`transform` 改代码、`generateBundle` / `writeBundle` 处理产物。

---

## 常用命令行

### 1、安装

```bash
# 项目本地（推荐）
pnpm add -D rollup

# 或全局（仅演示用）
npm i -g rollup
```

### 2、常用命令

| 命令 | 作用 |
| --- | --- |
| `rollup -c` | 使用配置文件构建（默认找 `rollup.config.js` / `.mjs` / `.ts` 等） |
| `rollup -c rollup.config.mjs` | 指定配置文件 |
| `rollup -i src/index.js -o dist/bundle.js` | 无配置文件时指定入口与输出 |
| `rollup -i src/index.js -f esm -o dist/index.js` | 指定输出格式 |
| `rollup -c -w` | watch 模式，文件变更自动重建 |
| `rollup -c --environment NODE_ENV:production` | 向配置注入环境变量 |
| `rollup --version` | 查看版本 |

### 3、与 npm scripts 配合

```json
{
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "build:prod": "rollup -c --environment NODE_ENV:production"
  }
}
```

配置里可通过 `process.env.NODE_ENV` 或 Rollup 注入的环境区分开发 / 生产。

### 4、无配置快速试跑

```bash
# 把 src/main.js 打成 IIFE，方便直接丢进浏览器
rollup src/main.js --file dist/bundle.js --format iife --name MyLib
```

| 参数 | 含义 |
| --- | --- |
| `--file` / `-o` | 单文件输出路径 |
| `--format` / `-f` | 输出格式：`esm` `cjs` `umd` `iife` `amd` `system` |
| `--name` | `umd` / `iife` 挂到全局的变量名 |
| `--sourcemap` | 生成 source map |
| `--watch` / `-w` | 监听变更 |

---

## API 的使用

除了 CLI，也可在 Node 脚本里调用编程式 API，适合自定义流水线、CI 或与其他工具编排。

### 1、核心 API：`rollup.rollup`

```js
import { rollup } from 'rollup'

const bundle = await rollup({
  input: 'src/index.js',
  plugins: [],
  external: ['lodash-es'],
})

// 生成（不写盘）
const { output } = await bundle.generate({
  format: 'esm',
  sourcemap: true,
})

for (const chunk of output) {
  if (chunk.type === 'chunk') {
    console.log(chunk.fileName, chunk.code.length)
  }
}

// 或直接写盘
await bundle.write({
  file: 'dist/index.js',
  format: 'esm',
  sourcemap: true,
})

await bundle.close()
```

### 2、`watch` API

```js
import { watch } from 'rollup'

const watcher = watch({
  input: 'src/index.js',
  output: { file: 'dist/index.js', format: 'esm' },
  watch: { clearScreen: true },
})

watcher.on('event', (event) => {
  if (event.code === 'BUNDLE_END') {
    console.log('构建完成，耗时', event.duration, 'ms')
  }
  if (event.code === 'ERROR') {
    console.error(event.error)
  }
})

// 结束监听
// await watcher.close()
```

### 3、多产物一次构建

```js
const bundle = await rollup({ input: 'src/index.js' })

await Promise.all([
  bundle.write({ file: 'dist/index.mjs', format: 'esm' }),
  bundle.write({ file: 'dist/index.cjs', format: 'cjs', exports: 'named' }),
])

await bundle.close()
```

> `generate` 只生成内存结果；`write` 会调用 `generate` 并写入磁盘。用完记得 `close()`，释放句柄与缓存。

---

## Rollup 实践入门

### 1、最小项目结构

```text
my-lib/
├── package.json
├── rollup.config.mjs
├── src/
│   ├── index.js
│   └── utils.js
└── dist/          # 构建产物
```

`src/utils.js`：

```js
export function add(a, b) {
  return a + b
}

export function unused() {
  return '不会被引用则可能被摇掉'
}
```

`src/index.js`：

```js
export { add } from './utils.js'
```

### 2、基础配置

`rollup.config.mjs`：

```js
export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.mjs', format: 'esm', sourcemap: true },
    { file: 'dist/index.cjs', format: 'cjs', exports: 'named', sourcemap: true },
  ],
}
```

执行：

```bash
pnpm add -D rollup
pnpm exec rollup -c
```

打开 `dist/index.mjs`，通常只会看到 `add` 相关代码——这就是 Tree Shaking 的直观效果。

### 3、`package.json` 双格式导出

```json
{
  "name": "my-lib",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "rollup -c"
  }
}
```

### 4、实战检查清单

| 检查项 | 建议 |
| --- | --- |
| 入口是否正确 | `input` 指向公开 API 的 `index` |
| 第三方依赖是否打进包 | 库项目一般放 `external`，由使用者安装 |
| 格式是否匹配消费方 | Node CJS 用 `cjs`；现代打包器用 `esm`；CDN 脚本用 `umd`/`iife` |
| 是否需要压缩 | 生产库可用 `@rollup/plugin-terser` |
| 类型声明 | TS 项目用 `tsc --emitDeclarationOnly` 或 `rollup-plugin-dts` |

---

## Rollup 的 ESM 语法

Rollup 的优化能力建立在 **静态 ESM** 之上。写模块时尽量让依赖关系在编译期可分析。

### 1、推荐写法

```js
// ✅ 静态导入 —— 可分析、可摇树
import { debounce } from 'lodash-es'
export { debounce }

// ✅ 具名导出 —— Tree Shaking 友好
export function formatDate(d) { /* ... */ }

// ✅ 再导出
export { add, mul } from './math.js'
```

### 2、会影响分析的写法

```js
// ⚠️ 动态路径 —— Rollup 无法静态确定文件
const mod = await import(`./locale/${lang}.js`)

// ⚠️ 运行时计算的导出名 —— 不利于摇树
export default {
  [computedKey]: value,
}

// ⚠️ CommonJS 的动态导出
module.exports[name] = fn
```

动态 `import()` **可以**用于代码分割，但路径最好是静态字符串，或配合插件做可枚举映射。

### 3、默认导出与具名导出

| 写法 | 说明 |
| --- | --- |
| `export default ...` | 默认导出；打成 CJS 时注意 `exports: 'default' \| 'named' \| 'auto'` |
| `export const x = 1` | 具名导出；多 API 库更推荐 |
| `export { x as y }` | 导出时改名 |

库若同时有 default 与 named，CJS 互操作容易踩坑，建议：

- 优先 **纯具名导出**，或
- 明确配置 `output.exports`，并用 `@rollup/plugin-commonjs` 处理混用场景

### 4、`import.meta` 与浏览器 / Node

```js
// 在 ESM 中常见
const url = new URL('./asset.svg', import.meta.url)
```

打包进非 ESM 格式时，需确认目标环境是否支持，或用插件替换 `import.meta` 相关用法。

### 5、副作用与 `sideEffects`

若包在 `package.json` 声明：

```json
{
  "sideEffects": false
}
```

表示模块可被安全摇掉（无副作用）。有 CSS 注入、polyfill 等副作用时，应如实标注：

```json
{
  "sideEffects": ["*.css", "./src/polyfill.js"]
}
```

这主要影响 Webpack/Vite 等消费方；Rollup 自身更多依据实际引用关系，但作为库作者仍应正确声明。

---

## Rollup 集成

### 1、常用官方 / 社区插件

| 插件 | 用途 |
| --- | --- |
| `@rollup/plugin-node-resolve` | 解析 `node_modules` 中的包 |
| `@rollup/plugin-commonjs` | 把 CJS 转成 ESM 以便打包 |
| `@rollup/plugin-json` | 允许 `import data from './x.json'` |
| `@rollup/plugin-alias` | 路径别名 |
| `@rollup/plugin-replace` | 编译期字符串替换（如 `process.env.NODE_ENV`） |
| `@rollup/plugin-terser` | 压缩 |
| `@rollup/plugin-typescript` / `rollup-plugin-esbuild` | TypeScript / 高速转译 |
| `@rollup/plugin-babel` | Babel 转换与 polyfill 策略 |
| `rollup-plugin-dts` | 打包 `.d.ts` |
| `rollup-plugin-visualizer` | 产物体积可视化 |
| `rollup-plugin-peer-deps-external` | 自动把 peerDependencies 标为 external |

### 2、典型库配置（JS + 解析 + 压缩）

```js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.mjs', format: 'esm', sourcemap: true },
    { file: 'dist/index.cjs', format: 'cjs', exports: 'named', sourcemap: true },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ browser: true }),
    commonjs(),
    terser(),
  ],
}
```

### 3、与 TypeScript 集成

```js
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: { file: 'dist/index.js', format: 'esm' },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
    }),
  ],
  external: ['vue'], // 示例：框架由宿主提供
}
```

追求构建速度时，也可用 `esbuild` 转译 + 单独生成类型声明。

### 4、与 Vite 的关系

- Vite **开发**：浏览器原生 ESM + 按需编译
- Vite **生产**：内部调用 Rollup；`vite.config.js` 里的 `build.rollupOptions` 即透传给 Rollup

```js
// vite.config.js
export default {
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MyLib',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
}
```

学 Rollup 配置，等于在学 Vite 生产构建的「底层旋钮」。

### 5、与 Babel / PostCSS 等

需要旧浏览器语法降级时接 Babel；处理 CSS/Vue/Svelte 单文件时接对应框架插件。原则是：**解析 → 转译 → 打包 → 压缩**，插件顺序与职责要清晰，避免重复转译。

---

## 配置选项

配置文件可导出对象、数组（多构建）或异步函数。

### 1、入口：`input`

```js
// 单入口
input: 'src/index.js'

// 多入口（代码分割 / 多页面）
input: {
  main: 'src/main.js',
  admin: 'src/admin.js',
}
```

### 2、输出：`output`

| 选项 | 说明 |
| --- | --- |
| `file` | 单文件输出路径（单入口、无拆包时） |
| `dir` | 输出目录（多入口或有代码分割时用 `dir` + `entryFileNames`） |
| `format` | `esm` / `cjs` / `umd` / `iife` / `amd` / `system` |
| `name` | UMD/IIFE 全局名 |
| `globals` | UMD 中外部依赖对应的全局变量，如 `{ vue: 'Vue' }` |
| `sourcemap` | `true` / `false` / `'inline'` |
| `exports` | `auto` / `default` / `named` / `none` |
| `entryFileNames` | 入口 chunk 文件名模式，如 `'[name].js'` |
| `chunkFileNames` | 异步/共享 chunk 文件名 |
| `assetFileNames` | 资源文件名 |
| `banner` / `footer` | 文件头尾追加内容（如许可证） |
| `inlineDynamicImports` | 把动态导入内联进单文件（库有时会用） |
| `preserveModules` | 保留模块目录结构，便于二次打包 / 按需 |

### 3、外部依赖：`external`

```js
// 字符串、正则或函数
external: ['vue', 'lodash-es', /^@my-scope\//]

external: (id) => id === 'react' || id.startsWith('react-dom')
```

库项目把运行时依赖标为 external，可避免把 Vue/React 打进包导致体积膨胀与多实例问题。

### 4、插件与树摇相关

| 选项 | 说明 |
| --- | --- |
| `plugins` | 插件数组，顺序有意义 |
| `treeshake` | `true` / `false` 或细粒度对象（如 `moduleSideEffects`） |
| `onwarn` | 自定义警告处理，过滤噪音或升级为错误 |
| `preserveEntrySignatures` | 控制入口导出签名是否保留 |

```js
treeshake: {
  moduleSideEffects: false, // 更激进；确认模块无副作用再用
}
```

### 5、完整示例（多格式 + 环境）

```js
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'

const isProd = process.env.NODE_ENV === 'production'

export default {
  input: 'src/index.js',
  external: ['vue'],
  plugins: [
    resolve(),
    replace({
      preventAssignment: true,
      values: { 'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development') },
    }),
    isProd && terser(),
  ].filter(Boolean),
  output: [
    {
      file: 'dist/my-lib.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/my-lib.umd.js',
      format: 'umd',
      name: 'MyLib',
      globals: { vue: 'Vue' },
      sourcemap: true,
    },
  ],
  onwarn(warning, warn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') return
    warn(warning)
  },
}
```

### 6、导出多种配置

```js
export default [
  { input: 'src/index.js', output: { file: 'dist/index.mjs', format: 'esm' } },
  { input: 'src/cli.js', output: { file: 'dist/cli.cjs', format: 'cjs' } },
]
```

---

## 插件开发

插件是一个带 `name` 与若干 **钩子（hooks）** 的对象，用于介入解析、转换与生成阶段。

### 1、最小插件

```js
export function myBanner(text = '/* built with rollup */') {
  return {
    name: 'my-banner',
    renderChunk(code) {
      return { code: `${text}\n${code}`, map: null }
    },
  }
}
```

### 2、常用钩子一览

| 钩子 | 阶段 | 典型用途 |
| --- | --- | --- |
| `options` | 初始化 | 改配置或注入默认值 |
| `buildStart` | 构建开始 | 校验环境、清理目录 |
| `resolveId` | 解析 | 自定义路径、虚拟模块、别名 |
| `load` | 加载 | 返回模块源码（含虚拟模块） |
| `transform` | 转换 | Babel/TS、注入代码、改写 AST |
| `moduleParsed` | 解析后 | 分析模块信息 |
| `buildEnd` | 构建结束 | 汇总错误 |
| `renderChunk` | 生成 chunk | 改最终代码、加 banner |
| `generateBundle` | 生成完成 | 增删产物文件 |
| `writeBundle` | 写盘后 | 发通知、再处理文件 |
| `watchChange` | watch | 响应文件变更 |

钩子分 **同步 / 异步**、**并行 / 顺序**；官方文档对每个钩子有明确约定，写插件时需按类型返回 `null`、字符串或 `{ code, map }`。

### 3、虚拟模块示例

```js
export function virtualEnv(env = {}) {
  const virtualId = '\0virtual:env'
  return {
    name: 'virtual-env',
    resolveId(id) {
      if (id === 'virtual:env') return virtualId
    },
    load(id) {
      if (id === virtualId) {
        return `export default ${JSON.stringify(env)}`
      }
    },
  }
}

// 业务代码：import env from 'virtual:env'
```

`\0` 前缀是 Rollup 约定，表示虚拟模块，避免与真实路径冲突。

### 4、transform 示例：简单替换

```js
export function stripDebug() {
  return {
    name: 'strip-debug',
    transform(code, id) {
      if (!id.endsWith('.js')) return null
      return {
        code: code.replace(/console\.log\([^;]*\);?/g, ''),
        map: null, // 生产插件应生成正确 sourcemap
      }
    },
  }
}
```

> 正式插件请用 AST（如 `@rollup/pluginutils` + `estree`）并产出 sourcemap，避免误伤字符串中的内容。

### 5、插件开发建议

| 建议 | 说明 |
| --- | --- |
| **单一职责** | 一个插件只做一类事，便于组合与排序 |
| **善用 `this`** | `this.emitFile`、`this.warn`、`this.error`、`this.getModuleInfo` |
| **明确 external** | 不要把不该打进包的依赖悄悄打包 |
| **测试** | 用小 fixture + `rollup.rollup` API 做单元测试 |
| **文档** | 写清适用 `format`、Peer 依赖与钩子副作用 |

### 6、在配置中使用自定义插件

```js
import { myBanner } from './plugins/my-banner.mjs'
import { virtualEnv } from './plugins/virtual-env.mjs'

export default {
  input: 'src/index.js',
  plugins: [
    virtualEnv({ APP_VERSION: '1.0.0' }),
    myBanner('/*! MyLib v1.0.0 */'),
  ],
  output: { file: 'dist/index.js', format: 'esm' },
}
```

---

## 常见问题速查

| 问题 | 排查方向 |
| --- | --- |
| `Unresolved dependencies` | 缺少 `@rollup/plugin-node-resolve`，或应加入 `external` |
| CJS 包打不进来 | 增加 `@rollup/plugin-commonjs`，注意插件顺序（一般 resolve → commonjs） |
| 默认导出互操作异常 | 检查 `output.exports`、`esModule`，尽量统一导出风格 |
| 体积异常偏大 | 依赖未 external、未开 Tree Shaking、打进了整库（如全量 lodash） |
| 动态 import 未拆包 | 使用 `output.dir` 而非单 `file`；不要开 `inlineDynamicImports` |
| watch 不更新 | 确认变更文件在依赖图内；检查插件是否缓存不当 |

---

## 小结

1. **Rollup** 以 ESM 静态结构为核心，适合库与需要干净产物的场景；Vite 生产构建也基于它。
2. 先跑通 **入口 → output 多格式 → external**，再叠加 resolve / commonjs / terser 等插件。
3. 写库时优先 **具名导出 + 正确 external + `package.json` exports**。
4. 需要定制时用 **编程式 API** 或 **插件钩子**，保持职责单一、顺序清晰。

延伸阅读：[Rollup 官方文档](https://rollupjs.org/) · [插件列表](https://github.com/rollup/plugins) · [Vite 构建选项](https://cn.vitejs.dev/config/build-options.html)
