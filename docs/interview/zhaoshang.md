# 招商 / 综合前端笔试题整理与解析

> 本文根据原始试卷截图与对话记录整理，共 **29** 道有效题目（原卷中未收录的题号未臆造补题）。  
> 每题结构统一为：**题目 → 选项 → 正确答案 → 解析**，便于检索与复习。

---

## 目录

| 章节 | 题号 |
| --- | --- |
| [一、JavaScript 语言基础](#一javascript-语言基础) | 1～10 |
| [二、异步编程与网络](#二异步编程与网络) | 11～15 |
| [三、this 与作用域](#三this-与作用域) | 16～18 |
| [四、ES6 类与模块](#四es6-类与模块) | 19～20 |
| [五、React](#五react) | 21～24 |
| [六、CSS 与布局](#六css-与布局) | 25～29 |

---

## 一、JavaScript 语言基础

### 第 1 题：`Array.prototype.concat`

**考点**：数组合并、`concat` 对嵌套数组的展开规则。

#### 题目

```js
var Arr = [1, 2, 3];
var Arr2 = Arr.concat(4, [5, 6]);
```

问：`Arr2` 的值是什么？

#### 选项（示意）

1. `[1, 2, 3, 4]`
2. `[1, 2, 3, [5, 6]]`
3. `[1, 2, 3, 4, 5, 6]`
4. 其他

#### 正确答案

`[1, 2, 3, 4, 5, 6]`（第 3 项）

#### 解析

`concat()` 返回新数组，不会修改原数组。传入的数组参数会**展开一层**，因此 `[5, 6]` 变为元素 `5`、`6`，而不是嵌套数组。

---

### 第 2 题：冻结对象并防止修改

**考点**：`Object.freeze` 与浅冻结。

#### 题目

JavaScript 中，停止开发一个对象并防止其被修改的一种方法是什么？

#### 选项

1. `Object.halt()`
2. `Object.hold()`
3. `Object.freeze()`
4. `Object.stop()`

#### 正确答案

`Object.freeze()`（第 3 项）

#### 解析

冻结后不能增删改属性、不能改属性描述符。注意是**浅冻结**，嵌套对象仍需递归冻结才能完全不可变。

```js
const obj = { name: "Tom" };
Object.freeze(obj);
obj.age = 18;      // 无效（严格模式会抛错）
obj.name = "Jack"; // 无效
```

---

### 第 3 题：`for`、`continue` 与 `var`

**考点**：`continue` 行为、`var` 无块级作用域。

#### 题目

```js
var num = 0;

for (var i = 1; i < 10; i++) {
  if (i % 5 == 0) {
    continue;
  }
  num++;
}

console.log(i, num);
```

输出是什么？

#### 正确答案

`10 8`

#### 解析

- `i === 5` 时 `continue`，该轮不执行 `num++`，共执行 8 次：`1,2,3,4,6,7,8,9` → `num === 8`。
- `for (var i …)` 中 `i` 为函数级变量，循环结束后 `i === 10`。

---

### 第 4 题：哪项不是最佳实践？

**考点**：避免污染内置原型。

#### 题目

下列代码片段中，**哪一项通常不是** JavaScript 最佳实践？

#### 选项

1. `this.func1().func2().func3()`（链式调用）
2. `var obj = {}; var a = "attr1"; console.log(obj.attr1); console.log(obj[a]);`
3. `String.prototype.trim = function () {};`
4. `(a || b) || (c && d)`

#### 正确答案

第 3 项：覆盖 `String.prototype.trim`

#### 解析

随意修改 `String` / `Array` / `Object` 等内置原型，易与引擎实现、第三方库冲突，并造成全局行为不可控。链式调用、动态属性访问、逻辑表达式本身并非反模式。

---

### 第 5 题：删除数组第 i 个元素（从 1 计数）

**考点**：`splice` 与索引换算。

#### 题目

需要删除 `arr` 中**第 i 个**元素（**从 1 开始**计数），较合适的做法是？

#### 选项

1. `arr.splice(i - 1, 1)`
2. `arr.slice(0, n).concat(arr.slice(n + 1, arr.length))`
3. `for (var i = 0, n = 0; i < this.length; i++) { … }`（片段不完整）
4. 在 `Array.prototype` 上扩展 `remove` 方法

#### 正确答案

第 1 项：`arr.splice(i - 1, 1)`

#### 解析

数组下标从 0 开始，第 `i` 个元素对应索引 `i - 1`。`splice(start, deleteCount)` 是原生、直观的删改 API。

---

### 第 6 题：`map(parseInt)` 经典陷阱

**考点**：`map` 回调参数与 `parseInt` 第二参数（进制）。

#### 题目

```js
["1", "2", "3"].map(parseInt);
```

返回结果是什么？

#### 选项

1. `[0, 1, 2]`
2. `["1", "2", "3"]`
3. `other`
4. `[1, 2, 3]`

#### 正确答案

第 3 项 `other`（实际结果为 `[1, NaN, NaN]`）

#### 解析

`map` 传入 `(value, index)`，而 `parseInt(string, radix)` 把 **index 当成了 radix**：

| 调用 | 结果 |
| --- | --- |
| `parseInt("1", 0)` | `1` |
| `parseInt("2", 1)` | `NaN`（非法进制） |
| `parseInt("3", 2)` | `NaN`（二进制无 `3`） |

正确写法示例：

```js
["1", "2", "3"].map(Number);
// 或
["1", "2", "3"].map((s) => parseInt(s, 10));
```

---

### 第 7 题：解构赋值与圆括号

**考点**：避免 `{` 被解析为代码块。

#### 题目

解构赋值中，关于圆括号的使用，**正确**的是哪一项？

#### 选项

1. `[(x)] = [3]`
2. `function f({ (z) }) { return z; }`
3. `({ p: a }) = { p: 42 }`
4. `let [(a)] = [1]`

#### 正确答案

第 3 项（在已声明变量 `a` 的前提下，用圆括号包裹对象解构赋值语句）

#### 解析

语句以 `{` 开头时会被当作块级语句。对已声明变量做**对象模式解构赋值**，需用圆括号包成表达式，例如：

```js
let a;
({ p: a } = { p: 42 });
```

数组解构或参数列表中随意加圆括号多为非法语法。

---

### 第 8 题：对象解构赋值

**考点**：只拷贝自有可枚举属性、浅拷贝。

#### 题目

关于对象的解构赋值，说法**不正确**的是？

#### 选项

1. 解构赋值会拷贝继承自原型对象的属性
2. 解构是浅拷贝；值为对象/数组时拷贝的是引用
3. 等号右侧为 `undefined` / `null` 时会报错
4. 函数形参解构时，解构参数须为最后一个参数，否则报错

#### 正确答案

第 1 项

#### 解析

解构只读取**对象自身**的可枚举属性，不会遍历原型链上的继承属性。B、C、D 均为常见规范行为。

---

### 第 9 题：性能相关写法

**考点**：作用域链、属性访问成本。

#### 题目

下列哪种做法相对**更利于** JavaScript 运行性能？

#### 选项

1. 优先使用全局变量，而非局部变量
2. 经常使用 `with` 语句
3. 使用 `==` 比 `===` 更好
4. 优先使用变量和数组，而不是频繁读对象属性

#### 正确答案

第 4 项

#### 解析

局部变量与数组下标访问通常快于跨作用域全局变量与对象属性查找。`with` 干扰静态分析；`===` 无隐式转换，一般更快。

---

### 第 10 题：ES5 构造函数 → ES6 类

**考点**：`class` 与 `constructor` 语法糖。

#### 题目

哪一项**正确**体现了将 ES5 构造函数风格改写为 ES6 `class`？

#### 选项

1. `function Person(name) { this.name = name; } Person.prototype = { sayName: function () {} }`
2. `class Person { constructor(name) { this.name = name; } }`
3. `class Person { constructor(name) { this.name = name; } } Person.prototype.sayName = function () {}`
4. `function Person(name) { this.name = name; } let person = new Person("Bob");`

#### 正确答案

第 2 项

#### 解析

ES6 类用 `constructor` 定义构造逻辑；实例方法应写在 `class` 体内，而不是再在类外挂 `prototype`（选项 1、4 为 ES5，选项 3 混合风格不规范）。

---

## 二、异步编程与网络

### 第 11 题：`async / await` 说法判断

**考点**：`await` 对非 Promise 值的处理。

#### 题目

关于 `async / await`，**错误**的一项是？

（其中一项为：`await` 表达式后面必须是一个 Promise。）

#### 正确答案

「`await` 后面必须是 Promise」——该说法错误

#### 解析

`await` 后可跟任意值，非 Promise 会按 `Promise.resolve(value)` 处理：

```js
async function test() {
  console.log(await 123); // 123
}
```

`async` 函数返回值始终是 Promise。

---

### 第 12 题：`XMLHttpRequest` 调用外部 API

**考点**：XHR 生命周期与标准 API。

#### 题目

使用原生 `XMLHttpRequest` 发起 GET 请求，**正确**的写法是哪一种？

#### 正确答案（标准流程）

```js
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    var response = xhttp.responseText;
  }
};

xhttp.open("GET", "http://www.example.com/api", true);
xhttp.send();
```

#### 解析

要点：

1. `new XMLHttpRequest()`
2. 监听 `onreadystatechange`，`readyState === 4` 表示完成
3. `status === 200` 表示 HTTP 成功（需结合业务判断）
4. `open(method, url, async)` 后再 `send()`

`xhttp.done`、`xhttp.onready`、`xhttp.get(...)` 等均非标准 XHR API。

---

### 第 13 题：Promise、微任务与宏任务输出

**考点**：事件循环、Promise 状态不可变。

#### 题目

```js
const first = () =>
  new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
      console.log(7);
      setTimeout(() => {
        console.log(5);
        resolve(6);
        console.log(p);
      }, 0);
      resolve(1);
    });
    resolve(2);
    p.then((arg) => {
      console.log(arg);
    });
  });

first().then((arg) => {
  console.log(arg);
});
console.log(4);
```

正确的输出顺序是？

#### 正确答案

`3 7 4 1 2 5 Promise { <resolved>: 1 }`（或等价描述：末尾打印的 `p` 仍为 `resolved` 且值为 `1`）

#### 解析

1. **同步**：执行 `first()` → 打印 `3`、`7`；`setTimeout` 入宏任务；内层 `resolve(1)`；注册 `p.then`；外层 `resolve(2)`；注册 `first().then`；打印 `4` → 同步段：`3, 7, 4`。
2. **微任务**：`p.then` 打印 `1`；`first().then` 打印 `2`。
3. **宏任务**：定时器打印 `5`；再次 `resolve(6)` 无效（状态已定）；打印 `p`，仍为 `Promise { <resolved>: 1 }`。

> 试卷某选项若写成 `3 7 1 4 2 5 …` 则把微任务与同步 `4` 的顺序弄错了。

---

### 第 14 题：`var` + `setTimeout` 闭包

**考点**：循环中的 `var` 与异步回调共享同一变量。

#### 题目

```js
for (var i = 0; i < 5; ++i) {
  setTimeout(function () {
    console.log(i + " ");
  }, 100);
}
```

输出是什么？

#### 选项

1. `1 2 3 4 5`
2. `0 0 0 0 0`
3. `5 5 5 5 5`
4. `0 1 2 3 4`

#### 正确答案

第 3 项：`5 5 5 5 5`

#### 解析

`var i` 只有一个绑定；循环结束时 `i === 5`，五个定时器回调执行时读到的都是 `5`。若需 `0～4`，应使用 `let` 或 IIFE / 传参形成闭包。

---

### 第 15 题：浏览器跨域说法

**考点**：同源策略与常见跨域手段。

#### 题目

关于浏览器中使用 JS 跨域获取数据，说法**错误**的是？

#### 选项

1. JS 可以使用 JSONP 进行跨域
2. 域名、端口相同，协议不同，属于相同的域
3. 可通过修改 `document.domain` 跨子域
4. 可使用 `window.name` 进行跨域

#### 正确答案

第 2 项

#### 解析

同源要求 **协议、域名、端口** 三者完全一致。`http` 与 `https` 仅协议不同即跨域。JSONP、`document.domain`（限同主域子域）、`window.name` 均为历史常见方案。

---

## 三、this 与作用域

### 第 16 题：`this` 与定时器（判断题）

**考点**：非严格模式下定时器回调的 `this`。

#### 题目

有关 JavaScript 中 `this` 指向，说法**错误**的是？

#### 选项

1. 对象方法调用时，`this` 指向该方法所属对象
2. 定时器回调函数中，`this` 指向 `undefined`
3. 构造函数调用时，`this` 指向实例对象
4. 普通函数调用时，`this` 指向 `window`（浏览器非严格模式）

#### 正确答案

第 2 项

#### 解析

浏览器**非严格模式**下，`setTimeout` / `setInterval` 回调作为普通函数执行，`this` 默认指向 `window`，而非 `undefined`（严格模式下方为 `undefined`）。题目未声明严格模式时，按常见默认环境选第 2 项为错述。

---

### 第 17 题：`this` 输出：`bryant` 与 `paul`

**考点**：隐式绑定丢失。

#### 题目

```js
var fullname = "paul";
var obj = {
  fullname: "kobe",
  prop: {
    fullname: "bryant",
    getFullname: function () {
      return this.fullname;
    },
  },
};

console.log(obj.prop.getFullname());

var test = obj.prop.getFullname;
console.log(test());
```

两次 `console.log` 分别输出什么？

#### 正确答案

`bryant`，然后 `paul`

#### 解析

1. `obj.prop.getFullname()`：`this` 为 `obj.prop` → `"bryant"`。
2. `test()`：函数独立调用，非严格模式下 `this` 为全局对象 → 全局 `fullname` 即 `"paul"`。

---

### 第 18 题：作用域链

**考点**：哪些机制会引入/改变作用域。

#### 题目

下列哪种方式**不能**改变作用域链（在经典理解下）？

#### 选项

1. `try / catch`
2. `eval`
3. `call`
4. `while`

#### 正确答案

第 4 项：`while`

#### 解析

- `catch` 块会为异常绑定创建作用域。
- 非严格模式下 `eval` 可在当前作用域引入变量。
- `call` / `apply` / `bind` 改变函数执行上下文及关联作用域链。
- `while` 仅控制循环，**不创建新词法环境**（与 `let` 块级作用域无关）。

---

## 四、ES6 类与模块

### 第 19 题：类继承中的 `super()`

**考点**：`super` 指向父类构造逻辑。

#### 题目

在类的继承中，关于 `super()` 的说法**错误**的是？

#### 选项

1. `super()` 相当于调用父类构造函数
2. 须先调用 `super()`，才可以使用 `this`
3. `super()` 相当于子类的引用
4. 子类构造函数中必须先调用 `super()`

#### 正确答案

第 3 项

#### 解析

`super()` / `super` 指向**父类**（或父类原型），不是子类自身。A、B、D 为 ES6 继承的基本规则。

---

## 五、React

### 第 20 题：课程评论系统实现方式

**考点**：声明式 UI、状态驱动、合成事件。

#### 题目

大型在线教育平台需在视频时间点展示、实时更新评论，并兼顾性能与体验。较合适的 React 实现思路是？

#### 正确答案（方向）

函数组件 + `useState` 管理评论列表 + 合成事件处理交互 + 通过 `props` 下发数据与更新函数；避免手动频繁操作 DOM。

#### 解析

React 推荐**状态驱动视图**：更新 state，由 React diff 后更新 DOM。相比 `ref` 直改 DOM、大量原生 `addEventListener`、类组件内 imperative DOM、为普通列表滥用 `Portal` 等，更符合数据流与可维护性。

示例：

```js
function CommentList() {
  const [comments, setComments] = useState([]);
  const addComment = (comment) => {
    setComments((prev) => [...prev, comment]);
  };
  return comments.map((c) => c.text);
}
```

---

### 第 21 题：`useEffect` 与 `useLayoutEffect`

**考点**：执行时机与是否阻塞绘制。

#### 题目

关于 `useEffect` 与 `useLayoutEffect`，描述**错误**的是？

#### 选项

1. `useLayoutEffect` 在浏览器重新绘制屏幕**之后**触发
2. `useEffect` 会阻塞组件渲染过程，影响渲染性能
3. `useLayoutEffect` 常用于需同步完成的副作用（如 DOM 测量）
4. `useLayoutEffect` 在组件渲染完成后**同步**执行

#### 正确答案

第 2 项：`useEffect` 会阻塞组件渲染过程，影响渲染性能

#### 解析

- `useEffect`：**异步**，在浏览器绘制**之后**执行，**不会**阻塞渲染。
- `useLayoutEffect`：在 DOM 更新后、浏览器绘制**之前**同步执行；内部若有长任务才可能阻塞绘制。
- 选项 1 同样错误（把 `useLayoutEffect` 说成绘制之后），但试卷标答为第 2 项。

---

### 第 22 题：React Diff 算法

**考点**：组件节点 vs DOM 节点的 diff 策略。

#### 题目

关于 Diff 算法，描述**错误**的是？

#### 选项

1. 比较**同类型组件**元素时，React 更新属性后执行 render，并将新老 VDOM **整体递归比较**
2. 不同类型元素会卸载旧树、创建新树
3. 比较**同类型 DOM 元素**时，主要比较属性差异并更新
4. 按层级比较，同层比较（同级策略）

#### 正确答案

第 1 项

#### 解析

同类型**组件**会保留实例、更新 props 并触发该组件重新 render，由组件内部生成新的子树再 diff，而不是简单“拿两个组件的旧新 VDOM 整树递归硬比”。B、C、D 符合 React diff 的常见表述。

---

### 第 23 题：React Hooks

**考点**：Hooks 仅用于函数组件与自定义 Hook。

#### 题目

关于 React Hook 功能，介绍**错误**的是？

#### 选项

1. Hook 可以在 class 组件中使用
2. Hook 逻辑可以被复用（自定义 Hook）
3. Hook 可以让函数组件使用生命周期（如 `useEffect`）
4. Hook 可以让函数组件使用 state（如 `useState`）

#### 正确答案

第 1 项

#### 解析

Hooks **不能**在 class 组件中调用，只能在函数组件或自定义 Hook 中使用。

---

## 六、CSS 与布局

### 第 24 题：`rem` 单位

**考点**：相对根元素 `font-size` 的布局单位。

#### 题目

HTML5 / CSS3 中关于 `rem`，说法正确的是？

#### 选项

1. 其他都对
2. 使用 `rem` 方便适配多种移动设备
3. `rem` 是 CSS3 新增的相对单位
4. `rem` 相对于根元素的大小

#### 正确答案

第 1 项（其他都对）

#### 解析

`rem` = root em，相对 `<html>` 的 `font-size`。通过调整根字号可统一缩放页面，便于移动端适配。

---

### 第 25 题：媒体查询

**考点**：视口 vs 设备宽度、媒体条件语法。

#### 题目

下列关于媒体查询的说法，**错误**的是？

#### 选项

1. `min-device-width` 是用浏览器视口宽度作为判断条件
2. 视口尺寸可以随意指定，且视口与显示设备的物理分辨率无关
3. 可通过 `<link media="screen and (min-width:768px)" rel="stylesheet" href="print.css">` 在满足条件时加载样式
4. 媒体查询既可用视口大小，也可用设备窗口相关特性作为条件

#### 正确答案

第 2 项（试卷标答；选项 1 将 `min-device-width` 与视口混淆，亦常作干扰项）

#### 解析

视口逻辑尺寸与设备 DPR、物理像素密切相关，不能“随意指定且与物理分辨率无关”。`min-width` 一般对应视口；`min-device-width` 对应设备屏幕宽度。链接上的 `media` 属性可条件加载 CSS。

---

### 第 26 题：Flex 主轴对齐

**考点**：`justify-content` vs `align-items`。

#### 题目

Flex 布局中，定义**子元素在主轴**上对齐方式的属性是？

#### 选项

1. `align-content`
2. `text-align`
3. `align-items`
4. `justify-content`

#### 正确答案

第 4 项：`justify-content`

#### 解析

| 属性 | 作用轴 |
| --- | --- |
| `justify-content` | 主轴 |
| `align-items` | 交叉轴（单行） |
| `align-content` | 交叉轴（多行） |
| `text-align` | 行内文本对齐 |

---

### 第 27 题：浮动元素居中

**考点**：绝对定位 + 负 margin / `transform` 居中。

#### 题目

要使**宽高已知**的浮动/定位元素在容器中居中，较经典的一种 CSS 思路是？

#### 正确答案

`position: absolute; left: 50%; top: 50%;` 再配合负 `margin` 或 `transform: translate(-50%, -50%)` 将元素中心对齐容器中心。

#### 解析

先将元素左上角移到容器中心（`left/top: 50%`），再向左上偏移自身宽高的 50%。现代写法常用 `transform`，试卷选项中完整度较高的传统答案为 **负 margin** 方案。

---

### 第 28 题：文档流与 `position`

**考点**：哪些定位脱离 normal flow。

#### 题目

下面哪个属性**不会**让 `div` 脱离常规文档流（normal flow）？

#### 选项

1. `position: absolute;`
2. `float: left;`
3. `position: relative;`
4. `position: fixed;`

#### 正确答案

第 3 项：`position: relative`

#### 解析

`absolute` / `fixed` / `float` 均会脱离或移出常规流占位逻辑；`relative` 仅相对原位置偏移，**仍占据原空间**。

---

### 第 29 题：隐藏方式对比

**考点**：`display` / `visibility` / `opacity` / 带 alpha 的颜色。

#### 题目

关于 `HSLA`、`opacity`、`visibility: hidden`、`display: none`，说法**错误**的是？

#### 选项

1. `visibility: hidden` 元素被隐藏，不改变页面布局，但不会触发该元素已绑定的事件
2. `display: none` 元素被隐藏，会改变页面布局，可理解为从页面布局中移除
3. `opacity: 0` 元素整体透明（含内容），不改变布局，已绑定事件仍可触发
4. `HSLA/RGBA` 是背景透明，元素内容有透明效果

#### 正确答案

第 4 项

#### 解析

- `visibility: hidden`：不可见、占位、通常不响应指针事件。
- `display: none`：不可见、不占位。
- `opacity: 0`：不可见、占位、仍可触发事件（除非配合 `pointer-events: none`）。
- `HSLA/RGBA` 是**带 alpha 的颜色值**，只影响设置了该颜色的区域（如背景色、文字色），**不能**替代 `opacity` 实现整元素（含子节点）统一透明；整元素透明应使用 `opacity`。

---

## 附录：原试卷题号对照

| 本文题号 | 原卷题号 |
| --- | --- |
| 1～4 | 1～4 |
| 5 | 16 |
| 6 | 24 |
| 7 | 25 |
| 8 | 49 |
| 9 | 36 |
| 10 | 9 |
| 11 | 23 |
| 12 | 22 |
| 13 | 7 |
| 14 | 34 |
| 15 | 31 |
| 16 | 14 |
| 17 | 17 |
| 18 | 50 |
| 19 | 30 |
| 20 | 6 |
| 21 | 8 |
| 22 | 20 |
| 23 | 45 |
| 24 | 11 |
| 25 | 13 |
| 26 | 27 |
| 27 | 21 |
| 28 | 41 |
| 29 | 47 |
