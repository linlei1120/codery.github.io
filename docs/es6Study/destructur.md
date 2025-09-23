# 一、变量的解构赋值

*解构是指可以按照一定的格式从数组或对象中提取值，对变量进行赋值，本质上是一种模式匹配。*

## 1、数组解构赋值
**(1) 基本用法：** 在数组中，只要模式匹配正确即等号左右模式相等，无论是一维数组还是多维数组都可以使用解构赋值；
```js
// 普通赋值
let a = 1;
let b = 2;
let c = 3;
//解构赋值
let [a,b,c] = [1,2,3];
//多为数组解构赋值
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3
//空占位符
let [, , num] = [1,2,3];
num // 3
//解构集合
let [head, ...tail] = [1,2,3,4];
head //1
tail //[2,3,4]
```

&emsp;**注意：** ①但是若解构不成功则会返回`undefined`；② 左边变量为数组类型，右边变量也需要是`Iterator`可遍历类型数据，否则报错；

**(2) 解构默认值：** 默认值可以是任意值和函数，默认值只有在等号右侧对应数据值为`undefined`时才会生效，其他不会生效包括`null`；
```js
let [foo = true] = [];
foo // true
let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'
// 非undefined不生效
let [x = 1] = [undefined];
x // 1
let [x = 1] = [null];
x // null

// 函数默认值
function f() {
  console.log('aaa');
}
let [x = f()] = [1];
// 等价于
let x;
if ([1][0] === undefined) {
  x = f();
} else {
  x = [1][0];
}

//数组进行对象形式的解构赋值
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr;
first // 1
last // 3
```
## 2、对象解构赋值
**(1) 基本用法：** 由于数组中元素的解构赋值可以按照排序进行，但是在对象中没有，因此等号两侧解构赋值必须属性名相同才能完成；若左右变量名不相同，也可以使用默认值处理；
```js
let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"
let { baz } = { foo: 'aaa', bar: 'bbb' };
baz // undefined

// 变量名与属性名不一致：注意前者为属性名后者为属性
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"
let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'
```
**(2) 原生对象解构赋值：** 解构赋值同样适用于原生对象，如Math对象、Console对象等，可以将这些原生对象的属性方法解构出来直接使用；
```js
// 例一
let { log, sin, cos } = Math;
// 例二
const { log } = console;
log('hello') // hello
```

**(3) 嵌套对象解构赋值：** 在嵌套解构赋值中，第一层的字段只是声明作用无法被赋值，若要赋值需要单独声明一个变量字段。注意对象的嵌套解构赋值还可以继承对象的属性。
```js
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};
let { p, p: [x, { y }] } = obj;
x // "Hello"
y // "World"
p // ["Hello", {y: "World"}]

//对象继承
const obj1 = {};
const obj2 = { foo: 'bar' };
Object.setPrototypeOf(obj1, obj2);
const { foo } = obj1;
foo // "bar"
```
## 3、字符串解构赋值
**(1) 基本用法：** 字符串也可以进行解构赋值，其操作与数组的类似，也可以操作`length`属性。
```js
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"
const [length : len] = 'hello';
len //5
```
## 4、数组和布尔值解构赋值
**(1) 基本用法：** 对于数值和布尔类型时，解构赋值会先将其转换为包装对象，因此`undefined`和`null`无法被解构赋值，因为它们无法被转换成包装对象。
```js
let {toString: s} = 123;
s === Number.prototype.toString // true
let {toString: s} = true;
s === Boolean.prototype.toString // true
```

## 5、函数参数解构赋值
**(1) 数组参数**
**核心概念:**
- 函数参数可以直接使用数组解构语法
- 在参数传入时会自动解构为独立变量

**示例与应用:**
```javascript
// 基础数组解构
function add([x, y]) {
  return x + y;
}
add([1, 2]); // 3
// 在高阶函数中的应用
[[1, 2], [3, 4]].map(([a, b]) => a + b); // [3, 7]
```

**(2) 对象参数**
**两种主要写法对比:** 为解构出的属性设置默认值；更灵活的参数处理。

```javascript
// 默认写法
function move({x = 0, y = 0} = {}) {
  return [x, y];
}
move({x: 3, y: 8}) // [3, 8]
move({x: 3})       // [3, 0]
move({})           // [0, 0]
move()            // [0, 0]
```

**(3) 参数默认值触发机制**
**关键点:**
- `undefined`会触发参数默认值
- 可用于函数参数的可选处理
```javascript
[1, undefined, 3].map((x = 'yes') => x);
// [1, 'yes', 3]
```

## 6、解构赋值应用场景
*解构赋值有很多常用的场景，包括变换变量的值、从函数中返回多个值、函数参数定义、提取JSON数据、函数参数默认值、遍历Map结构等*
```js
// 应用一：交换变量的值
let x = 1;
let y = 2;
[x, y] = [y, x];

// 应用二：从函数返回多个值
function example() {
    return [1,2,3];
}
function example() {
  return {
    foo: 1,
    bar: 2
  };
}
// 返回一个数组
let [a,b,c] = example();
// 返回一个对象
let { foo, bar } = example();

// 应用三：函数参数定义
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});

// 应用四：提取 JSON 数据
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]

// 遍历Map结构
const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello
// second is world
```