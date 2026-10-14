# ES6 字符串

*ES6 在字符串上主要增加了**模板字符串**、**标签模板**、**Unicode 增强**以及一批**实例方法**（`includes` / `startsWith` / `endsWith` / `repeat` 等），使拼接、多行文本、按码点处理字符和常见判断更加直观。*

## 1、模板字符串（Template Literals）

**(1) 基本用法：** 使用反引号 `` ` `` 包裹字符串，在 `${expression}` 中嵌入任意表达式，结果会转为字符串并拼接。

```js
const name = 'Bob';
const age = 18;
const str = `我叫${name}，今年${age}岁`;
// "我叫Bob，今年18岁"

// 表达式可以是运算、函数调用、三元等
`1 + 2 = ${1 + 2}`; // "1 + 2 = 3"
`是否成年：${age >= 18 ? '是' : '否'}`;
```

**(2) 多行字符串：** 模板字符串保留换行与缩进，无需 `\n` 或字符串拼接。

```js
const html = `
  <ul>
    <li>first</li>
    <li>second</li>
  </ul>
`;
```

**(3) 嵌套模板：** 模板内可再嵌套模板，常用于动态生成片段。

```js
const items = ['a', 'b'];
const list = `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
```

&emsp;**注意：** ① `${}` 内若不是字符串，会调用 `ToString`（如 `null` → `"null"`，`undefined` → `"undefined"`）；② 若要在模板中输出反引号或 `${`，需转义：`` `\`` ``、`` `\${` ``；③ 模板字符串是 ES6 **字面量语法**，不是 `String` 构造函数的新方法。

## 2、标签模板（Tagged Templates）

*在模板字符串前加**标签函数**（tag），由该函数解析「字符串片段数组 + 插值结果」，用于 DSL、国际化、防 XSS、样式组件（如 styled-components 思路）等。*

```js
function tag(strings, ...values) {
  // strings: 按插值切分后的静态字符串数组（raw 属性为原始片段）
  // values: 各 ${} 求值后的结果
  console.log(strings); // ["Hello ", ", you are ", " years old"]
  console.log(values);  // ["Bob", 18]
  return strings.reduce((acc, s, i) => acc + s + (values[i] ?? ''), '');
}

const name = 'Bob';
const age = 18;
tag`Hello ${name}, you are ${age} years old`;
```

&emsp;**注意：** ① 标签函数第一个参数是**数组对象**，且带有 `raw` 属性（与 `String.raw` 相关）；② 标签函数**返回值**会成为整个表达式的值，类型不限于字符串。

## 3、String.raw

*按「原始字符串」处理反斜杠转义，常用于正则、Windows 路径等需要大量 `\` 的场景。*

```js
// 普通模板：\n 会被解释为换行
`换行\n`; // 两行

// String.raw：保留 \ 与 n 两个字符
String.raw`换行\n`; // "换行\\n"（显示为 \n 两个字符）

// 等价于对 cooked 与 raw 片段按 raw 拼接
String.raw({ raw: ['a', 'b'] }, 1, 2); // "a1b2"
```

模板字符串上的 **`tag` 函数** 可通过 `strings.raw` 拿到未处理转义的片段，与 `String.raw` 行为一致。

## 4、Unicode 增强

ES5 中 `\uXXXX` 只能表示 BMP（基本多文种平面）内的码点；ES6 支持**按码点**读写与表示，避免代理对（surrogate pair）带来的「长度、下标、切片」陷阱。

**(1) 码点表示 `\u{...}`：**

```js
'\u{1F600}'; // 😀（一个 Unicode 码点）
'\u{20BB7}'; // 𠮷（超出 BMP）
```

**(2) `codePointAt(pos)`：** 返回位置上的码点（大于 `0xFFFF` 时返回完整码点，而非单独的高/低代理）。

```js
const s = '😀a';
s.length;           // 3（UTF-16 码元个数）
s.charCodeAt(0);    // 55357（高代理的一部分）
s.codePointAt(0);   // 128512（😀 的码点）
s.codePointAt(1);   // 56320（低代理，单独看无意义）
s.codePointAt(2);   // 97（'a'）
```

**(3) `String.fromCodePoint(...codePoints)`：** 由码点生成字符串（对比 `fromCharCode` 只接受 UTF-16 单元）。

```js
String.fromCodePoint(0x1F600, 0x61); // "😀a"
String.fromCharCode(0xD83D, 0xDE00); // 同样得到 "😀"，但要自己拼代理对
```

**(4) 与遍历的关系：** 字符串在 ES6 中是**可迭代对象**，默认 `for...of` 按 **Unicode 码点** 迭代（不是按 UTF-16 码元），与 `codePointAt` 语义一致。

```js
for (const ch of '😀a') {
  console.log(ch); // 😀 然后 a（各一次）
}
[...'😀a'].length; // 2
'😀a'.length;      // 3
```

&emsp;**注意：** ① `length`、`charAt`、`slice` 等仍是 **UTF-16 码元** 语义；处理 emoji、部分汉字时要优先 `codePointAt` / 展开 / `for...of`；② 视觉相等的字符可能有不同码点序列（组合字符），需 `normalize()`（ES5 已有）做规范化，不属于 ES6 新增 API。

## 5、新增实例方法

| 方法 | 作用 | 典型示例 |
|------|------|----------|
| `includes(searchString, position?)` | 是否包含子串 | `'hello'.includes('ell')` → `true` |
| `startsWith(searchString, position?)` | 指定位置起是否以子串开头 | `'hello'.startsWith('he')` → `true` |
| `endsWith(searchString, length?)` | 前 `length` 个字符是否以子串结尾 | `'hello'.endsWith('lo')` → `true` |
| `repeat(count)` | 重复连接 | `'ab'.repeat(3)` → `"ababab"` |

```js
// includes：替代 indexOf !== -1，且能正确处理 NaN（indexOf 对 NaN 无效）
'NaN'.includes('NaN'); // true
[NaN].indexOf(NaN);    // -1

// startsWith / endsWith 的第二个参数是「起始下标」或「截断长度」，不是 endIndex
'hello'.startsWith('ll', 2); // true（从下标 2 开始匹配）
'hello'.endsWith('llo', 4);  // true（只看前 4 个码元 "hell"）

// repeat：count 必须为非负整数，否则抛错
'x'.repeat(0);  // ""
'x'.repeat(2.9); // "xx"（内部 ToInteger）
```

&emsp;**注意：** ① 以上方法均可传**第二个参数**限定搜索/匹配范围；② 匹配区分大小写，需忽略大小写时先 `toLowerCase()` 或配合正则 `i`；③ `repeat` 在 count 为无穷或负数时会 `RangeError`。

## 6、与 ES5 写法对照（小结）

| 需求 | ES5 常见写法 | ES6 |
|------|----------------|-----|
| 拼接变量 | `'a' + x + 'b'` | `` `a${x}b` `` |
| 多行文本 | `'line1\n' + 'line2'` | 模板字符串直接换行 |
| 是否包含 | `str.indexOf('x') !== -1` | `str.includes('x')` |
| 前缀 / 后缀 | `str.indexOf('pre') === 0` 等 | `startsWith` / `endsWith` |
| 重复 | 循环或 Array 填再 join | `str.repeat(n)` |
| 四字节字符 | `charCodeAt` + 代理对手工处理 | `codePointAt` / `fromCodePoint` / `for...of` |

## 7、延伸（非 ES6，常一起记）

*以下在后续标准中补充，面试或日常开发常与 ES6 字符串一起出现：*

- **ES2017：** `padStart(targetLength, padString?)`、`padEnd(...)` — 定长补位（如日期、编号）。
- **ES2019：** `trimStart` / `trimEnd`（别名 `trimLeft` / `trimRight`）。
- **ES2021：** `replaceAll(searchValue, replaceValue)` — 全局替换字面量或正则。

```js
'5'.padStart(2, '0');     // "05"
'  hi  '.trimStart();     // "hi  "
'aabb'.replaceAll('b', 'x'); // "aaxx"
```
