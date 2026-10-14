# ES6 函数

*ES6 在函数上主要增加了**默认参数**、**剩余参数（Rest）**、**箭头函数**语法，以及 **`name` / `new.target` 等元信息**，使参数定义更灵活、回调中的 `this` 更易控，也更便于调试与区分「普通调用」与 `new` 调用。*

## 1、默认参数（Default Parameters）

**(1) 基本用法：** 在形参列表中为参数指定默认值；调用时若该实参为 **`undefined`**（或省略，等价于 `undefined`），则使用默认值。

```js
function greet(name = '游客', message = '欢迎光临') {
  return `${name}，${message}！`;
}
greet();           // "游客，欢迎光临！"
greet('张三');     // "张三，欢迎光临！"
greet('李四', '早上好'); // "李四，早上好！"
```

**(2) 默认值表达式：** 默认值可以是任意表达式，且**在每次调用、且需要默认值时**才求值（惰性）；可引用**已声明的左侧形参**（形成「参数之间的依赖」）。

```js
function calculate(x, y = x * 2) {
  return x + y;
}
calculate(5);    // 15（5 + 10）
calculate(5, 3); // 8

const multiply = (a, b = a) => a * b;
multiply(3);     // 9
multiply(3, 4);  // 12
```

**(3) 与解构默认值配合：** 函数形参可直接写解构，并为解构出的变量设默认值（详见 [解构赋值](./destructur.md) 中「函数参数解构」）。

```js
function createUser({ name = '匿名', role = 'guest' } = {}) {
  return { name, role };
}
createUser();                    // { name: '匿名', role: 'guest' }
createUser({ name: 'Alice' });   // { name: 'Alice', role: 'guest' }
```

&emsp;**注意：** ① 传入 **`null` 不会**触发默认值（只有 `undefined` 会）；② 默认参数所在作用域为**函数体顶层作用域**（与 ES5 仅 `arguments` 不同），内部 `let/const` 与形参同名时会进入暂时性死区；③ 有默认值的形参会在**函数体开头**按规范进入单独的作用域环境，影响 `typeof` 未声明变量等边界行为。

## 2、剩余参数（Rest Parameters）

*使用 `...name` 在**形参末尾**收集「多出来的实参」，得到**真正的数组**（非类数组 `arguments`），适合不定参、转发调用。*

```js
function sum(...nums) {
  return nums.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4, 5); // 15

// 与普通形参混用：rest 必须是最后一个形参
function log(level, ...messages) {
  console.log(level, ...messages);
}
```

```js
// 替代 arguments + apply 的典型写法
function fn(...args) {
  return someOtherFn(...args); // 展开实参调用（扩展运算符在「调用侧」）
}
```

&emsp;**注意：** ① **箭头函数没有**自己的 `arguments`，不定参应使用 rest；② rest 参数**不能**与函数体内的 `arguments` 混为一谈——在普通函数里两者并存时，`arguments` 仍反映**全部**实参，rest 只含「rest 之后收集的部分」；③ 解构中的 `...rest` 是同一语法在不同位置的另一种用法（数组/对象解构），语义是「收集剩余项」，见 [解构赋值](./destructur.md)。

## 3、箭头函数（Arrow Functions）

**(1) 语法形式：**

```js
// 完整参数
const add = (a, b) => a + b;

// 单参数可省略括号
const double = n => n * 2;

// 无参
const noop = () => {};

// 多语句需块体 + 显式 return
const pick = (obj, key) => {
  const v = obj[key];
  return v;
};

// 返回对象字面量须加括号，否则 {} 会被当作块
const makePoint = (x, y) => ({ x, y });
```

**(2) 与普通函数的核心差异：**

| 维度 | 普通函数 | 箭头函数 |
|------|----------|----------|
| `this` | 由**调用方式**决定（`bind/call/apply/new` 等） | **词法绑定**：继承定义时外层 `this`，**无法**被 `call/apply/bind` 改掉 |
| `arguments` | 有（非箭头、非严格模式下为类数组） | **无**，用 rest 代替 |
| `new` | 可作为构造函数 | **不能** `new`，无 `[[Construct]]` |
| `prototype` | 有（可挂原型方法） | **无** `prototype` |
| `yield` / `await` | 普通函数可配合 Generator；async 函数为特殊形态 | 箭头函数**不能**作 Generator；`async` 箭头函数合法 |

```js
const obj = {
  value: 42,
  regular() {
    setTimeout(function () {
      console.log(this.value); // undefined（回调内 this 丢失）
    }, 0);
  },
  arrow() {
    setTimeout(() => {
      console.log(this.value); // 42（继承 arrow 方法的 this）
    }, 0);
  },
};
```

**(3) 适用场景：** 数组高阶方法回调、Promise 链、事件/定时器里需要**固定外层 `this`** 时；**不适合**作对象方法（若依赖 `this` 指向对象本身时，应使用**简洁方法** `method() {}`）、原型方法、构造函数、需要动态 `this` 的函数。

&emsp;**注意：** ① 箭头函数**没有** `arguments`、`super`（除非在对象/类特定上下文的嵌套规则内，一般回调里不涉及 `super` 调用）；② 作为对象字面量属性时，`foo: () => {}` 的 `this` 指向**外层**，不是该对象——需要对象自身 `this` 时用 `foo() {}`；③ 老环境需 Babel 等转译为 `function` + 绑定 `this` 的写法。

## 4、简洁方法（Method Shorthand）

*ES6 在对象字面量与类中允许省略 `function` 关键字定义方法，语义为普通函数（有动态 `this`），与箭头函数属性形成对比。*

```js
const calculator = {
  x: 1,
  increment() {
    this.x += 1;
    return this.x;
  },
};

class Person {
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    return `Hi, ${this.name}`;
  }
}
```

&emsp;**注意：** 简洁方法**不是**箭头函数，可作为构造函数间接相关逻辑中的方法；**不可**在对象字面量里写 `constructor` 作为普通键名去模拟类（类语法才是 `constructor` 特殊方法）。

## 5、Function.prototype.name

*函数实例可读 **`name`** 属性，便于调试、堆栈与反射；ES6 规范化了推断规则。*

```js
function foo() {}
const bar = function () {};
const baz = () => {};

foo.name; // "foo"
bar.name; // "bar"
baz.name; // "baz"

// 赋值给变量时，多数引擎取变量名
const qux = function original() {};
qux.name; // "original" 或 "qux"（以实现与赋值形式为准，规范对多种形态有细则）

// Symbol 作为键的命名（ES2015+）
const sym = Symbol('desc');
const o = {
  [sym]() {},
};
o[sym].name; // "[desc]" 等形式
```

&emsp;**注意：** `name` 一般**不可写、不可枚举、可配置**；某些匿名函数在不同创建方式下 `name` 可能为空字符串或推断名，依赖引擎与源码形态。

## 6、new.target

*函数体内的 **元属性** `new.target`：若函数作为构造函数通过 **`new`** 调用，则值为该函数本身；**普通调用**时为 `undefined`（严格模式下访问安全，非严格亦同规范）。*

```js
function Person(name) {
  if (new.target === undefined) {
    throw new Error('请使用 new Person()');
  }
  this.name = name;
}

function Base() {
  if (new.target === Base) {
    // 直接 new Base
  }
}
class Derived extends Base {
  constructor() {
    super(); // 子类 constructor 内 new.target 为 Derived
  }
}
```

&emsp;**注意：** ① 箭头函数**没有** `new.target`（不能 `new`）；② 子类 `constructor` 中 `new.target` 指向**最初被 `new` 的子类**，常用于抽象基类防直接实例化、框架内部校验；③ 与 `instanceof`、 `Symbol.hasInstance` 等互补，解决的是「是否走构造调用」而非类型链 alone。

## 7、其他与函数相关的 ES6 变化（简要）

**(1) 块级函数声明：** 在 ES6 中，**严格模式**下块内 `function fn() {}` 具有块级作用域语义；非严格模式行为因浏览器历史实现存在差异，**新代码避免**在块内声明函数，改用函数表达式或箭头函数。

**(2) 尾调用优化（TCO）：** ES6 规范要求引擎在**严格模式**下对**尾位置**的函数调用做优化（复用栈帧），以便递归不爆栈；**主流引擎几乎未实现**该要求，实际开发仍依赖循环改写的递归或 trampoline，面试知道概念即可。

**(3) `arguments` 与 rest：** ES5 依赖 `arguments` 做不定参；ES6 推荐 **`...rest` + 扩展运算符展开调用**，代码更清晰且与箭头函数、解构一致。

## 8、与 ES5 写法对照（小结）

| 需求 | ES5 常见写法 | ES6 |
|------|----------------|-----|
| 参数默认值 | `a = a \|\| 1`（`0`、`''` 会被误伤） | `function f(a = 1) {}` |
| 不定参 | `arguments` + `Array.prototype.slice` | `function f(...args) {}` |
| 转发调用 | `fn.apply(null, arguments)` | `fn(...args)` |
| 回调保留 `this` | `var self = this` / `bind` | 箭头函数（词法 `this`） |
| 对象方法 | `obj: function () {}` | `obj.method() {}` |
| 调试函数名 | 依赖 `function name` 或难推断 | `fn.name` 规范化 |

## 9、延伸（非 ES6 核心语法，常一起记）

*以下在后续标准中补充，日常与面试常与 ES6 函数并列出现：*

- **ES2017：** **`async` / `await`** — 基于 Promise 的异步函数语法，本质是返回 Promise 的函数；可与箭头函数组合为 `async () => {}`。
- **ES2015 起（Generator）：** `function*` 与 `yield` — 另一种函数形态，用于迭代器与早期异步方案，见专题 [Promise](./promise.md) 与 Generator 资料。
- **ES2019：** **`Function.prototype.toString` 修订** — `toString()` 需尽量返回与源码一致的字符串（影响部分反序列化/工具链，日常较少手写依赖）。

```js
async function fetchJson(url) {
  const res = await fetch(url);
  return res.json();
}

const load = async (id) => fetchJson(`/api/${id}`);
```

- **设计原则：** 需要**动态 `this`**、**构造函数**、**Generator** 时用**普通函数 / 简洁方法**；需要**词法 `this` 的小回调**用**箭头函数**；不定参统一 **rest**，避免依赖 `arguments`。
