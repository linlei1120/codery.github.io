# ES6 Proxy 与 Reflect

*ES6 引入 **Proxy** 用于**自定义对象基本操作的默认行为**（属性读写、枚举、`in`、`delete`、函数调用、`new` 等），**Reflect** 则提供与这些操作一一对应的**静态方法**，语义更规范，且与 Proxy 的 **trap** 名称、参数对齐，便于在拦截器里「转发默认行为」并正确处理返回值。*

## 1、Proxy 概述

**(1) 基本形式：** `new Proxy(target, handler)`。`target` 为被代理的**任意对象**（含数组、函数）；`handler` 为**处理器对象**，其上的方法称为 **trap（拦截器）**。

```js
const target = { name: '张三', age: 25 };

const proxy = new Proxy(target, {
  get(target, property, receiver) {
    console.log(`读取：${String(property)}`);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log(`写入：${String(property)} = ${value}`);
    return Reflect.set(target, property, value, receiver);
  },
});

proxy.name;      // 读取：name → '张三'
proxy.age = 26;  // 写入：age = 26
```

**(2) 与直接操作 target 的关系：** 多数 trap 未定义时，行为与**直接操作 target** 一致；定义 trap 后，对应操作走 trap。**Proxy 本身不是 target 的拷贝**，读写经 trap 转发到 target（或由 trap 完全自定义）。

**(3) 可撤销代理：** `Proxy.revocable(target, handler)` 返回 `{ proxy, revoke }`，调用 `revoke()` 后代理不可再用。

```js
const { proxy, revoke } = Proxy.revocable({ x: 1 }, {});
proxy.x; // 1
revoke();
// proxy.x; // TypeError: Cannot perform 'get' on a proxy that has been revoked
```

&emsp;**注意：** ① Proxy **不能**代理**非对象**（如 `null`、`undefined`、原始值）；若需代理原始值，可先装箱或包一层对象；② 对同一 `target` 可建多个 Proxy，互不影响；③ **没有**「Proxy.prototype」链上的额外属性——访问 `proxy` 的属性默认走 `get` trap 或 target。

## 2、常见 trap 与触发的语法

| trap | 典型触发方式 |
|------|----------------|
| `get(target, prop, receiver)` | `obj.prop`、`obj['prop']`、**解构**读取 |
| `set(target, prop, value, receiver)` | 赋值、`obj.prop = v` |
| `has(target, prop)` | `prop in obj` |
| `deleteProperty(target, prop)` | `delete obj.prop` |
| `ownKeys(target)` | `Object.keys` / `getOwnPropertyNames` / `getOwnPropertySymbols`、**展开与遍历**依赖的键收集 |
| `getOwnPropertyDescriptor(target, prop)` | `Object.getOwnPropertyDescriptor` |
| `defineProperty(target, prop, desc)` | `Object.defineProperty` |
| `preventExtensions(target)` | `Object.preventExtensions` |
| `isExtensible(target)` | `Object.isExtensible` |
| `getPrototypeOf(target)` | `Object.getPrototypeOf` |
| `setPrototypeOf(target, proto)` | `Object.setPrototypeOf` |
| `apply(target, thisArg, args)` | `proxy(...args)`（target 为**函数**） |
| `construct(target, args, newTarget)` | `new proxy(...args)`（target 为**构造函数**） |

```js
const p = new Proxy({ a: 1 }, {
  has(t, key) {
    return key === 'a'; // 'b' in p → false
  },
  deleteProperty(t, key) {
    delete t[key];
    return true; // delete 成功须返回 true
  },
});

'a' in p;        // true
'b' in p;        // false
delete p.a;      // 走 deleteProperty
```

&emsp;**注意：** ① **`set` / `deleteProperty`** 在严格模式下返回 **`false`** 会抛 **TypeError**；成功应返回 **`true`**；② **`receiver`** 通常传给 `Reflect.get/set`，用于正确处理 **getter/setter** 与 **继承** 上的 `this` 绑定；③ 仅代理 **一层**：若 `get` 返回的是普通嵌套对象，后续访问**不会**自动再被同一 Proxy 拦截，响应式库会在此递归包 Proxy。

## 3、Reflect 概述

*Reflect 是 ES6 新增的**内置对象**（不是函数），其方法对应对象的**内部方法**；默认行为与在对象上直接调用同名「旧 API」一致，但返回值更统一（如 `Reflect.set` 返回布尔值，而部分旧写法在失败时抛错或返回对象）。*

```js
const obj = { x: 1, y: 2 };

Reflect.get(obj, 'x');                    // 1
Reflect.set(obj, 'z', 3);                 // true
Reflect.has(obj, 'x');                    // true
Reflect.deleteProperty(obj, 'y');         // true
Reflect.ownKeys(obj);                     // ['x', 'z']

function greet(greeting, name) {
  return `${greeting}, ${name}!`;
}
Reflect.apply(greet, null, ['你好', '张三']); // "你好, 张三!"

class Person {
  constructor(name) { this.name = name; }
}
Reflect.construct(Person, ['李四']); // Person { name: '李四' }
```

### Reflect 静态方法一览

| 方法 | 含义（与 Proxy trap 对应） |
|------|---------------------------|
| `Reflect.get(target, prop, receiver?)` | 读属性 |
| `Reflect.set(target, prop, value, receiver?)` | 写属性 |
| `Reflect.has(target, prop)` | `in` |
| `Reflect.deleteProperty(target, prop)` | `delete` |
| `Reflect.ownKeys(target)` | 自有键（含 Symbol） |
| `Reflect.getOwnPropertyDescriptor(target, prop)` | 属性描述符 |
| `Reflect.defineProperty(target, prop, desc)` | 定义属性 |
| `Reflect.preventExtensions(target)` | 禁止扩展 |
| `Reflect.isExtensible(target)` | 是否可扩展 |
| `Reflect.getPrototypeOf(target)` | 读原型 |
| `Reflect.setPrototypeOf(target, proto)` | 设原型 |
| `Reflect.apply(fn, thisArg, args)` | 函数调用 |
| `Reflect.construct(Fn, args, newTarget?)` | `new` |

&emsp;**注意：** ① 在 Proxy trap 内修改 target 时，推荐 **`Reflect.set/deleteProperty/...`** 而非直接 `target[prop] = v`，以便遵守 **descriptor**（writable、configurable）并与规范默认行为一致；② **`Reflect.get` 的 receiver** 传给 accessor 的 getter，保证 `get xxx() { return this._x }` 中 `this` 指向正确（如指向 proxy）；③ 部分旧 API 已逐步被 Reflect 替代（如 `Function.prototype.apply` → `Reflect.apply`），新代码在 trap 与元编程中优先 Reflect。

## 4、Proxy 与 Reflect 配合（标准转发模板）

*在 trap 中「先做点事，再按默认规则转发」是常见模式。*

```js
const handler = {
  get(target, prop, receiver) {
    // 自定义：访问日志、默认值、屏蔽 _ 前缀等
    if (typeof prop === 'string' && prop.startsWith('_')) {
      throw new Error('不可访问私有键');
    }
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    if (prop === 'age' && (typeof value !== 'number' || value < 0)) {
      return false; // 或 throw
    }
    return Reflect.set(target, prop, value, receiver);
  },
};

const user = new Proxy({ name: '张三', age: 25 }, handler);
```

## 5、典型应用场景

**(1) 数据校验 / 表单模型：**

```js
function createValidated(target, schema) {
  return new Proxy(target, {
    set(target, prop, value, receiver) {
      const validate = schema[prop];
      if (validate && !validate(value)) {
        throw new TypeError(`属性 ${String(prop)} 不合法`);
      }
      return Reflect.set(target, prop, value, receiver);
    },
  });
}

const user = createValidated(
  {},
  {
    name: (v) => typeof v === 'string' && v.length > 0,
    age: (v) => typeof v === 'number' && v >= 0 && v <= 150,
  }
);

user.name = '张三';
user.age = 25;
// user.age = -1; // TypeError
```

**(2) 简化响应式（Vue 3 思路）：** 在 `get` 里依赖收集、在 `set` 里触发更新；嵌套对象需递归代理。

```js
function reactive(obj, onChange) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (value !== null && typeof value === 'object') {
        return reactive(value, onChange);
      }
      return value;
    },
    set(target, prop, value, receiver) {
      const old = Reflect.get(target, prop, receiver);
      const ok = Reflect.set(target, prop, value, receiver);
      if (ok && old !== value) {
        onChange(String(prop), value, old);
      }
      return ok;
    },
  });
}

const state = reactive({ count: 0 }, (k, n, o) => {
  console.log(`${k}: ${o} → ${n}`);
});
state.count = 1; // count: 0 → 1
```

**(3) 负索引数组等「语义增强」：**

```js
function createArray(...elements) {
  return new Proxy(elements, {
    get(target, prop, receiver) {
      const index = Number(prop);
      if (Number.isInteger(index) && index < 0) {
        return Reflect.get(target, String(target.length + index), receiver);
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}

const arr = createArray('a', 'b', 'c');
arr[-1]; // 'c'
```

**(4) 拦截函数调用（`apply`）：** 可用于日志、鉴权、计时；防抖/节流更常见写法是直接包一层函数，Proxy 适合统一代理「已是函数」的 target。

```js
function trace(fn) {
  return new Proxy(fn, {
    apply(target, thisArg, args) {
      console.log('call', target.name, args);
      return Reflect.apply(target, thisArg, args);
    },
  });
}

const add = trace((a, b) => a + b);
add(1, 2); // call add [1, 2] → 3
```

## 6、Proxy 与 Object.defineProperty 对比

| 维度 | `Object.defineProperty`（ES5） | `Proxy`（ES6） |
|------|----------------------------------|----------------|
| 拦截粒度 | 单个属性，需逐个定义 | 整个对象，统一 handler |
| 新增属性 | 后增属性默认**不**响应，常需递归遍历 + define | `set` trap 可拦截**新增**键 |
| 数组 / 索引 | 需特殊处理 `length`、下标 | 可拦截 `get/set`（含数字键） |
| 删除 / `in` | 无统一拦截 | `deleteProperty` / `has` |
| 性能与工具链 | 成熟、部分旧环境 | 需 ES6+；**无法** polyfill 完整 Proxy |
| 典型用途 | Vue 2 响应式 | Vue 3、Immer 思路、元编程 |

&emsp;**注意：** Proxy 并非万能——**只读、不可配置**的属性、部分**内置对象**的内部槽（internal slot）对 Proxy 有限制；框架会在边界处做特殊处理或回退。

## 7、边界与规范要点（面试常问）

**(1) `set` 返回值：** 非严格模式失败可能静默；严格模式 **`return false`** → **TypeError**。

**(2) 不变性（invariants）：** 若 target 上某属性为 **不可配置且不可写**，trap 不能把 `set` 写成成功却改值；`getOwnPropertyDescriptor` 等 trap 也有对应约束，违反会抛 **TypeError**。

**(3) `ownKeys`：** 返回数组须包含 target 的**不可配置自有键**，且不能包含 target 上不存在的键（除非 target 可扩展且你在 define 新键）。

**(4) 函数与构造：** 对函数做 Proxy 时，`apply` 与 `construct` 分别拦截「当函数调」与「当 `new` 调」；若只代理 construct，普通调用可能仍走 `apply` 或未定义 trap 的默认行为。

```js
function Fn() {}
const p = new Proxy(Fn, {
  construct(target, args, newTarget) {
    console.log('new', args);
    return Reflect.construct(target, args, newTarget);
  },
});
new p(1, 2); // new [1, 2]
```

## 8、与 ES5 / 旧写法对照（小结）

| 需求 | ES5 / 旧写法 | ES6 Proxy + Reflect |
|------|----------------|----------------------|
| 统一读写拦截 | 逐个 `defineProperty` + getter/setter | 单个 `new Proxy(obj, handler)` |
| 属性存在性 | 难以拦截 `in` | `has` trap |
| 删除属性 | 难以统一拦截 | `deleteProperty` trap |
| 规范地转发读写 | 手动 `target[k]`，易忽略 descriptor | `Reflect.get/set(..., receiver)` |
| 函数调用元编程 | `fn.apply` | `Reflect.apply` + `apply` trap |

## 9、延伸（非 ES6 核心，常一起记）

*以下在后续标准或生态中常见，学习与面试常与 Proxy 并列：*

- **微前端 / 沙箱：** qiankun 等使用 **Proxy 沙箱** 隔离子应用对 `window` 的读写（见 [微前端](../microFrontend/index.md)）。
- **ES2017+：** **`WeakMap` / `WeakSet`** 常与「私有状态存 weak 集合 + Proxy 拦截公开键」组合，避免私有字段挂在 target 上被枚举。
- **ES2022：** 类 **`#` 私有字段** 由语言保证私有，与「Proxy 模拟 _ 前缀私有」是不同层级的方案；Proxy 无法拦截对 **# 字段** 的访问（它们在语法层，不在普通对象属性模型里）。

```js
// 旧思路：WeakMap 存私有数据，Proxy 只暴露公开 API
const privateStore = new WeakMap();

function createEntity(publicData) {
  const state = { ...publicData };
  privateStore.set(state, { secret: 0 });
  return new Proxy(state, {
    get(t, k) {
      if (k === 'getSecret') {
        return () => privateStore.get(t).secret;
      }
      return Reflect.get(t, k);
    },
  });
}
```

- **设计原则：** 需要**透明代理**时在 trap 末尾 **`Reflect.*` 转发**；需要**拒绝操作**时 **`return false`** 或 **抛错**；响应式等场景注意**递归代理**与**数组 / Map / Set** 的特殊处理（库内实现，手写 demo 可先只做纯对象）。
