以下是根据您提供的所有图片内容整理成的完整 Markdown 面试题及解析文档：

# JavaScript、React 与 CSS 综合面试题整理与解析

---
# JavaScript / React 题目与答案解析汇总

> 根据本次对话中出现的题目整理。题号沿用截图中的编号；未出现的题号不补写。

---

## 第 1 题：`Array.prototype.concat`

### 题目

```js
var Arr = [1, 2, 3];
var Arr2 = Arr.concat(4, [5, 6]);
```

问：`Arr2` 的值是什么？

### 正确答案

```js
[1, 2, 3, 4, 5, 6]
```

### 解析

`concat()` 用于合并数组，并返回一个新数组。

这里：

```js
Arr.concat(4, [5, 6])
```

会把：

- 原数组 `[1, 2, 3]`
- 普通值 `4`
- 数组 `[5, 6]`

合并起来。

对于传入的数组参数，`concat()` 会展开一层，因此 `[5, 6]` 会变成两个元素 `5` 和 `6`。

最终结果：

```js
[1, 2, 3, 4, 5, 6]
```

**答案：第 3 个选项。**

---

## 第 2 题：冻结对象并防止修改

### 题目

JavaScript 中，停止开发一个对象并防止原型污染的一种方法是什么？

选项包括：

```js
Object.halt()
Object.hold()
Object.freeze()
Object.stop()
```

### 正确答案

```js
Object.freeze()
```

### 解析

`Object.freeze()` 可以冻结一个对象。

被冻结后：

- 不能新增属性
- 不能删除属性
- 不能修改已有属性
- 不能重新配置已有属性

示例：

```js
const obj = { name: "Tom" };

Object.freeze(obj);

obj.age = 18;      // 添加失败
obj.name = "Jack"; // 修改失败
delete obj.name;   // 删除失败
```

需要注意：

`Object.freeze()` 是**浅冻结**，如果对象内部还有嵌套对象，嵌套对象本身仍可能被修改，除非继续递归冻结。

**答案：第 3 个选项。**

---

## 第 3 题：`for`、`continue` 与 `var`

### 题目

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

问：输出结果是什么？

### 正确答案

```js
10 8
```

### 解析

`i` 从 `1` 循环到 `9`。

当：

```js
i === 5
```

时：

```js
i % 5 == 0
```

成立，因此执行：

```js
continue;
```

本轮不会执行：

```js
num++;
```

所以真正执行 `num++` 的 `i` 为：

```txt
1, 2, 3, 4, 6, 7, 8, 9
```

一共 8 次，因此：

```js
num === 8
```

因为循环变量使用的是 `var`：

```js
for (var i = 1; ...)
```

`var` 不具有块级作用域。循环结束时，`i` 已经自增为 `10`。

因此：

```js
console.log(i, num);
```

输出：

```js
10 8
```

**答案：第 4 个选项。**

---

## 第 4 题：下面哪项不是最佳实践？

### 题目

选项包括：

```js
this.func1().func2().func3()
```

```js
var obj = {};
var a = "attr1";
console.log(obj.attr1);
console.log(obj[a]);
```

```js
String.prototype.trim = function () {};
```

```js
(a || b) || (c && d)
```

### 正确答案

```js
String.prototype.trim = function () {};
```

### 解析

直接修改或覆盖 JavaScript 内置对象的原型，通常不是最佳实践。

例如：

```js
String.prototype.trim = function () {};
```

这里直接覆盖了原生的 `String.prototype.trim`。

可能带来的问题包括：

- 与浏览器原生实现冲突
- 与第三方库发生冲突
- 改变全局行为
- 增加代码维护难度
- 不同代码模块可能互相影响

因此，一般不建议随意修改：

```js
String.prototype
Array.prototype
Object.prototype
```

等内置对象的原型。

**答案：第 3 个选项。**

---

## 第 6 题：React 评论系统的最佳实现方式

### 题目概述

在大型在线教育平台中，需要开发交互式课程评论系统：

- 学生可以在视频播放的特定时间点添加评论
- 可以实时显示其他学生的评论
- 需要考虑性能与用户体验
- 要高效处理 DOM 和事件

问：哪种实现方式更合适？

### 正确答案

使用：

- React 函数组件
- `useState` 管理评论状态
- React 合成事件系统处理用户交互
- 通过 `props` 传递数据和更新函数

### 解析

现代 React 的核心思想是：

```txt
状态驱动 UI
```

也就是说，不应该频繁手动操作 DOM，而应该修改状态，让 React 根据状态变化重新渲染。

例如：

```js
function CommentList() {
  const [comments, setComments] = useState([]);
  const addComment = (comment) => {
    setComments((prev) => [...prev, comment]);
  };
  return comments.map((comment) => comment.text);
}
```

这种方式相比以下做法更合理：

- 使用 `ref` 直接修改 DOM
- 大量使用 `document.addEventListener`
- 在类组件中直接操作 DOM
- 为普通评论列表滥用 `createPortal`

优点：

- 更符合 React 数据流
- 更容易维护
- 组件职责更清晰
- 更适合状态更新
- 更方便后续性能优化

**答案：第 1 个选项。**

---

## 第 22 题：`XMLHttpRequest` 调用外部 API

### 题目

JavaScript 中使用 `XMLHttpRequest` 调用外部 API，哪段代码是正确的？

### 正确答案

典型正确写法：

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

### 解析

使用 `XMLHttpRequest` 时，几个关键点是：

#### 1. 创建对象

```js
var xhttp = new XMLHttpRequest();
```

#### 2. 监听状态变化

```js
xhttp.onreadystatechange = function () {
  // ...
};
```

#### 3. 判断请求是否完成

```js
this.readyState === 4
```

`readyState === 4` 表示请求已经完成。

#### 4. 判断 HTTP 请求是否成功

```js
this.status === 200
```

通常表示请求成功。

#### 5. 初始化请求

```js
xhttp.open("GET", url, true);
```

参数分别是：

```txt
请求方法、请求地址、是否异步
```

#### 6. 发送请求

```js
xhttp.send();
```

其他类似：

```js
xhttp.done
xhttp.onready
xhttp.get(...)
```

都不是原生 `XMLHttpRequest` 的标准用法。

**答案：第 1 个选项。**

---

## 第 23 题：`async / await`

### 题目

以下关于 `async / await` 的说法，错误的是哪一项？

其中一个选项为：

```txt
await 表达式后面必须是一个 Promise
```

### 正确答案

错误说法是：

```txt
await 表达式后面必须是一个 Promise
```

### 解析

`await` 后面**不要求必须是 Promise**。

例如：

```js
async function test() {
  const value = await 123;
  console.log(value);
}

test();
```

输出：

```js
123
```

如果 `await` 后面是普通值，JavaScript 会把它按照已完成的 Promise 值来处理，可以近似理解为：

```js
await Promise.resolve(123)
```

另外：

```js
async function foo() {
  return 123;
}
```

调用：

```js
foo()
```

返回的依然是一个 Promise，大致相当于：

```js
Promise.resolve(123)
```

因此：

```txt
await 后面必须是 Promise
```

这个说法是错误的。

**答案：第 3 个选项。**

---

## 第 24 题：`map(parseInt)` 经典陷阱

### 题目

```js
["1", "2", "3"].map(parseInt)
```

返回结果是什么？

选项包括：

```js
[0, 1, 2]
```

```js
["1", "2", "3"]
```

```txt
other
```

```js
[1, 2, 3]
```

### 正确答案

实际结果：

```js
[1, NaN, NaN]
```

因此应选择：

```txt
other
```

### 解析

`Array.prototype.map()` 调用回调函数时，会传递三个参数：

```js
callback(currentValue, index, array)
```

而 `parseInt()` 的参数形式是：

```js
parseInt(string, radix)
```

其中：

- 第一个参数是要解析的字符串
- 第二个参数是进制 `radix`

所以：

```js
["1", "2", "3"].map(parseInt)
```

实际相当于：

```js
parseInt("1", 0);
parseInt("2", 1);
parseInt("3", 2);
```

分别分析：

### 第一次

```js
parseInt("1", 0)
```

`radix = 0` 时会按规则自动判断进制，这里得到：

```js
1
```

### 第二次

```js
parseInt("2", 1)
```

合法进制范围通常是：

```txt
2 ~ 36
```

`1` 是非法进制，因此：

```js
NaN
```

### 第三次

```js
parseInt("3", 2)
```

二进制只能包含：

```txt
0 和 1
```

`3` 不是合法的二进制数字，因此结果为：

```js
NaN
```

最终：

```js
[1, NaN, NaN]
```

如果真正想把字符串数组转换成数字数组，可以写：

```js
["1", "2", "3"].map(Number)
```

得到：

```js
[1, 2, 3]
```

或者：

```js
["1", "2", "3"].map((item) => parseInt(item, 10))
```

得到：

```js
[1, 2, 3]
```

**答案：第 3 个选项 `other`。**

---

### 7. 关于这段代码的输出结果正确的是？

```javascript
const first = () => (new Promise((resolve, reject) => {
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
}));

first().then((arg) => {
    console.log(arg);
});
console.log(4);
```

**正确答案：其他（图中选项 `3 7 1 4 2 5 Promise{&lt;resolved&gt;: 1}` 是错误答案，正确输出为：`3 7 4 1 2 5 Promise{&lt;resolved&gt;: 1}`）**

**详细解析：**
图片中的选项存在明显逻辑错误，缺少了 `6`，且对象内容描述混乱。
1. **同步代码**：依次执行 `first()` 内部的代码，打印 `3`、`7`。遇到 `setTimeout`，将回调放入宏任务队列。执行 `resolve(1)`，将 `p` 状态变为 resolved(1)。遇到 `p.then`，将其回调放入微任务队列。执行 `resolve(2)`，将 `first` 的 Promise 状态变为 resolved(2)。遇到 `first().then`，将其回调放入微任务队列。最后执行最外层 `console.log(4)`，打印 `4`。
   *同步输出：3, 7, 4*
2. **微任务队列**：同步代码执行完毕，清空微任务队列。执行 `p.then` 回调（因为 `p` 的状态已为 resolved(1)），打印 `1`。执行 `first().then` 回调，打印 `2`。
   *微任务输出：1, 2*
3. **宏任务队列**：微任务清空后，执行 `setTimeout` 回调。打印 `5`。执行 `resolve(6)`（由于 `p` 状态已定，被忽略）。打印 `p`，此时 `p` 的状态仍为 resolved 且值为 `1`，所以打印 `Promise {&lt;resolved&gt;: 1}`。
   *宏任务输出：5, Promise{&lt;resolved&gt;: 1}*

**最终输出结果：** `3 7 4 1 2 5 Promise{&lt;resolved&gt;: 1}`

---

### 8. React 关于 useEffect 和 useLayoutEffect 描述，以下错误的是：

**选项：**
1. `useLayoutEffect`在浏览器重新绘制屏幕之后触发
2. `useEffect`会阻塞组件的渲染过程，影响组件渲染性能
3. `useLayoutEffect`通常用于处理需要同步执行的副作用，比如 DOM 操作、测量
4. `useLayoutEffect` 是在组件渲染完成后同步执行的钩子函数。

**正确答案：第二个选项（`useEffect会阻塞组件的渲染过程，影响组件渲染性能`）**

**详细解析：**
* **选项二描述错误（为本题答案）**：`useEffect` 是异步执行的，它会在浏览器重新绘制屏幕**之后**触发，因此**不会**阻塞组件的渲染过程，也不会影响渲染性能。而 `useLayoutEffect` 会在浏览器重新绘制屏幕**之前**同步触发，如果其中执行了非常耗时的操作，确实会阻塞渲染。
* 选项一、三、四描述正确。`useLayoutEffect` 在 DOM 更新后、浏览器绘制前同步触发，常用于需要同步执行的副作用（如 DOM 测量，以避免页面闪烁）。

---

### 9. 下面哪个选项正确地将 ES5 语法中的构造函数转成 ES6 语法？

**选项：**
1. `function Person(name) { this.name = name; } Person.prototype = { sayName: function() { ... } }`
2. `class Person { constructor(name) { this.name = name; } }`
3. `class Person { constructor(name) { this.name = name; } } Person.prototype.sayName = function...`
4. `function Person(name) { this.name = name; } let person = new Person("Bob");`

**正确答案：第二个选项（`class Person { constructor(name) { this.name = name; } }`）**

**详细解析：**
* ES5 使用 `function` 关键字定义构造函数。ES6 引入了 `class` 语法糖，构造函数使用 `constructor` 方法定义。
* 选项一和选项四仍然是 ES5 语法。
* 选项三虽然用了 `class`，但在类外部通过 `Person.prototype` 添加方法，不是 ES6 标准的类写法（ES6 类的方法应直接定义在 `class` 内部）。

---

### 11. HTML5 中新增了一个单位 rem，下面说法正确的是？

**选项：**
1. 其他都对
2. 使用 rem 方便适配各种移动设备
3. rem 是 CSS3 新增的一个相对单位
4. rem 是根元素的大小

**正确答案：第一个选项（`其他都对`）**

**详细解析：**
* `rem`（root em）是相对于根元素（通常是 `&lt;html&gt;` 元素）的 `font-size` 来计算的单位。
* 通过动态修改根元素的 `font-size`，可以方便地适配各种移动设备屏幕，所以选项二正确。
* `rem` 确实是 CSS3 新增的相对单位，所以选项三正确。
* `1rem` 等于根元素的 `font-size` 大小，所以选项四正确。
* 因此，“其他都对”是正确答案。

---

### 13. 下列关于媒体查询说法错误的是？

**选项：**
1. `min-device-width`是用浏览器视口宽度作为判断条件
2. 视口的尺寸可以随意指定，且视口与显示设备的物理分辨率无关。
3. 可以通过 `&lt;link media="screen && (min-width&gt;768px)" rel="stylesheet" href="print.css"&gt;` 时，才执行 print.css 文件
4. 媒体查询，即可使用浏览器的视口大小作为判断条件，又可使用物理设备的窗口大小作为判断条件

**正确答案：第二个选项（`视口的尺寸可以随意指定，且视口与显示设备的物理分辨率无关。`）**

**详细解析：**
* 选项二描述错误（为本题答案）。视口的尺寸不能随意指定，且视口与物理分辨率密切相关。在移动端，浏览器通过设备像素比（DPR）将 CSS 像素映射到物理像素上，视口的逻辑宽度不能超过设备的物理限制。
* 选项一描述正确，`min-device-width` 对应物理设备屏幕宽度，而 `min-width` 对应视口宽度。
* 选项三、四描述正确，是媒体查询的基本用法。

---

### 14. 有关 JavaScript 中的 this 指向，下列说法错误的是？

**选项：**
1. 对象方法调用，此时 this 指向 该方法所属的对象
2. 定时器回调函数，此时this指向undefined
3. 构造函数调用，此时 this 指向 实例对象
4. 普通函数调用，此时 this 指向 window

**正确答案：第二个选项（`定时器回调函数，此时this指向undefined`）**

**详细解析：**
* 选项二描述错误（为本题答案）。在非严格模式下，定时器（`setTimeout`/`setInterval`）的回调函数属于普通函数调用，内部的 `this` 默认指向全局对象（浏览器中是 `window`），而不是 `undefined`。只有在严格模式下才会是 `undefined`，但题目未明确说明。
* 选项一、三、四描述正确，分别对应隐式绑定、new 绑定和默认绑定（非严格模式）。

---

### 16. 需要删除 arr 数组中的第 i 个元素（从第 1 个元素开始），最好的做法是？

**选项：**
1. `arr.splice(i-1, 1)`
2. `arr.slice(0,n).concat(arr.slice(n+1,arr.length));`
3. `for(var i=0,n=0;i<this.length;i++) { if(this[i]!=this[dx]) {this[n++]=this[i]} }`
4. `Array.prototype.remove=function(dx) { ... }`

**正确答案：第一个选项（`arr.splice(i-1, 1)`）**

**详细解析：**
* `splice()` 是 JavaScript 数组原生的增删改方法，可以直接修改原数组。第一个参数是起始索引，第二个参数是删除个数。因为题目要求“从第 1 个元素开始”算，而数组索引从 `0` 开始，所以第 `i` 个元素索引为 `i-1`。
* 其他选项要么有语法错误（变量未定义），要么操作复杂且不是原生推荐的最优写法。

---

### 17. 关于 JavaScript this 指向的输出结果

```javascript
var fullname = 'paul';
var obj = {
    fullname: 'kobe',
    prop: {
        fullname: 'bryant',
        getFullname: function() {
            return this.fullname;
        }
    }
};

console.log(obj.prop.getFullname());

var test = obj.prop.getFullname;

console.log(test());
```

**正确答案：`bryant` 和 `paul`**

**详细解析：**
1. `console.log(obj.prop.getFullname());`：通过对象 `obj.prop` 调用方法，`this` 指向调用该方法的对象（即 `obj.prop`），所以返回 `obj.prop.fullname`，即 `'bryant'`。
2. `console.log(test());`：将 `obj.prop.getFullname` 赋值给全局变量 `test` 后直接调用，丢失了原本的对象上下文。此时属于普通函数调用，非严格模式下 `this` 指向全局对象（`window`），所以返回 `window.fullname`，即最外层的 `'paul'`。

---

### 20. 下列关于 diff 算法描述错误的是？

**选项：**
1. 当比较同类型组件元素时，React 更新属性后执行 render 并将新老 vdom 进行递归比较
2. 拥有不同类型的两个元素将导致新树结构创建和替换
3. 当比较同类型 DOM 元素时，仅需比较两者特性 (attributes) 差异并做更新即可
4. 把树形结构按照层级分解，只比较同级元素

**正确答案：第一个选项（`当比较同类型组件元素时，React 更新属性后执行 render 并将新老 vdom 进行递归比较`）**

**详细解析：**
* 选项一描述错误（为本题答案）。当 React 遇到同类型的**组件**元素时，会保留组件实例，更新组件的 `props`，然后触发该组件的重新渲染。它**不会**直接去递归比较新旧组件的整个 VDOM 树，而是由该组件内部自己去进行新一轮的渲染和 diff。该选项混淆了“原生 DOM 元素”和“组件元素”的比较逻辑。
* 选项二、三、四都是 React Diff 算法的核心策略，描述正确。

---

### 21. 如何居中一个浮动元素？

**选项：**
1. `border: 1px solid red; float: left; position: absolute; width: 200px; height... margin: -25px 0 0 -100px;`
2. `border: 1px solid red; float: left; position: absolute; width: 200px; height... left: 50%; top: 50%; margin: -50px 0 0 -50px;`（假设宽高为100px）
3. `border: 1px solid red; float: left; position:relative; width: 200px; height: 10... left: 50%; top: 50%; margin: 0 0 -100px;`
4. `.container { position: relative; } .floated-element { float: left; position: r... translateX(-50%); }`

**正确答案：第二个选项**

**详细解析：**
* 要让一个浮动元素居中，经典做法是结合**绝对定位**和**负边距**（适用于宽高固定的元素）。
* 设置 `position: absolute; left: 50%; top: 50%;` 将元素左上角移到父容器中心。然后通过负的 `margin`（如 `margin: -50px 0 0 -50px;`）将元素向左上移动自身宽高的一半，从而实现精确居中。
* 选项四使用 `transform: translate(-50%, -50%)` 是现代 CSS 推荐的完美居中方案（不受宽高限制），但代码残缺（`position: r...` 被截断，且没有 `left/top`）。从完整性来看，选项二是传统标准答案。

---

### 24. `["1", "2", "3"].map(parseInt)` 返回的结果为（ ）

**选项：**
1. `[0, 1, 2]`
2. `["1", "2", "3"]`
3. `other`
4. `[1, 2, 3]`

**正确答案：第三个选项（`other`）**

**详细解析：**
图中选中的 `[1, 2, 3]` 是错误的。正确答案是 `other`（实际上输出 `[1, NaN, NaN]`）。
* `map` 方法会给回调函数传递三个参数：`currentValue`（元素）、`index`（索引）、`array`（原数组）。
* `parseInt(string, radix)` 接收两个参数：字符串和基数（进制）。
* 因此，实际执行过程为：
  * `parseInt("1", 0)`：radix 为 0 时默认按 10 进制处理，返回 `1`。
  * `parseInt("2", 1)`：radix 为 1 无效（有效范围 2-36），返回 `NaN`。
  * `parseInt("3", 2)`：radix 为 2（二进制），`"3"` 是无效字符，解析失败，返回 `NaN`。
* 最终输出 `[1, NaN, NaN]`，所以只能选 `other`。

---

### 25. 解构赋值中关于圆括号的使用正确的是？

**选项：**
1. `[(x)] = [3]`
2. `function f({(z)}) { return z; }`
3. `({ p: a }) = { p: 42 }`
4. `let [(a)] = [1]`

**正确答案：第三个选项（`({ p: a }) = { p: 42 }`）**

**详细解析：**
* 当语句以花括号 `{` 开头时，JavaScript 引擎会默认将其解析为一个代码块，而不是对象字面量。因此，如果想对已经声明的变量进行对象解构赋值，**必须用圆括号把整个解构赋值语句包裹起来**，强制引擎将其解析为表达式。
* 选项三正确。
* 选项一、二、四在数组解构或形参解构中直接使用圆括号包裹变量，属于非法语法，会抛出语法错误。

---

### 27. flexbox 中定义子元素在主轴对齐方式的属性是什么？

**选项：**
1. `align-content`
2. `text-align`
3. `align-items`
4. `justify-content`

**正确答案：第四个选项（`justify-content`）**

**详细解析：**
* `justify-content` 定义了弹性项目（子元素）在**主轴（Main Axis）**上的对齐方式。
* `align-items` 定义了弹性项目在**交叉轴（Cross Axis）**上的对齐方式。
* `align-content` 用于多行弹性容器在交叉轴上的对齐方式。
* `text-align` 是文本对齐属性。

---

### 30. 在类的继承中，关于 `super()` 的说法错误的是？

**选项：**
1. `super()`相当于父类构造函数的调用
2. 先调用 `super()`，才可以使用this
3. `super()`相当于子类的引用
4. 在子类的构造函数，必须先调用 `super()`

**正确答案：第三个选项（`super()相当于子类的引用`）**

**详细解析：**
* 选项三描述错误（为本题答案）。`super()` 代表的是**父类**（或父类的构造函数），而不是子类的引用。在静态方法中，`super` 指向父类本身；在实例方法中，`super` 指向父类的原型对象。
* 选项一、二、四描述正确，是 ES6 类继承的基本规则。

---

### 31. 下面关于浏览器中使用 js 跨域获取数据的描述，说法错误的是？

**选项：**
1. js可以使用jsonp进行跨域
2. 域名、端口相同，协议不同，属于相同的域
3. 通过修改document.domain来跨子域
4. 使用window.name来进行跨域

**正确答案：第二个选项（`域名、端口相同，协议不同，属于相同的域`）**

**详细解析：**
* 选项二描述错误（为本题答案）。浏览器的**同源策略**要求“协议、域名、端口”三者必须完全相同，才属于同源。只要协议不同（例如 `http` 和 `https`），即使域名和端口相同，也会被判定为跨域。
* 选项一、三、四描述正确，分别是 JSONP、修改 `document.domain` 和 `window.name` 等经典的跨域解决方案。

---

### 34. 以下 JavaScript 代码执行的结果是？

```javascript
for(var i=0;i<5;++i){
    setTimeout(function(){ console.log(i+ ' '); },100);
}
```

**选项：**
1. `1 2 3 4 5`
2. `0 0 0 0 0`
3. `5 5 5 5 5`
4. `0 1 2 3 4`

**正确答案：第三个选项（`5 5 5 5 5`）**

**详细解析：**
* `var` 声明的变量具有函数作用域（没有块级作用域），整个循环过程中只有一个变量 `i` 存在。
* `setTimeout` 是异步函数，会将回调函数注册到宏任务队列中，等待当前主线程的同步代码全部执行完毕后才会执行。
* 当同步的 `for` 循环执行完毕时，变量 `i` 的值最终定格在 `5`。此时，宏任务队列里的 5 个回调函数依次执行，它们共享同一个变量 `i`，因此打印出的都是 `5`。

---

### 36. JavaScript 中，以下哪个操作对性能更具有友好性？

**选项：**
1. 优先使用全局变量，而非局部变量
2. 经常使用 with 语句
3. 使用 `==` 相对于 `===` 会更好点
4. 优先使用变量和数组，而不是对象上的属性

**正确答案：第四个选项（`优先使用变量和数组，而不是对象上的属性`）**

**详细解析：**
* 选项四描述正确。在 JavaScript 引擎中，访问作用域内的变量最快；其次是数组的索引访问；而访问对象上的属性，引擎需要进行哈希查找（或根据隐藏类/内联缓存进行动态查找），通常比数组索引访问要慢。在性能极度敏感的场景下，使用数组或局部变量缓存数据会比频繁读取对象属性更高效。
* 选项一错误，局部变量访问速度比全局变量快。
* 选项二错误，`with` 语句会破坏作用域链，导致引擎无法进行静态优化，严重影响性能。
* 选项三错误，`===` 不会进行隐式类型转换，执行速度通常比 `==` 更快。

---

### 41. 下面哪个属性不会让 div 脱离文档流 `normal flow`？

**选项：**
1. `position: absolute;`
2. `float: left;`
3. `position: relative;`
4. `position: fixed;`

**正确答案：第三个选项（`position: relative;`）**

**详细解析：**
* `position: absolute;`（绝对定位）、`float: left;`（浮动）、`position: fixed;`（固定定位）都会让元素脱离常规文档流，不再占据原本的空间。
* `position: relative;`（相对定位）**不会**脱离文档流，元素仍然占据它在常规流中原本的空间，视觉上的偏移不会影响后续元素的布局。

---

### 45. 关于 React Hook 功能介绍错误的是？

**选项：**
1. Hook 可以在 class 组件中使用
2. Hook 逻辑可以被复用
3. Hook 可以让函数组件使用生命周期
4. Hook 可以让函数组件使用 state

**正确答案：第一个选项（`Hook可以在class组件中使用`）**

**详细解析：**
* 选项一描述错误（为本题答案）。React Hooks 是 React 16.8 引入的新特性，其设计初衷就是为了让**函数组件**也能拥有状态和生命周期等特性。官方明确规定，**Hooks 只能在函数组件或自定义 Hook 中调用，不能在 class 组件内部使用**。
* 选项二、三、四描述正确，分别对应自定义 Hook 的逻辑复用、`useEffect` 模拟生命周期、`useState` 提供状态。

---

### 47. 关于 `HSLA`、`opacity`、`visibility=hidden`、`display=none` 的区别，下面说法错误的是？

**选项：**
1. `visibility=hidden`，元素被隐藏，不改变页面布局，但不会触发该元素已经绑定的事件
2. `display=none`，元素被隐藏，会改变页面布局，可以理解成在页面中该元素被删除
3. `opacity=0`，元素被隐藏，整个元素透明，包括元素内容，不改变页面布局，若该元素已经绑定事件，会触发事件
4. `HSLA/RGBA` 是背景透明，元素内容有透明效果

**正确答案：第四个选项（`HSLA/RGBA 是背景透明，元素内容有透明效果`）**

**详细解析：**
* 选项四描述错误（为本题答案）。`HSLA` 和 `RGBA` 是**颜色值**的写法，包含 Alpha 通道（透明度）。当应用于 `background-color` 或 `color` 时，仅仅改变背景或文字本身的透明度，**不会**让整个元素（及其所有子内容）产生整体透明效果。让整个元素都透明需要使用 `opacity` 属性。
* 选项一、二、三描述正确。

---

### 49. 关于对象的解构赋值说法不正确的是？

**选项：**
1. 解构赋值会拷贝继承自原型对象的属性
2. 解构赋值的拷贝是浅拷贝，如果一个键的值是复合类型的值（数组、对象、函数），那么解构赋值拷贝的是这个值的副本（引用）
3. 解构赋值要求等号右边有一个对象，所以如果等号右边是 undefined 或 null，就会报错，因为它们无法转为对象
4. 进行解构赋值必须是最后一个参数，否则会报错

**正确答案：第一个选项（`解构赋值会拷贝继承自原型对象的属性`）**

**详细解析：**
* 选项一描述错误（为本题答案）。对象的解构赋值在查找属性时，**只会查找对象自身的可枚举属性（Own Enumerable Properties）**，而**不会**去查找或拷贝原型链上继承来的属性。
* 选项二、三、四描述正确。解构赋值是浅拷贝，拷贝的是引用；对 `null` 或 `undefined` 解构会抛出 TypeError；在函数参数解构中，解构参数通常必须是最后一个参数。

---

### 50. JavaScript 中，下面哪种方式不能改变作用域链？

**选项：**
1. try catch
2. eval
3. call
4. while

**正确答案：第四个选项（`while`）**

**详细解析：**
* `try catch`：`catch` 子句会创建一个新的块级作用域，并将异常参数添加到作用域链前端，会改变作用域链。
* `eval`：`eval()` 函数在执行时，如果是在非严格模式下直接调用，会将传入的字符串作为代码在当前作用域中执行，可以引入新的变量声明，从而修改或扩展当前的作用域链。
* `call`：`call()`、`apply()`、`bind()` 改变函数执行时的 `this` 指向，同时也切换了函数的执行上下文及其关联的作用域链。
* `while`：是一个循环控制语句，只负责控制代码块的重复执行。**它不会创建新的作用域**，也不会改变作用域链的结构。