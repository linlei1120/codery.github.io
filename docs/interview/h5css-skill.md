# HTML5面试题集

HTML5是互联网的新一代Web内容构建标准，是构建以及呈现互联网内容的一种语言方式，被认为是互联网的核心技术之一。[查看HTML文档](https://www.w3school.com.cn/html/index.asp)
### 1、行内元素和块级元素都有哪些？√
**（1）块级元素**：div、h1~h6、hr、p、li、ul、ol、table、from、blockquote；  
**（2）行内元素**：a、span、img、input、textarea、select；

### 2、HTML5的拖拽如何实现，有哪些API？√
被拖放元素API：

- dragstart: 事件主体为被拖拽元素，在开始拖放元素时触发

- dragend: 事件主体是被拖放元素，整个拖拽操作结束时触发

- drag: 事件主体是被拖放元素，正在拖放元素时触发

目标元素API

- dragenter: 事件主体是目标元素，被拖放元素进入时触发

- dragover: 事件主体是目标元素，被拖放元素在目标元素内移
动时触发

- dragleave: 事件主体是目标元素，被拖放元素移出时触发

- drop: 事件主体是目标元素，整个拖放操作完全结束时触发
```html
<div id="draggable" draggable="true">Drag me!</div>
<div id="dropzone">Drop here!</div>
```
```js{6,11}
// 获取拖拽的元素和放置的区域
var dragItem = document.getElementById('draggable');
var dropZone = document.getElementById('dropzone');
 
// 添加拖拽事件监听
dragItem.addEventListener('dragstart', function(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
});
 
// 添加放置事件监听
dropZone.addEventListener('dragover', function(event) {
  event.preventDefault(); // 阻止默认行为
  event.dataTransfer.dropEffect = 'move'; // 设置可拖动的视觉效果
});
```


### 3、HTML5新增的标签有哪些？√
**媒体标签**：`<video>`、`<audio>`、`<source>`
**语义标签**：`<section>`、`<header>`、`<footer>`、`<article>`、`<aside>`、`<time>`、`<progress>`
**画布标签**：`<canvas>`


# CSS3面试题集

&emsp;&emsp;CSS3 是CSS（层叠样式表）技术的最新标准。主要包括盒子模型、列表模块、超链接方式、语言模块、背景和边框、文字特效、多栏布局、过渡动画、2D/3D转换等模块。[查看CSS文档](https://www.w3school.com.cn/css/index.asp)

### 1、px/em/rem的区别？√

- px：绝对单位长度，相对于显示器屏幕分辨率来定义，大小固定，不随浏览器的缩放而改变；
- em：相对单位长度，相对于当前元素的父元素字体大小定义；
- rem：CSS3引入的一种相对单位长度，它相对于HTML根元素的字体大小，优点是可以通过直接修改根元素字体大小来控制长度比例；初始：`1em = 1rem = 16px`

### 2、什么是回流和重绘？√
**（1）定义及区别**：  
&emsp;&emsp;① 回流指的是浏览器重新计算元素属性，然后绘制经修改后的元素的过程，并重新渲染页面，元素的几何属性发生改变（比如修改元素的宽、高或隐藏元素等）‌；  
&emsp;&emsp;② 重绘指的是浏览器根据元素的样式信息重新绘制页面，‌但没有改变元素的几何属性（比如修改了颜色或背景色）。  
**（2）如何避免回流和重绘**：
- 尽量使用class属性批量修改样式
- 使用transform、opacity等GPU加速属性（仅触发重绘，不触发回流）
- 避免频繁读取布局信息，如offsetTop、offsetLeft

## 3、CSS常用的伪元素有哪些，如何使用√
常用的伪元素有：  
&emsp;&emsp;`::before`（在元素之前插入内容并修改样式）、`::after`（在元素之后插入内容并修改样式）、`::first-letter`（设置第一个字符的样式）、`::first-line`（设置第一行的样式）、`::placeholder`（设置输入字段的占位符）

## 4、CSS选择器的优先级
!important > 内联样式1000 > Id选择器100 > 属性选择器10 > 伪类选择器10 > Class选择器10 > 伪元素选择器1 > 元素选择器1

## 5、标准盒模型和怪异盒模型的区别√
**标准盒模型**：`width = content + margin`

**怪异盒模型**：`width = content + border + padding + margin `

## 6、布局常用属性有哪些√
***flex-direction:*** 弹性容器中子元素排列方式,其包含的值有：row、row-reverse、column、column-reverse

***flex-warp:*** 设置弹性盒子的子元素的换行

***flex-flow:*** 上面这两种属性的简写形式

***align-item:*** 设置弹性盒子元素在侧轴上的对齐方式

***align-content:*** 设置行对齐

***justify-content:*** 设置弹性盒子元素在主轴上的对齐方式

***flex-basis:***   设置子元素在主轴上的初始大小，其值有：auto、%、px

***flex-grow:*** 设置`flex`的增长系数，与flex-basis类似，以比例设置

***flex:1;*** 用于当前子项拉伸的比例；

```js
flex: 1;  
/* 等同于 👇 */
flex-grow: 1;  
flex-shrink: 1;  
flex-basis: 0%;  

```
[参考文档](https://cloud.tencent.com/developer/article/2298135)
## 7、对于BFC的理解√
&emsp;&emsp;BFC（块级格式化上下文）可以理解为CSS元素的一个属性，它属于普通流元素，可以创建一个隔离的/独立的渲染容器。并且可以用于处理外边距重叠现象，可用于清除浮动、阻止元素被浮动元素覆盖等问题；

&emsp;&emsp;触发BFC的方式有：html根元素、浮动元素、`绝对定位元素`、`overflow属性元素等`；

**BFC的典型应用场景：**

**（1）解决外边距重叠问题**

```html
<div class="parent">
  <div class="child">子元素</div>
</div>
```

```css
/* 未触发BFC时，上下外边距会重叠 */
.parent {
  background: #f0f0f0;
  overflow: hidden; /* 触发BFC，阻止外边距重叠 */
}
.child {
  margin-top: 20px;
  height: 50px;
  background: #3498db;
}
```

**（2）清除浮动影响**

```html
<div class="float-container">
  <div class="float-left">左浮动</div>
  <div class="float-right">右浮动</div>
</div>
<div class="content">后面的内容</div>
```

```css
.float-container {
  overflow: hidden; /* 触发BFC，清除浮动影响 */
}
.float-left {
  float: left;
  width: 50%;
}
.content {
  background: #e74c3c;
}
```

**（3）阻止元素被浮动覆盖**

```html
<div class="float-box">浮动元素</div>
<div class="normal-box">普通元素</div>
```

```css
.float-box {
  float: left;
  width: 100px;
  height: 100px;
  background: #3498db;
}
.normal-box {
  overflow: hidden; /* 触发BFC，不被浮动覆盖 */
  background: #2ecc71;
  margin-left: 20px;
}
```

## 8、import和require的区别，加载模块的区别√
&emsp;&emsp;`‌require`和`import`的主要区别在于它们所属的`模块化规范不同`，`加载时机不同`，以及`动态绑定和缓存方式的不同`。

&emsp;&emsp;**(1) 所属规范不同：** `import`是ES6（ECMAScript 2015）引入的关键字，属于ES模块化语法规范，主要用于浏览器端；`require`是CommonJS规范的一部分，主要用于Node.js环境，无法直接用于浏览器端；

&emsp;&emsp;**(2) 加载时机不同：** `import`是***静态引入***，必须在文件的顶部使用，提高了加载效率，但也限制了其使用位置，***编译时加载***；`require`是***动态引入***，可以在代码的任何位置使用，***运行时加载***，更加灵活但可能影响性能‌。

&emsp;&emsp;**(3) 动态绑定和缓存方式不同：** `import`提供静态分析，支持宏类型检验，但无法实现动态绑定；`require`提供动态绑定，适合服务器或浏览器环境，多次要求相同的模块时，只会执行一次，因为`缓存机制`的存在‌。

&emsp;&emsp;**总结：** `import`适合现代前端工程化开发（编译时优化、Tree Shaking），`require`适合Node.js后端或需要动态加载的场景。

**基本用法对比：**

```js
// ============ require (CommonJS) ============
// 导出
module.exports = { name: 'moduleA', fn: function() {} };
// 或
exports.name = 'moduleA';

// 导入
const moduleA = require('./moduleA');
const { name, fn } = require('./moduleA');

// 动态导入（运行时）
const path = require('path'); // 可在任意位置导入
```

```js
// ============ import (ES Module) ============
// 导出
export const name = 'moduleA';
export function fn() {}
// 或默认导出
export default { name: 'moduleA' };

// 导入
import { name, fn } from './moduleA';
import moduleA from './moduleA'; // 导入默认导出

// 按需导入（编译时优化）
import('./moduleA').then(module => {
  // 动态导入
});
```

```js
// ============ 混合使用 (Webpack/Vite) ============
// 在ESM中使用require
const dynamicModule = require(`./modules/${variable}`); // 动态路径
```

## 9、CSS加载是阻塞的吗√

**（1）浏览器渲染流程**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   HTML解析   │ -> │  CSS解析    │ -> │  Render Tree │ -> │   Layout    │
│  (DOM Tree)  │    │ (CSSOM)     │    │  (渲染树)    │    │   (布局)    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                ↓
                                        ┌─────────────┐
                                        │    Paint    │
                                        │   (绘制)    │
                                        └─────────────┘
```

**（2）CSS与DOM解析的关系**

| 阶段 | 是否阻塞 |
|------|---------|
| DOM解析 | 不阻塞（并行进行） |
| DOM渲染 | 阻塞（CSSOM未就绪无法渲染） |



**（3）CSS与JS执行的关系**

&emsp;&emsp;由于JS可以操作DOM和CSS样式，浏览器需要确保执行顺序正确，因此**CSS加载会阻塞JS的执行**。

```
┌─────────────┐         ┌─────────────┐
│  CSS加载中  │ ──────> │ JS执行暂停  │
│ (阻塞资源)  │         │ (等待CSSOM) │
└─────────────┘         └─────────────┘
```


**（4）性能优化建议**

&emsp;&emsp;为避免CSS阻塞页面渲染，需对CSS进行性能优化：
- 合并css文件 — 减少HTTP请求数
- 压缩CSS — 减小文件体积
- CSS异步加载 — 使用 media 属性或 link rel="preload"
- 关键CSS内联 — 首屏CSS直接写入HTML

## 10、localStorage/sessionStorage/cookie的区别

| 特性 | localStorage | sessionStorage | cookie |
|------|-------------|----------------|--------|
| 存储大小 | 约5-10MB | 约5-10MB | 约4KB |
| 生命周期 | 永久保存，需手动清除 | 页面关闭自动清除 | 可设置过期时间 |
| 作用域 | 同源策略（跨窗口共享） | 同源策略（仅当前标签页） | 同源+路径 |
| 数据传输 | 不随请求发送 | 不随请求发送 | 每次请求自动携带 |
| 用途 | 长期存储用户偏好 | 临时会话数据 | 会话追踪、身份验证 |

**基本用法**：
```js
// localStorage
localStorage.setItem('name', '张三');
localStorage.getItem('name');
localStorage.removeItem('name');

// sessionStorage 用法相同
sessionStorage.setItem('token', 'abc123');
```

**cookie特点**：
- 可设置过期时间：`document.cookie = "name=value;expires=过期日期"`
- 可设置路径：`path=/` 限制在特定路径下访问
- 支持httponly：防止XSS攻击（服务端设置）
- 支持secure：仅在HTTPS下传输

## 11、HTML5新增的API

- **Web Storage**：本地存储，localStorage持久存储、sessionStorage会话存储
- **WebSocket**：基于TCP的全双工通信协议，实现服务端与客户端实时双向通信
- **Web Worker**：在后台线程执行脚本，不阻塞主线程，适合复杂计算
- **Geolocation API**：获取用户地理位置信息（需用户授权）
- **History API**：操作浏览器历史记录，支持单页应用路由
  - `pushState()`：添加新历史记录
  - `replaceState()`：替换当前历史记录
  - `popstate`事件：监听浏览器前进后退
- **File API**：读取文件内容，支持文件上传预览
- **Notification API**：向用户发送桌面通知（需用户授权）
- **Drag and Drop API**：原生拖拽API
- **IntersectionObserver**：监听元素进入视口，用于懒加载和无限滚动

## 12、Canvas和SVG的区别

| 特性 | Canvas | SVG |
|------|--------|-----|
| 渲染方式 | 基于像素位图，通过JavaScript绘制 | 基于矢量，通过DOM操作 |
| 分辨率 | 依赖分辨率，放大失真 | 矢量图形，缩放不失真 |
| 事件绑定 | 需手动实现事件检测 | 支持DOM事件绑定 |
| 适用场景 | 游戏、大数据可视化、图表 | 图标、图表、UI组件 |
| 性能 | 频繁重绘时性能更好 | 元素多时性能较差 |
| 内存占用 | 较高（像素数据） | 较低（DOM节点） |

**Canvas基本用法**：
```js
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#3498db';
ctx.fillRect(0, 0, 100, 100);
```

**SVG基本用法**：
```html
<svg width="100" height="100">
  <rect x="0" y="0" width="100" height="100" fill="#3498db"/>
</svg>
```

## 13、语义化标签的理解

**为什么需要语义化**：
- **SEO优化**：搜索引擎能更好地识别页面结构，提升搜索排名
- **可读性高**：团队协作时代码更易理解维护
- **无障碍访问**：屏幕阅读器能准确识别内容，提供更好的阅读体验
- **结构清晰**：便于开发者理解页面各部分的作用

**常用语义标签及用途**：

| 标签 | 用途 |
|------|------|
| header | 页面或区块的头部区域 |
| nav | 导航链接区域 |
| main | 页面主要内容（唯一） |
| article | 独立的文章内容 |
| section | 文档中的章节或分段 |
| aside | 与主内容相关的侧边栏 |
| footer | 页面或区块的底部区域 |
| figure | 独立的流内容（如图文） |
| figcaption | figure的标题说明 |

**示例结构**：
```html
<body>
  <header>网站标题和导航</header>
  <main>
    <article>
      <h1>文章标题</h1>
      <section>章节内容</section>
    </article>
    <aside>侧边栏</aside>
  </main>
  <footer>版权信息和链接</footer>
</body>
```

## 14、清除浮动的方法

**为什么需要清除浮动**：当父元素没有设置固定高度时，子元素浮动会导致父元素高度塌陷，影响页面布局。

**清除浮动的方法**：

**（1）使用overflow属性**
```css
.parent {
  overflow: hidden; /* 或 auto */
}
```

**（2）使用::after伪元素（推荐）**
```css
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
```

**（3）使用clear属性**
```css
.clear {
  clear: both;
}
```

**（4）使用display: flow-root（推荐）**
```css
.parent {
  display: flow-root; /* 创建新的BFC，不影响外部布局 */
}
```

**（5）给父元素设置高度**
```css
.parent {
  height: 200px; /* 简单但不够灵活 */
}
```

**推荐**：优先使用 `display: flow-root`，其次是 `::after` 伪元素方案。

## 15、垂直居中的实现方式

**（1）Flexbox布局（推荐）**
```css
.parent {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;      /* 垂直居中 */
}
```

**（2）Grid布局**
```css
.parent {
  display: grid;
  place-items: center; /* 水平垂直居中 */
}
```

**（3）绝对定位+transform（常用）**
```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**（4）绝对定位+margin**
```css
.child {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

**（5）表格布局**
```css
.parent {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
```

**（6）line-height（仅限单行文本）**
```css
.text {
  height: 40px;
  line-height: 40px;
}
```

## 16、响应式布局实现方案

**（1）媒体查询@media（最常用）**
```css
/* 移动端优先 */
.container {
  width: 100%;
}
@media (min-width: 768px) {
  .container { width: 750px; }
}
@media (min-width: 992px) {
  .container { width: 970px; }
}
@media (min-width: 1200px) {
  .container { width: 1170px; }
}
```

**（2）Flexbox弹性布局**
```css
.container {
  display: flex;
  flex-wrap: wrap;
}
.item {
  flex: 1 1 300px; /* 自动分配空间 */
}
```

**（3）Grid网格布局**
```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
```

**（4）rem/em配合viewport**
```js
// flexible.js核心原理
document.documentElement.style.fontSize = window.innerWidth / 10 + 'px';
```

**（5）vw/vh单位**
```css
.box {
  width: 50vw;  /* 视口宽度的50% */
  height: 30vh; /* 视口高度的30% */
}
```

**（6）百分比布局**
```css
.parent {
  width: 100%;
}
.child {
  width: 50%; /* 父元素的50% */
}
```

## 17、Flexbox和Grid布局对比

| 维度 | Flexbox | Grid |
|------|---------|------|
| 维度 | 一维布局（行或列） | 二维布局（行和列） |
| 控制方式 | 主轴+侧轴 | 网格轨道线 |
| 适用场景 | 导航栏、卡片排列、表单布局 | 页面整体布局、相册网格 |
| 灵活性 | 内容驱动（item自适应） | 容器驱动（定义网格结构） |
| 对齐方式 | justify-content、align-items | justify-items、align-content |

**Flexbox适用场景**：
```css
/* 导航栏 */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

**Grid适用场景**：
```css
/* 页面布局 */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
}
```

**什么时候用哪个**：
- 整体页面布局用 **Grid**
- 组件内部布局用 **Flexbox**
- 两者可配合使用

## 18、CSS3新增特性

**（1）圆角 border-radius**
```css
.box {
  border-radius: 10px;           /* 统一圆角 */
  border-radius: 50%;            /* 圆形 */
  border-radius: 10px 20px 30px 40px; /* 四个角不同 */
}
```

**（2）阴影 box-shadow、text-shadow**
```css
.box {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* 外阴影 */
}
.text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 文字阴影 */
}
```

**（3）渐变 linear-gradient、radial-gradient**
```css
.box {
  background: linear-gradient(to right, red, blue); /* 线性渐变 */
  background: radial-gradient(circle, red, blue);  /* 径向渐变 */
}
```

**（4）边框图片 border-image**
```css
.box {
  border-image: url(border.png) 30 round;
}
```

**（5）滤镜 filter**
```css
.box {
  filter: blur(5px);          /* 模糊 */
  filter: brightness(1.2);    /* 亮度 */
  filter: grayscale(100%);    /* 灰度 */
  filter: sepia(100%);        /* 褐色 */
  filter: contrast(200%);    /* 对比度 */
}
```

**（6）其他新增特性**
- `transform`：2D/3D变换（位移、旋转、缩放、倾斜）
- `transition`：过渡动画
- `animation`：关键帧动画
- `flex`布局
- `grid`布局
- `calc()`：计算属性值
- `var()`：CSS变量
- `backdrop-filter`：背景模糊

## 19、transition和animation的区别

**（1）transition 过渡**
- 需要触发条件（如:hover、点击事件）
- 只能设置开始和结束两个状态
- 适合简单的属性变化
- 写法：`transition: property duration timing-function delay`

```css
.box {
  width: 100px;
  transition: width 0.3s ease, background 0.5s ease;
}
.box:hover {
  width: 200px;
  background: red;
}
```

**（2）animation 动画**
- 无需触发，自动执行
- 可以设置多个关键帧（0%、50%、100%）
- 支持循环播放和暂停
- 适合复杂动画效果

```css
@keyframes move {
  0% { transform: translateX(0); }
  50% { transform: translateX(100px); }
  100% { transform: translateX(0); }
}
.box {
  animation: move 2s ease infinite;
}
```

**（3）对比总结**

| 特性 | transition | animation |
|------|------------|-----------|
| 触发方式 | 需要事件触发 | 自动/事件触发 |
| 关键帧 | 两个状态 | 多个关键帧 |
| 循环 | 不支持 | 支持（infinite） |
| 暂停 | 不支持 | 支持（pause） |
| 适用场景 | 简单过渡效果 | 复杂动画效果 |

## 20、display:none、visibility:hidden、opacity:0的区别

| 属性 | 空间占用 | 事件触发 | 渲染性能 | 子元素继承 |
|------|---------|---------|---------|-----------|
| display:none | 不占用（脱离文档流） | 不触发 | 触发回流和重绘 | 不继承 |
| visibility:hidden | 占用（保留位置） | 不触发 | 仅触发重绘 | 可被子元素覆盖显示 |
| opacity:0 | 占用（占据空间） | 可触发 | 仅触发重绘 | 可被子元素覆盖不透明 |

**详细说明**：

**display:none**
- 元素完全从渲染树中移除，不占据任何空间
- 会触发回流和重绘
- 无法绑定点击等事件
- 子元素无论设置什么都不可见

**visibility:hidden**
- 元素仍占据空间，保留原始布局
- 只触发重绘，不触发回流
- 无法绑定点击等事件
- 子元素可设置 `visibility: visible` 来显示

**opacity:0**
- 元素完全透明但仍占据空间
- 性能最好，仅触发重绘（GPU加速）
- 可以绑定点击等事件（常用于动画）
- 子元素可设置 `opacity: 1` 来覆盖

**应用场景**：
- 频繁显示/隐藏用 `opacity`（配合transition做动画）
- 需要完全隐藏用 `display:none`
- 占位隐藏用 `visibility:hidden`

## 21、CSS预处理器Less/Sass的优势

**（1）变量**
```less
@primary-color: #3498db;
@width: 200px;

.box {
  color: @primary-color;
  width: @width;
}
```

```scss
$primary-color: #3498db;
$width: 200px;

.box {
  color: $primary-color;
  width: $width;
}
```

**（2）混入Mixin（混合宏）**
```less
.border-radius(@radius: 5px) {
  border-radius: @radius;
}
.box {
  .border-radius(10px);
}
```

**（3）嵌套语法**
```less
ul {
  list-style: none;
  li {
    padding: 10px;
    &:hover {
      background: #f0f0f0;
    }
  }
}
```

**（4）运算功能**
```less
@base: 100px;
.box {
  width: @base * 2;
  height: @base + 50px;
}
```

**（5）模块化开发**
```less
// 引入其他less文件
@import './variable.less';
@import './mixin.less';
```

**Less与Sass的区别**：
- 语法：Less用@，Sass用$
- Sass支持条件语句和循环语句
- Less编译速度更快
- 两者功能相似，按团队习惯选择

## 22、移动端适配方案

**（1）viewport视口配置**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```
- width=device-width：视口宽度等于设备宽度
- initial-scale=1.0：初始缩放比例为1
- maximum-scale=1.0：禁止用户缩放

**（2）rem/em适配方案**
```js
// flexible.js核心代码
function setRem() {
  const scale = document.documentElement.clientWidth / 10;
  document.documentElement.style.fontSize = scale + 'px';
}
setRem();
window.addEventListener('resize', setRem);
```
```css
/* 750设计稿，1rem = 75px */
.box {
  width: 5rem; /* 实际375px */
}
```

**（3）vw/vh适配方案**
```css
/* 750设计稿，100vw = 750px，1vw = 7.5px */
.box {
  width: 50vw; /* 375px */
  height: 10vw; /* 75px */
}
```

**（4）媒体查询适配**
```css
/* 常见移动端断点 */
@media screen and (max-width: 375px) { /* iPhone */ }
@media screen and (max-width: 414px) { /* 大屏手机 */ }
@media screen and (min-width: 768px) { /* iPad */ }
@media screen and (min-width: 1024px) { /* 桌面 */ }
```

**（5）lib-flexible + postcss-pxtorem**
- flexible.js：动态设置rem基准值
- postcss-pxtorem：自动将px转换为rem

**移动端适配选择**：
- 简单项目：媒体查询 + 百分比
- 复杂项目：rem + flexible.js
- 现代方案：vw/vh（推荐，兼容性已足够）

## 23、CSS变量自定义属性

**基本语法**：
```css
/* 定义变量 */
:root {
  --primary-color: #3498db;
  --base-font: 16px;
  --spacing: 20px;
}

/* 使用变量 */
.element {
  color: var(--primary-color);
  font-size: var(--base-font);
  padding: var(--spacing);
}
```

**变量默认值**：
```css
.box {
  color: var(--primary-color, #333); /* 第二个参数为默认值 */
}
```

**JavaScript操作CSS变量**：
```js
// 获取变量
const color = getComputedStyle(document.documentElement)
              .getPropertyValue('--primary-color');

// 设置变量
document.documentElement.style.setProperty('--primary-color', 'red');
```

**CSS变量的优势**：
- 统一管理主题颜色和样式值
- 支持动态修改（JavaScript或:hover）
- 减少重复代码
- 提高代码可维护性

**应用场景**：
```css
/* 主题切换 */
[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #fff;
}
[data-theme="light"] {
  --bg-color: #fff;
  --text-color: #333;
}

/* 组件样式隔离 */
.component {
  --button-bg: blue;
}
.component.red {
  --button-bg: red;
}
```

## 24、层叠上下文z-index

**什么是层叠上下文**：层叠上下文是HTML元素的三维概念，每个层叠上下文都有一个独立的层叠水平，决定了元素在Z轴上的显示顺序。

**层叠等级从低到高**：
1. 背景和边框（层叠最低）
2. z-index为负值的定位元素
3. 非定位的块级元素
4. 非定位的浮动元素
5. 行内非定位元素
6. z-index为0的定位元素
7. z-index为正值的定位元素（层叠最高）

**创建层叠上下文的条件**：
- 根元素（html）
- position值为absolute或relative + z-index不为auto
- position值为fixed或sticky
- opacity属性值小于1
- transform属性值不为none
- filter属性值不为none
- mix-blend-mode属性值不为normal
- isolation属性值为isolate
- -webkit-overflow-scrolling设为touch
- z-index值不为auto的flex子元素

**层叠规则**：
- 同层叠上下文内，按照层叠顺序比较
- 不同层叠上下文之间，先比较父级层叠上下文的层叠水平
- 层叠水平相同时，后面的元素在上层

**经典问题：z-index失效**
```css
/* 父元素创建了层叠上下文 */
.parent {
  position: relative;
  z-index: 1; /* 创建层叠上下文 */
}
/* 子元素z-index再高也受父元素限制 */
.child {
  position: absolute;
  z-index: 999; /* 实际效果仍受parent限制 */
}
```
