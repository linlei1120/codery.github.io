# ES6 数值

*ES6 在数值上主要增加了**二进制 / 八进制字面量**、一组更可靠的 **`Number` 静态方法**（类型判断与解析）、**安全整数**相关常量，以及大量 **`Math` 工具方法**，使进制书写、浮点比较和数学运算更符合直觉、更少踩全局函数的 coercion 坑。*

## 1、进制字面量

ES5 已有十六进制 `0x` / `0X`；ES6 正式支持**二进制**与**八进制**字面量（严格模式下不再依赖有歧义的「前导 0」八进制写法）。

```js
// 二进制
0b11;   // 3
0B1010; // 10

// 八进制（推荐写法）
0o17;   // 15（十进制）
0O777;  // 511

// 十六进制（ES5 起）
0xff;   // 255
```

&emsp;**注意：** ① 非严格模式下，以 `0` 开头且后跟 0–7 的写法（如 `0123`）仍可能被当作八进制，**可读性与可维护性差**，新代码应使用 `0o`；② 字面量只能表示**有限精度的 Number**，超大整数需 ES2020 的 `BigInt`（见文末延伸）。

## 2、Number 静态属性

| 属性 | 含义 |
|------|------|
| `Number.EPSILON` | 1 与大于 1 的最小可表示浮点数之差（约 `2.22e-16`），用于**浮点相等**容差 |
| `Number.MAX_SAFE_INTEGER` | `2^53 - 1`（`9007199254740991`），可精确表示的最大整数 |
| `Number.MIN_SAFE_INTEGER` | `-(2^53 - 1)` |

```js
0.1 + 0.2 === 0.3; // false

function roughlyEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}
roughlyEqual(0.1 + 0.2, 0.3); // true

Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2; // true（超出安全范围，精度丢失）
```

&emsp;**注意：** `Number.MAX_VALUE` / `Number.MIN_VALUE` 等是 ES5 已有，表示可表示数的上下界，与「安全整数」概念不同——前者是**幅度极限**，后者是**整数精确性**边界。

## 3、Number 静态方法：判断与解析

ES6 把常用的全局数值函数「模块化」到 `Number` 上，并修正了**先强制类型转换再判断**的行为。

| 方法 | 作用 |
|------|------|
| `Number.isFinite(value)` | 是否为有限数值（**不对非数字做 coercion**） |
| `Number.isNaN(value)` | 是否为 `NaN`（仅当值为 `NaN` 时为 true） |
| `Number.parseInt(string, radix?)` | 同 `parseInt`，挂在 `Number` 上便于 tree-shaking / 语义分组 |
| `Number.parseFloat(string)` | 同 `parseFloat` |
| `Number.isInteger(value)` | 是否为整数（且为有限数） |
| `Number.isSafeInteger(value)` | 是否为 [-MAX_SAFE, MAX_SAFE] 内的整数 |

```js
// isFinite：全局 isFinite 会先 ToNumber
isFinite('1');        // true
Number.isFinite('1'); // false

// isNaN：全局 isNaN 对 'hello' 等也会 true
isNaN('hello');        // true
Number.isNaN('hello'); // false
Number.isNaN(NaN);     // true

Number.isInteger(3);      // true
Number.isInteger(3.0);    // true
Number.isInteger(3.1);    // false
Number.isInteger(Infinity); // false

Number.isSafeInteger(3);                    // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER); // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1); // false（已不能精确表示）
```

```js
// parseInt / parseFloat：行为与全局版一致，radix 建议始终传入
Number.parseInt('0xff', 16); // 255
Number.parseInt('010', 10);  // 10（避免八进制歧义）
Number.parseFloat('3.14px'); // 3.14
```

&emsp;**注意：** ① 判断「是不是数字、是不是 NaN、是不是整数」时，优先用 `Number.*` 系列，避免全局函数的隐式转换；② `Number.isInteger` 对 `3.0` 为 true，但不保证在安全整数范围内，需精确整数运算时再配合 `isSafeInteger`。

## 4、安全整数与 IEEE 754 简要说明

JavaScript 的 `Number` 是 **IEEE 754 双精度浮点**，整数精确表示范围约为 `±(2^53 - 1)`。在此范围内，「一个数值对应一个唯一整数」；超出后，相邻可表示数之间的间隔大于 1，**大整数运算会静默丢精度**。

```js
9007199254740992 === 9007199254740993; // true（两个不同整数在 Number 中相等）

// 判断后再做 ID、金额分（厘）等整数逻辑
function addSafe(a, b) {
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b)) {
    throw new RangeError('unsafe integer');
  }
  return a + b;
}
```

&emsp;**注意：** 浮点小数（如 `0.1`）本身就不能用二进制浮点精确表示，与「安全整数」是两类问题；比较浮点用 `EPSILON` 或定点化（分为单位存整数）。

## 5、Math 新增方法

ES6 扩展了 `Math`，以下按用途分组（均为**静态方法**，挂在 `Math` 上）。

### (1) 取整与符号

| 方法 | 作用 |
|------|------|
| `Math.trunc(x)` | 去掉小数部分（向 0 取整） |
| `Math.sign(x)` | 符号：正 `1`、负 `-1`、零 `0`、`-0` 为 `-0`、NaN 为 `NaN` |

```js
Math.trunc(4.9);   // 4
Math.trunc(-4.9);  // -4（与 Math.floor(-4.9) === -5 不同）

Math.sign(5);      // 1
Math.sign(-0);     // -0
Math.sign(NaN);    // NaN
```

### (2) 32 位整数运算（常用于位运算、图形、哈希）

| 方法 | 作用 |
|------|------|
| `Math.clz32(x)` | 32 位无符号整数前导零个数 |
| `Math.imul(a, b)` | 32 位有符号乘法（模拟 C 的 `int` 溢出） |
| `Math.fround(x)` | 舍入为 32 位单精度浮点 |

```js
Math.clz32(0b1000); // 29
Math.imul(0xffffffff, 0xffffffff); // 1（32 位溢出）
Math.fround(1.337); // 更接近 float32 的值
```

### (3) 根号、距离

```js
Math.cbrt(27);           // 3（立方根）
Math.hypot(3, 4);        // 5（sqrt(3^2 + 4^2)，多参数时可传多个坐标）
Math.hypot(...[3, 4]);   // 5
```

### (4) 对数与指数（数值稳定写法）

| 方法 | 作用 |
|------|------|
| `Math.log10(x)` | 以 10 为底的对数 |
| `Math.log2(x)` | 以 2 为底的对数 |
| `Math.log1p(x)` | `ln(1 + x)`，x 接近 0 时更精确 |
| `Math.expm1(x)` | `e^x - 1`，x 接近 0 时更精确 |

```js
Math.log10(100);  // 2
Math.log2(8);     // 3
Math.log1p(1e-20); // 比 Math.log(1 + 1e-20) 更可靠
Math.expm1(1e-10);
```

### (5) 双曲函数

`Math.sinh` / `Math.cosh` / `Math.tanh` 及反函数 `Math.asinh` / `Math.acosh` / `Math.atanh`，用于科学计算、机器学习公式等，日常业务较少直接用到。

&emsp;**注意：** ① `Math.trunc` 不是 `Math.floor` 的别名，负数行为不同；② `Math.sign` 对 `-0` 返回 `-0`，若只关心正负可自己封装；③ 需要「整数除法 / 取模」时仍用 `%` 与 `Math.trunc` 组合，并注意负数取模语义。

## 6、与 ES5 / 全局写法对照（小结）

| 需求 | ES5 / 全局常见写法 | ES6 |
|------|---------------------|-----|
| 二进制 / 八进制 | `parseInt('1010', 2)`、`parseInt('17', 8)` | `0b1010`、`0o17` |
| 是否有限数 | `isFinite(x)`（会 coercion） | `Number.isFinite(x)` |
| 是否 NaN | `isNaN(x)` 或 `x !== x` | `Number.isNaN(x)` |
| 是否整数 | `x % 1 === 0` 等 | `Number.isInteger(x)` |
| 大整数是否可靠 | 手工比较 `MAX_VALUE` | `Number.isSafeInteger` + 常量 |
| 浮点近似相等 | 魔数 `1e-15` | `Number.EPSILON` |
| 向 0 取整 | `x \| 0`、`~~x`（有 32 位限制） | `Math.trunc(x)` |
| 解析字符串 | `parseInt` / `parseFloat` | `Number.parseInt` / `Number.parseFloat`（行为一致） |

## 7、延伸（非 ES6，常一起记）

*以下在后续标准中补充，与 ES6 数值题常一并出现：*

- **ES2017：** `Object.is(value1, value2)` — 同值相等（`+0` 与 `-0` 区分、`NaN` 与 `NaN` 相等），比较数值语义时常用。
- **ES2020：** **`BigInt`**（后缀 `n` 或 `BigInt()`）— 任意精度整数，与 `Number` 不可混算，需显式转换。

```js
Object.is(NaN, NaN);   // true
Object.is(+0, -0);     // false

const big = 9007199254740993n;
big + 1n; // 9007199254740994n（精确）
// big + 1  // TypeError
```

- **ES2020：** `Number.isInteger` 已够用；格式化展示仍多用 **`Intl.NumberFormat`**（国际化）或 `toLocaleString`，不属于 ES6 新增核心。
