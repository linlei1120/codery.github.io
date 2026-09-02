# ES6面试题集

‌&emsp;&emsp;ECMAScript 6.0（以下简称 ES6）是 JavaScript 语言的下一代标准，已经在 2015 年 6 月正式发布了。它的目标，是使得 JavaScript 语言可以用来编写复杂的大型应用程序，成为企业级开发语言。[查看ES6官网文档地址](https://es6.ruanyifeng.com/#docs/intro)。

---

## 基础语法篇

## 1、let和const与var的区别

&emsp;&emsp;在ES6中，引入了`let`和`const`两个新的变量声明关键字，它们与传统的`var`有以下核心区别：

&emsp;&emsp;**（1）作用域规则**
```js
// var 是函数作用域，在函数内任何位置声明都会提升到函数顶部
function varScope() {
    if (true) {
        var name = '张三';
    }
    console.log(name); // 输出：张三（var不会产生块级作用域）
}

// let 是块级作用域，只在{}内部有效
function letScope() {
    if (true) {
        let name = '李四';
    }
    console.log(name); // 报错：name is not defined
}
```

&emsp;&emsp;**（2）变量提升**
```js
// var 声明的变量会提升到函数顶部，可以先使用后声明
console.log(message); // 输出：undefined（变量提升，值为undefined）
var message = 'Hello';

// let 存在暂时性死区，在声明前使用会报错
console.log(title); // 报错：Cannot access 'title' before initialization
let title = 'World';
```

&emsp;&emsp;**（3）重复声明**
```js
// var 允许重复声明
var count = 1;
var count = 2; // 不会报错

// let 不允许重复声明
let num = 1;
let num = 2; // 报错：Identifier 'num' has already been declared
```

&emsp;&emsp;**（4）const常量特性**
```js
// const 声明时必须初始化
const PI = 3.14159;

// const 保证的是变量指向的内存地址不变
const obj = { name: '张三' };
obj.age = 20; // 正确，可以修改对象属性
obj = {}; // 报错，不能重新赋值

// 冻结对象使其完全不可变
const frozenObj = Object.freeze({ name: '测试' });
frozenObj.name = '修改'; // 在严格模式下会报错
```

---

## 2、模板字符串详解

&emsp;&emsp;模板字符串是ES6中用于处理字符串的新语法，使用反引号（`）包裹，可以实现更优雅的字符串拼接和多行文本。

&emsp;&emsp;**（1）基本用法**
```js
const name = '张三';
const age = 25;

// 传统方式拼接
const info1 = '姓名：' + name + '，年龄：' + age;

// 模板字符串方式
const info2 = `姓名：${name}，年龄：${age}`;
```

&emsp;&emsp;**（2）嵌入表达式**
```js
const a = 10;
const b = 20;

// 嵌入算术表达式
console.log(`a + b = ${a + b}`); // a + b = 30

// 嵌入三元表达式
const isAdult = age >= 18 ? '成年人' : '未成年人';
console.log(`身份：${isAdult}`);

// 嵌入函数调用
function greet(name) {
    return `你好，${name}！`;
}
console.log(`${greet('小明')}`); // 你好，小明！
```

&emsp;&emsp;**（3）多行文本**
```js
// 传统方式需要使用\n换行符
const html1 = '<div>\n' +
    '    <h1>标题</h1>\n' +
    '    <p>段落内容</p>\n' +
    '</div>';

// 模板字符串直接支持多行
const html2 = `
    <div>
        <h1>标题</h1>
        <p>段落内容</p>
    </div>
`;
```

---

## 3、解构赋值

&emsp;&emsp;解构赋值是ES6中的一种语法糖，可以从数组或对象中提取值，赋值给变量。

&emsp;&emsp;**（1）数组解构**
```js
// 基本用法
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3

// 跳过某些元素
const [first, , third] = ['一', '二', '三'];
console.log(first, third); // 一 三

// 剩余模式
const [head, ...rest] = [1, 2, 3, 4, 5];
console.log(head, rest); // 1 [2, 3, 4, 5]

// 默认值
const [x = 0, y = 0] = [10];
console.log(x, y); // 10 0

// 交换变量
let m = 1, n = 2;
[m, n] = [n, m];
console.log(m, n); // 2 1
```

&emsp;&emsp;**（2）对象解构**
```js
// 基本用法
const { name, age } = { name: '张三', age: 25 };
console.log(name, age); // 张三 25

// 重命名变量
const { name: userName, age: userAge } = { name: '李四', age: 30 };

// 嵌套解构
const user = {
    info: { address: { city: '北京' } },
    scores: [90, 85, 92]
};
const { info: { address: { city } }, scores: [first, ...others] } = user;
console.log(city, first, others); // 北京 90 [85, 92]

// 函数参数解构
function printUser({ name, age, gender = '未知' }) {
    console.log(`姓名：${name}，年龄：${age}，性别：${gender}`);
}
printUser({ name: '王五', age: 28 }); // 姓名：王五，年龄：28，性别：未知
```

&emsp;&emsp;**（3）实际应用场景**
```js
// 从模块导入解构
// import { Component, useState, useEffect } from 'react';

// 从函数返回值解构
function getPosition() {
    return { x: 100, y: 200, z: 300 };
}
const { x, y } = getPosition();

// 遍历时解构
const people = [
    { name: '甲', age: 20 },
    { name: '乙', age: 25 }
];
for (const { name, age } of people) {
    console.log(`${name}的年龄是${age}`);
}
```

---

## 4、扩展运算符与剩余参数

&emsp;&emsp;扩展运算符（`...`）和剩余参数（Rest Parameters）都使用`...`语法，但使用场景不同。

&emsp;&emsp;**（1）扩展运算符（用于展开）**
```js
// 数组合并
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2];
console.log(merged); // [1, 2, 3, 4, 5, 6]

// 数组拷贝（浅拷贝）
const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original); // [1, 2, 3]（原数组不变）
console.log(copy); // [1, 2, 3, 4]

// 对象扩展
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, ...obj1 };
console.log(obj2); // { c: 3, a: 1, b: 2 }

// 函数参数展开
const numbers = [3, 1, 4, 1, 5];
console.log(Math.max(...numbers)); // 5

// 字符串转数组
const str = 'hello';
const chars = [...str];
console.log(chars); // ['h', 'e', 'l', 'l', 'o']
```

&emsp;&emsp;**（2）剩余参数（用于收集）**
```js
// 收集剩余参数
function sum(...nums) {
    return nums.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

// 与解构配合
const [first, ...remaining] = [1, 2, 3, 4];
console.log(first, remaining); // 1 [2, 3, 4]

// 对象剩余属性
const { name, age, ...others } = { name: '张三', age: 25, city: '北京', job: '工程师' };
console.log(others); // { city: '北京', job: '工程师' }
```

---

## 5、函数默认值

&emsp;&emsp;ES6允许为函数参数设置默认值，使得函数调用更加灵活。

&emsp;&emsp;**（1）基本用法**
```js
function greet(name = '游客', message = '欢迎光临') {
    return `${name}，${message}！`;
}
console.log(greet()); // 游客，欢迎光临！
console.log(greet('张三')); // 张三，欢迎光临！
console.log(greet('李四', '早上好')); // 李四，早上好！
```

&emsp;&emsp;**（2）使用注意事项**
```js
// 注意：传入undefined会触发默认值，null不会
function test(a = '默认值') {
    console.log(a);
}
test(undefined); // 默认值
test(null); // null

// 可以在默认值中使用其他参数
function calculate(x, y = x * 2) {
    return x + y;
}
console.log(calculate(5)); // 15（5 + 10）
console.log(calculate(5, 3)); // 8

// 箭头函数默认值
const multiply = (a, b = a) => a * b;
console.log(multiply(3)); // 9
console.log(multiply(3, 4)); // 12
```

---

## 6、Symbol基本使用

&emsp;&emsp;Symbol是ES6引入的一种新的原始数据类型，表示唯一的标识符，常用于对象属性的键。

&emsp;&emsp;**（1）创建Symbol**
```js
// 创建Symbol
const sym1 = Symbol();
const sym2 = Symbol('description'); // 描述仅用于调试

console.log(sym1); // Symbol()
console.log(sym2); // Symbol(description)

// 相同描述的Symbol也不相等
const sym3 = Symbol('test');
const sym4 = Symbol('test');
console.log(sym3 === sym4); // false

// 全局Symbol注册表
const globalSym = Symbol.for('appKey');
const anotherGlobalSym = Symbol.for('appKey');
console.log(globalSym === anotherGlobalSym); // true
```

&emsp;&emsp;**（2）作为对象属性**
```js
const MY_KEY = Symbol();

const obj = {
    [MY_KEY]: '这是Symbol属性',
    normalKey: '普通属性'
};

// 获取Symbol属性
console.log(obj[MY_KEY]); // 这是Symbol属性
console.log(obj.MY_KEY); // undefined（点运算无法访问）

// Object.keys() 不包含Symbol属性
console.log(Object.keys(obj)); // ['normalKey']

// Object.getOwnPropertySymbols() 获取所有Symbol属性
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol()]
```

&emsp;&emsp;**（3）常用内置Symbol**
```js
// Symbol.iterator - 定义对象的默认迭代器
const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();
console.log(iterator.next()); // { value: 1, done: false }

// Symbol.toStringTag - 自定义对象类型标签
class MyArray {
    get [Symbol.toStringTag]() {
        return 'MyArray';
    }
}
const ma = new MyArray();
console.log(ma.toString()); // [object MyArray]

// Symbol.hasInstance - 自定义instanceof行为
class Even {
    static [Symbol.hasInstance](num) {
        return Number(num) % 2 === 0;
    }
}
console.log(4 instanceof Even); // true
console.log(5 instanceof Even); // false
```

---

## 中级进阶篇

## 7、Iterator迭代器与for...of循环

&emsp;&emsp;Iterator（迭代器）是一种接口，为各种数据结构提供统一的访问机制。`for...of`循环就是基于迭代器实现的。

&emsp;&emsp;**（1）迭代器协议**
```js
// 自定义迭代器
function createIterator(items) {
    let i = 0;
    return {
        next() {
            const done = i >= items.length;
            const value = done ? undefined : items[i++];
            return { value, done };
        }
    };
}

const iterator = createIterator([10, 20, 30]);
console.log(iterator.next()); // { value: 10, done: false }
console.log(iterator.next()); // { value: 20, done: false }
console.log(iterator.next()); // { value: 30, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

&emsp;&emsp;**（2）可迭代对象**
```js
// 原生可迭代对象：Array, String, Map, Set, NodeList, Arguments等
for (const item of [1, 2, 3]) {
    console.log(item); // 1, 2, 3
}

// 字符串迭代
for (const char of 'ABC') {
    console.log(char); // A, B, C
}

// 对象默认不可迭代
const person = { name: '张三', age: 25 };
// for (const item of person) {} // 报错

// 使对象可迭代
const iterableObj = {
    entries: [['name', '李四'], ['age', 30]],
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => {
                if (index < this.entries.length) {
                    const [key, value] = this.entries[index++];
                    return { value: { key, value }, done: false };
                }
                return { value: undefined, done: true };
            }
        };
    }
};

for (const { key, value } of iterableObj) {
    console.log(`${key}: ${value}`); // name: 李四, age: 30
}
```

&emsp;&emsp;**（3）迭代器辅助方法**
```js
// entries() - 键值对迭代
const fruits = ['苹果', '香蕉', '橙子'];
for (const [index, fruit] of fruits.entries()) {
    console.log(`${index}: ${fruit}`);
}

// keys() - 键迭代
for (const key of fruits.keys()) {
    console.log(key); // 0, 1, 2
}

// values() - 值迭代
for (const value of fruits.values()) {
    console.log(value); // 苹果, 香蕉, 橙子
}

// 使用展开运算符
const [...copied] = fruits; // 拷贝数组
```

---

## 8、Class类详解

&emsp;&emsp;ES6引入了Class（类）的概念，使得面向对象编程更加直观和简洁。

&emsp;&emsp;**（1）基本语法**
```js
class Person {
    // 构造函数
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    // 实例方法
    introduce() {
        return `我叫${this.name}，今年${this.age}岁`;
    }

    // 静态方法（属于类本身，不属于实例）
    static create(name, age) {
        return new Person(name, age);
    }

    // getter和setter
    get info() {
        return `${this.name}-${this.age}`;
    }

    set info(value) {
        const [name, age] = value.split('-');
        this.name = name;
        this.age = age;
    }
}

const person = new Person('张三', 25);
console.log(person.introduce()); // 我叫张三，今年25岁
console.log(person.info); // 张三-25
person.info = '李四-30';
console.log(person.name); // 李四

const p2 = Person.create('王五', 28);
console.log(p2.introduce()); // 我叫王五，今年28岁
```

&emsp;&emsp;**（2）类的继承**
```js
class Student extends Person {
    constructor(name, age, school, grade) {
        super(name, age); // 调用父类构造函数
        this.school = school;
        this.grade = grade;
    }

    // 方法重写
    introduce() {
        return `${super.introduce()}，就读于${this.school}，读${this.grade}年级`;
    }

    // 子类特有方法
    study(subject) {
        return `${this.name}正在学习${subject}`;
    }
}

const student = new Student('小明', 12, '第一中学', '初一');
console.log(student.introduce()); // 我叫小明，今年12岁，就读于第一中学，读初一年级
console.log(student.study('数学')); // 小明正在学习数学

// instanceof检查
console.log(student instanceof Student); // true
console.log(student instanceof Person); // true
```

&emsp;&emsp;**（3）私有字段和方法**
```js
class Counter {
    // 公共字段
    name = '计数器';

    // 私有字段（以#开头）
    #count = 0;
    #threshold;

    constructor(threshold = 10) {
        this.#threshold = threshold;
    }

    // 私有方法
    #validateInput(value) {
        return typeof value === 'number' && value > 0;
    }

    increment(amount = 1) {
        if (this.#validateInput(amount)) {
            this.#count += amount;
            if (this.#count >= this.#threshold) {
                this.#onThresholdReached();
            }
        }
    }

    #onThresholdReached() {
        console.log(`已到达阈值${this.#threshold}`);
    }

    getCount() {
        return this.#count;
    }
}

const counter = new Counter(5);
counter.increment(3);
console.log(counter.getCount()); // 3
// console.log(counter.#count); // 语法错误，无法外部访问
```

---

## 9、模块化（import与export）

&emsp;&emsp;ES6引入了模块化机制，使得JavaScript可以更好地组织代码，实现模块之间的导入导出。

&emsp;&emsp;**（1）导出方式**
```js
// 命名导出 - 导出单个内容
export const PI = 3.14159;
export function add(a, b) {
    return a + b;
}
export class Calculator {
    multiply(a, b) { return a * b; }
}

// 默认导出 - 每个模块只能有一个
const defaultValue = 100;
export default defaultValue;

// 批量导出
const name = 'ModuleA';
const version = '1.0.0';
export { name, version };
```

&emsp;&emsp;**（2）导入方式**
```js
// 导入命名导出
import { PI, add } from './math.js';
console.log(PI); // 3.14159
console.log(add(1, 2)); // 3

// 导入时重命名
import { PI as pi, add as sum } from './math.js';

// 导入所有命名导出
import * as math from './math.js';
console.log(math.PI); // 3.14159
console.log(math.add(1, 2)); // 3

// 导入默认导出
import defaultValue from './module.js';
// 或者
import defaultValue, { PI } from './module.js';

// 动态导入（返回Promise）
import('./module.js')
    .then(module => {
        module.doSomething();
    });
```

&emsp;&emsp;**（3）复合写法**
```js
// 导出和导入结合
export { name, age } from './user.js';
export { default } from './config.js';
```

---

## 10、数组扩展方法

&emsp;&emsp;ES6为Array对象添加了多个实用的扩展方法。

&emsp;&emsp;**（1）find()与findIndex()**
```js
const users = [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
    { id: 3, name: '王五' }
];

// find - 返回第一个满足条件的元素
const user = users.find(u => u.id === 2);
console.log(user); // { id: 2, name: '李四' }

// findIndex - 返回第一个满足条件的元素索引
const index = users.findIndex(u => u.name === '王五');
console.log(index); // 2

// 找不到时
const notFound = users.find(u => u.id === 999);
console.log(notFound); // undefined
```

&emsp;&emsp;**（2）includes()、some()与every()**
```js
const numbers = [1, 2, 3, 4, 5];

// includes - 检查是否包含指定值
console.log(numbers.includes(3)); // true
console.log(numbers.includes(10)); // false

// some - 检查是否有元素满足条件
const hasEven = numbers.some(n => n % 2 === 0);
console.log(hasEven); // true

// every - 检查是否所有元素都满足条件
const allPositive = numbers.every(n => n > 0);
console.log(allPositive); // true
```

&emsp;&emsp;**（3）reduce()高级用法**
```js
// 基本用法 - 求和
const nums = [1, 2, 3, 4, 5];
const total = nums.reduce((sum, n) => sum + n, 0);
console.log(total); // 15

// 统计元素出现次数
const fruits = ['苹果', '香蕉', '苹果', '橙子', '香蕉', '苹果'];
const count = fruits.reduce((acc, fruit) => {
    acc[fruit] = (acc[fruit] || 0) + 1;
    return acc;
}, {});
console.log(count); // { 苹果: 3, 香蕉: 2, 橙子: 1 }

// 扁平化数组
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, arr) => [...acc, ...arr], []);
console.log(flat); // [1, 2, 3, 4, 5, 6]

// 按条件分组
const products = [
    { name: '手机', category: '电子产品' },
    { name: '衣服', category: '服装' },
    { name: '电脑', category: '电子产品' }
];
const grouped = products.reduce((acc, product) => {
    const { category } = product;
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
}, {});
```

&emsp;&emsp;**（4）flat()与flatMap()**
```js
// flat - 扁平化数组（指定深度）
const deepArray = [1, [2, [3, [4]]]];
console.log(deepArray.flat()); // [1, 2, [3, [4]]]
console.log(deepArray.flat(2)); // [1, 2, 3, [4]]
console.log(deepArray.flat(Infinity)); // [1, 2, 3, 4]

// flatMap - 先映射后扁平
const words = ['hello', 'world'];
const letters = words.flatMap(word => word.split(''));
console.log(letters); // ['h', 'e', 'l', 'l', 'o', 'w', 'o', 'r', 'l', 'd']

// 与map对比
const doubled = words.map(word => word.split(''));
console.log(doubled); // [['h','e','l','l','o'], ['w','o','r','l','d']]
```

---

## 11、对象扩展

&emsp;&emsp;ES6为对象添加了许多便捷的新特性和方法。

&emsp;&emsp;**（1）属性简写与方法简写**
```js
// 属性简写
const name = '张三';
const age = 25;

// 传统写法
const person1 = { name: name, age: age };

// ES6简写
const person2 = { name, age };

// 方法简写
const calculator = {
    value: 0,
    add(n) { this.value += n; return this; },
    subtract(n) { this.value -= n; return this; },
    multiply(n) { this.value *= n; return this; }
};
calculator.add(10).multiply(2).subtract(5);
console.log(calculator.value); // 15
```

&emsp;&emsp;**（2）计算属性名**
```js
// 使用变量作为属性名
const prefix = 'user';
const suffix = 'Id';
const obj = {
    [prefix + suffix]: 1001,
    ['get' + 'Name']() { return '张三'; }
};
console.log(obj.userId); // 1001
console.log(obj.getName()); // 张三
```

&emsp;&emsp;**（3）Object新增方法**
```js
// Object.assign - 合并对象
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };
Object.assign(target, source1, source2);
console.log(target); // { a: 1, b: 2, c: 3 }

// Object.keys/values/entries
const obj = { a: 1, b: 2, c: 3 };
console.log(Object.keys(obj)); // ['a', 'b', 'c']
console.log(Object.values(obj)); // [1, 2, 3]
console.log(Object.entries(obj)); // [['a', 1], ['b', 2], ['c', 3]]

// Object.fromEntries - 将键值对数组转为对象
const entries = [['name', '张三'], ['age', 25]];
const person = Object.fromEntries(entries);
console.log(person); // { name: '张三', age: 25 }

// 配合Map使用
const map = new Map([['x', 10], ['y', 20]]);
const mapObj = Object.fromEntries(map);
console.log(mapObj); // { x: 10, y: 20 }

// Object.is - 更精确的相等比较
console.log(Object.is(NaN, NaN)); // true（与===不同，===返回false）
console.log(Object.is(+0, -0)); // false（与===不同，===返回true）
```

---

## 高级应用篇

## 12、Promise进阶用法

&emsp;&emsp;除了基本用法，Promise还有许多高级用法可以实现更复杂的异步控制。

&emsp;&emsp;**（1）Promise.all - 并行等待**
```js
// 同时发起多个请求，全部完成后获取结果
const promise1 = fetch('/api/user');
const promise2 = fetch('/api/config');
const promise3 = fetch('/api/permissions');

Promise.all([promise1, promise2, promise3])
    .then(([user, config, permissions]) => {
        console.log('所有数据加载完成', { user, config, permissions });
    })
    .catch(error => {
        console.error('任一请求失败', error);
    });

// 实际应用
const delay = (ms, value) => new Promise(resolve => setTimeout(() => resolve(value), ms));

Promise.all([
    delay(1000, '数据A'),
    delay(2000, '数据B'),
    delay(500, '数据C')
]).then(([a, b, c]) => {
    console.log(a, b, c); // 约2秒后输出：数据A 数据B 数据C
});
```

&emsp;&emsp;**（2）Promise.race - 竞速模式**
```js
// 返回最先完成（成功或失败）的Promise
const request1 = new Promise((_, reject) => setTimeout(() => reject('请求1超时'), 5000));
const request2 = fetch('/api/fast-data').catch(() => '使用缓存数据');

Promise.race([request1, request2])
    .then(result => console.log('获得结果：', result))
    .catch(error => console.error('请求失败：', error));

// 超时控制实际应用
function fetchWithTimeout(url, timeout = 3000) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) => setTimeout(() => reject(new Error('请求超时')), timeout))
    ]);
}
```

&emsp;&emsp;**（3）Promise.allSettled - 所有结果**
```js
// 等待所有Promise完成，无论成功或失败
const promises = [
    Promise.resolve('成功1'),
    Promise.reject('失败1'),
    Promise.resolve('成功2')
];

Promise.allSettled(promises).then(results => {
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`Promise ${index}: ${result.value}`);
        } else {
            console.log(`Promise ${index}: ${result.reason}`);
        }
    });
});
// 输出：
// Promise 0: 成功1
// Promise 1: 失败1
// Promise 2: 成功2
```

&emsp;&emsp;**（4）Promise.any - 任一成功**
```js
// 返回第一个成功的Promise（全失败则返回AggregateError
const promises = [
    Promise.reject('失败1'),
    Promise.reject('失败2'),
    Promise.resolve('成功')
];

Promise.any(promises)
    .then(result => console.log(result)) // 成功
    .catch(error => console.error(error.errors)); // ['失败1', '失败2']
```

&emsp;&emsp;**（5）链式调用进阶**
```js
// 返回值影响下一个then
Promise.resolve(1)
    .then(x => x + 1)      // 返回 2
    .then(x => x + 2)      // 返回 4
    .then(x => { throw new Error('错误') })
    .catch(e => -1)        // 返回 -1
    .then(x => x + 10)     // 返回 9
    .then(console.log);    // 输出 9
```

---

## 13、Proxy与Reflect

&emsp;&emsp;Proxy用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等），Reflect是ES6新增的操作对象的API。

&emsp;&emsp;**（1）Proxy基本用法**
```js
// Proxy接收两个参数：目标对象和处理函数
const target = { name: '张三', age: 25 };

const proxy = new Proxy(target, {
    // get拦截属性读取
    get(target, property, receiver) {
        console.log(`读取属性：${property}`);
        return target[property];
    },
    // set拦截属性设置
    set(target, property, value, receiver) {
        console.log(`设置属性：${property} = ${value}`);
        if (property === 'age' && value < 0) {
            console.log('年龄不能为负数');
            return false;
        }
        target[property] = value;
        return true;
    },
    // has拦截in操作符
    has(target, property) {
        console.log(`检查属性：${property}`);
        return property in target;
    }
});

console.log(proxy.name);      // 读取属性：name，张三
proxy.age = 30;               // 设置属性：age = 30
console.log('name' in proxy); // 检查属性：name，true
```

&emsp;&emsp;**（2）Proxy应用场景**
```js
// 数据验证
function createValidated(target, schema) {
    return new Proxy(target, {
        set(target, property, value) {
            const validator = schema[property];
            if (validator && !validator(value)) {
                throw new TypeError(`属性${property}的值不合法`);
            }
            target[property] = value;
            return true;
        }
    });
}

const user = createValidated({}, {
    name: v => typeof v === 'string' && v.length > 0,
    age: v => typeof v === 'number' && v >= 0 && v <= 150
});

user.name = '张三'; // 成功
user.age = 25;      // 成功
// user.age = -5;    // 抛出异常

// 私有属性保护
function createPrivate(obj) {
    return new Proxy(obj, {
        get(target, prop) {
            if (prop.startsWith('_')) {
                throw new Error('私有属性不可访问');
            }
            return target[prop];
        },
        set(target, prop, value) {
            if (prop.startsWith('_')) {
                throw new Error('私有属性不可修改');
            }
            target[prop] = value;
            return true;
        }
    });
}
```

&emsp;&emsp;**（3）Reflect使用**
```js
// Reflect提供操作对象的方法，与Proxy配合使用
const obj = { x: 1, y: 2 };

// Reflect.get/set
console.log(Reflect.get(obj, 'x')); // 1
Reflect.set(obj, 'z', 3);
console.log(obj.z); // 3

// Reflect.has
console.log(Reflect.has(obj, 'x')); // true

// Reflect.deleteProperty
console.log(Reflect.deleteProperty(obj, 'y')); // true

// Reflect.ownKeys
console.log(Reflect.ownKeys(obj)); // ['x', 'z']

// Reflect.apply - 更规范的函数调用
function greet(greeting, name) {
    return `${greeting}, ${name}!`;
}
const result = Reflect.apply(greet, null, ['你好', '张三']);
console.log(result); // 你好, 张三!

// 构造函数
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}
const person = Reflect.construct(Person, ['李四', 30]);
```

---

## 14、BigInt数据类型

&emsp;&emsp;BigInt是ES2020引入的新的原始数据类型，用于表示任意大小的整数。

&emsp;&emsp;**（1）基本用法**
```js
// 创建BigInt - 在数字后面加n
const bigNumber = 9007199254740991n; // 超过Number安全整数范围
const anotherBig = BigInt(9007199254740991);

// BigInt运算
const a = 123456789012345678901234567890n;
const b = 987654321098765432109876543210n;
console.log(a + b); // 1111111110111111110111111111100n

// 不能与普通数字混合运算
// console.log(a + 1); // 报错
console.log(a + 1n); // 正确

// 除法会截断小数部分
console.log(7n / 2n); // 3n
```

&emsp;&emsp;**（2）类型转换**
```js
// Number转BigInt
const num = 100;
const big = BigInt(num);
console.log(big); // 100n

// BigInt转Number（可能丢失精度）
const bigNum = 9007199254740993n;
console.log(Number(bigNum)); // 9007199254740992（精度丢失）

// 字符串转换
const big = 12345678901234567890n;
console.log(big.toString()); // 12345678901234567890
console.log(big.toString(2)); // 二进制
console.log(BigInt.prototype.toLocaleString); // 支持本地化格式化
```

&emsp;&emsp;**（3）实际应用**
```js
// 大数计算
function calculateFactorial(n) {
    let result = 1n;
    for (let i = 2n; i <= BigInt(n); i++) {
        result *= i;
    }
    return result;
}
console.log(calculateFactorial(50)); // 30414093201713378043612608166064768844377641568960512000000000000n

// 处理大数ID（数据库主键等）
const largeId = 9007199254740993n;
console.log(`ID: ${largeId}`);
```

---

## 15、可选链与空值合并

&emsp;&emsp;ES2020引入了可选链操作符（`?.`），ES2021引入了空值合并操作符（`??`）。

&emsp;&emsp;**（1）可选链操作符**
```js
// 传统写法
const city = user && user.address && user.address.city;

// 可选链写法
const city = user?.address?.city;

// 数组和函数也可使用
const firstItem = arr?.[0];
const result = obj.method?.();

// 方法调用不存在时返回undefined
const doesNotExist = null;
console.log(doesNotExist?.foo); // undefined
console.log(doesNotExist?.()); // undefined

// 实际应用 - 安全获取深层属性
const config = {
    database: {
        connection: {
            host: 'localhost',
            port: 3306
        }
    }
};

const port = config?.database?.connection?.port ?? 5432;
console.log(port); // 3306

const timeout = config?.cache?.timeout ?? 5000;
console.log(timeout); // 5000（使用默认值）
```

&emsp;&emsp;**（2）空值合并操作符**
```js
// ?? 只有值为 null 或 undefined 时才使用默认值
const a = null ?? 'default';      // 'default'
const b = undefined ?? 'default'; // 'default'
const c = 0 ?? 'default';         // 0（0是有效值）
const d = '' ?? 'default';        // ''（空字符串是有效值）
const e = false ?? 'default';     // false（false是有效值）

// || 的问题：会把0、''、false也视为假值
const count = 0;
console.log(count || 10);   // 10（错误，0是有效值）
console.log(count ?? 10);   // 0（正确）

// 组合使用
const obj = { count: 0, message: '' };
const result = obj.count ?? 10;      // 0
const msg = obj.message ?? '无消息'; // ''（空字符串是有效值）
```

---

## 16、装饰器Decorator（ES规范阶段3）

&emsp;&emsp;装饰器是一种在不修改原类的情况下，为类或类的成员添加功能的语法。

&emsp;&emsp;**（1）基本概念**
```js
// 类装饰器
function sealed(target) {
    Object.seal(target);
    target.prototype.status = 'sealed';
}

// 装饰器工厂函数
function logger(message) {
    return function(target) {
        console.log(`${message}: ${target.name}`);
    };
}

@logger('装饰类')
class MyClass {
    @readonly
    PI = 3.14159;

    @deprecated
    oldMethod() {
        console.log('这是一个已废弃的方法');
    }
}

// 方法装饰器
function readonly(target, name, descriptor) {
    descriptor.writable = false;
    return descriptor;
}

// 属性装饰器
function deprecated(target, name) {
    const original = target[name];
    target[name] = function(...args) {
        console.warn(`警告：${name}方法已废弃`);
        return original.apply(this, args);
    };
}
```

---

## 原有面试题篇


## 17、对于Babel的了解？
&emsp;&emsp;Babel是一个广泛的ES6转码器，其主要作用就是将ES6代码转换为ES5代码，从而可以在老版本的浏览器中执行，以至于又不用担心现有环境是否支持ES6语法；
```js
//安装方式
npm install --save-dev @babel/core
//Babel转换原理：箭头函数
input.map(item => item + 1)
// 转码后
input.map(function (item) {
  return item + 1;
});
```
Babel 的配置文件是.babelrc，存放于项目的根目录下

---

## 18、Map和Set是什么如何使用？
**（1）Map（字典）**  
&emsp;&emsp;① 定义 ：Map是一种类对象数据结构，可以保存键值对，并且能够记住键的原始插入顺序，任何对象或者原始值都可以作为一个键或值；Map的键不可重复也不可以修改，但值可以修改；（关键字：顺序存储、任意类型的键、键唯一）  
&emsp;&emsp;② 使用 ：  
```js
let defaultMap = new Map([['name', '张三'], ['age', 20]])
```
&emsp;&emsp;③ 常用方法 ：set() 、delete()、has()   
**（2）Set（集合）**  
&emsp;&emsp;① 定义 ：Set与Map类似，但它是一个类数组对象，允许存储任意类型的唯一值，即存储的值不重复，因此常用来做去重处理，但非键值对模式存储；Set对象只能通过迭代器来修改值；（关键字：数组形式、唯一不重复）  
&emsp;&emsp;② 使用 ：  
```js
let defaultSet = new Set(['张三', 12, true])
//数组去重处理
const newarr = Object.assign(...Set(arr));
```
&emsp;&emsp;③ 常用方法 ：add() 、delete()、has()

---

## 19、介绍一下Promise
&emsp;&emsp;Promise 是一种编程结构，用于处理异步操作。它允许开发者以更清晰、更简单和更优雅的方式处理异步操作，从而避免回调地狱的问题。以下是 Promise 的一些核心特点和用法：

&emsp;&emsp;**定义与状态:** Promise 有三种状态p`ending（等待中）`、`fulfilled（已完成）`和 `rejected（已拒绝）`

&emsp;&emsp;**基本用法:** 使用 `then()`, `catch()`, 和 `finally()` 方法来处理 Promise 的成功、失败和最终处理。
- `then()` 方法用于注册成功和失败状态的回调函数。
- `catch()` 方法用于捕获并处理 Promise 的失败状态。
- `finally()` 方法无论 Promise 是成功还是失败，都会执行。

---

## 20、Promise和回调函数有何不同
&emsp;&emsp;从基本概念上来看，回调函数是一种将函数作为参数传递给另一个函数的方式，当外部函数完成某项任务后，会调用这个回调函数；而Promise是一个代表了异步操作最终完成或失败及其结果值的对象，Promise通过`.then()`链式调用来组织异步代码，可以有效避免回调地狱；  
```js
// Promise创建
  const myPromise = new Promise((resolve, reject) => {
      // 异步操作
      const success = true; // 模拟操作成功或失败
      if (success) {
          resolve('操作成功');
      } else {
          reject('操作失败');
      }
  });
//Promise回调
   myPromise.then(result => {
          console.log(result); // 输出: 操作成功
      })
      .catch(error => {
          console.error(error); // 输出: 操作失败
      });
```

---

## 21、Async和Await的了解
&emsp;&emsp;Async/Await是一种基于Generate生成器的语法糖，它可以使异步操作代码更加简洁可读，在JavaScript中，Async函数返回一个Promise对象，并且在函数内部使用了Generate生成器的特性来实现暂停和恢复。

&emsp;&emsp;Await操作符用于等待一个Promise对象的解决，并且只能在Async函数内部使用。当在Async函数中使用Await操作符时，实际上是在告诉JavaScript引擎在这里暂停执行，直到后面的Promise对象被解决。这种暂停和恢复的机制正是基于生成器实现的。

---

## 22、如何手写Async和Await
&emsp;&emsp;在实现 `async` 和 `await` 之前，我们需要理解 `Promise`。`Promise` 是一个表示异步操作最终完成（或失败）及其结果值的对象。
```js
//MyPromise 函数实现了基本的 Promise 功能，包括 resolve 和 reject 方法。
// 使用闭包来存储状态和回调函数。
function MyPromise(executor){
  let onResolve;
  let onReject;
  let isResolved = false;
  let isRejected = false;
  let resolvedValue;
  let rejectedValue;
  // then()函数进行状态判断并赋值
  this.then = function (onFulfilled, onRejectedCallback) {
    onResolve = onFulfilled;
    onReject = onRejectedCallback;

    if(isResolved) {
      onResolve(resolvedValue);
    }
    if(isRejected){
      onReject(rejectedValue)
    }
  }
  //resolve函数声明
  const resolve = (value) => {
    isResolved = true;
    resolvedValue = value;
     if(onResolve) {
      onResolve(resolvedValue);
    }
  }
  //reject函数声明
    const reject = (value) => {
    isRejected = true;
    rejectedValue = value;
     if(onReject) {
      onRejected(rejectedValue);
    }
  }
  //excutor函数调用
  executor(resolve, reject);
}
```
&emsp;&emsp;实现关键：自定义async和await实现
&emsp;&emsp;&emsp;
```js
function async(generatorFunction){
  return function (...args) {
    //async 函数接受一个生成器函数，并返回一个新的 Promise，处理生成器的执行。
    const generator = generatorFunction(...args);
    return MyPromise((resolve, reject) => {
      //handle 函数用于处理生成器的每一步，检查是否完成（done），如果没有完成，则等待 Promise 的结果。
      function handle(result) {
          if (result.done) {
            return resolve(result.value);
        }
        // 处理 Promise
        Promise.resolve(result.value)
            .then(res => handle(generator.next(res))) // 将 Promise 的结果传递给生成器
            .catch(err => reject(err)); // 捕获错误
      }
      handle(generator.next()); // 启动生成器
    })
  }
}
  // 使用示例
  //myAsyncFunction 是一个使用 async 和 await 的示例，模拟了两个异步操作，每个操作延迟 1 秒后返回结果。
  const myAsyncFunction = async(function* () {
      const result1 = yield new MyPromise((resolve) => setTimeout(() => resolve('Result 1'), 1000));
      document.getElementById('output').innerHTML += `<p>${result1}</p>`; // 输出 "Result 1"
      const result2 = yield new MyPromise((resolve) => setTimeout(() => resolve('Result 2'), 1000));
      document.getElementById('output').innerHTML += `<p>${result2}</p>`; // 输出 "Result 2"
  });
  // 执行 async 函数
  myAsyncFunction();
```

---

## 23、箭头函数是什么，与普通函数有何区别
&emsp;&emsp;箭头函数（Arrow Functions）是JavaScript ES6引入的一种简洁的函数语法，它允许开发者以更直观和高效的方式编写函数。以下是箭头函数与普通函数的主要区别：

&emsp;&emsp;**① this指向：** 箭头函数的this指向始终是定义时的上下文对象，而普通函		数的this指向会根据调用方式发生变化；

&emsp;&emsp;**② arguments对象：** 箭头函数中没有arguments对象，而普通函数中则		可以通过arguments对象访问函数的参数列表；

&emsp;&emsp;**③ 构造函数：** 箭头函数不能作为构造函数使用，而普通函数则可以；

&emsp;&emsp;**④ prototype属性函数：** 箭头函数没有prototype属性，而普通函数可以通过prototype属性为函数添加方法；

---

## 24、ES6中的Generator生成器是什么？开发中如何使用
&emsp;&emsp;Generator生成器是ES6提出的一种异步编程解决方案，Generator生成器有两个特征。一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yield表达式，定义不同的内部状态;Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行，需要每次都调用next()来执行，每次遍历从上到下或上一次终止的地方执行遇到yield便会终止
```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

---

## 25、Generator进阶：yield*与异步迭代

&emsp;&emsp;**（1）yield*委托迭代**
```js
// yield* 可以委托给另一个迭代器
function* inner() {
    yield 'A';
    yield 'B';
}

function* outer() {
    yield '1';
    yield* inner(); // 委托给inner迭代器
    yield '2';
}

const iter = outer();
console.log([...iter]); // ['1', 'A', 'B', '2']

// 实际应用：二叉树遍历
function* createTree(node) {
    if (node) {
        yield* createTree(node.left);
        yield node.value;
        yield* createTree(node.right);
    }
}
```

&emsp;&emsp;**（2）next()传值机制**
```js
function* calculator() {
    const first = yield 1; // 第一个next()传入的值被忽略
    const second = yield first + 2;
    return first + second;
}

const calc = calculator();
console.log(calc.next().value);   // 1（暂停在第一个yield）
console.log(calc.next(10).value);  // 12（10赋值给first）
console.log(calc.next(20).value);   // 30（10+20）
```

&emsp;&emsp;**（3）Generator错误处理**
```js
function* errorGenerator() {
    try {
        yield '操作1';
        yield '操作2';
    } catch (e) {
        console.log('捕获错误：', e);
        yield '错误恢复';
    }
    yield '继续执行';
}

const gen = errorGenerator();
console.log(gen.next().value);     // 操作1
gen.throw(new Error('出错了'));     // 捕获错误：出错了
console.log(gen.next().value);     // 错误恢复
console.log(gen.next().value);     // 继续执行
```

---

## 26、WeakMap、WeakSet与WeakRef

&emsp;&emsp;这些弱引用数据结构在内存管理中非常有用，可以避免内存泄漏。

&emsp;&emsp;**（1）WeakMap特性**
```js
// WeakMap的键只能是对象，不能是原始值
const wm = new WeakMap();
const obj = { name: '测试' };
wm.set(obj, 'associated value');
console.log(wm.get(obj)); // associated value

// 特点：键对象没有其他引用时，会被垃圾回收
// WeakMap不可遍历，没有size属性
// 用途：存储对象私有数据
const privateData = new WeakMap();

class User {
    constructor(name, password) {
        privateData.set(this, { name, password });
    }

    getName() {
        return privateData.get(this).name;
    }
}

// 对象被删除后，WeakMap中的数据也会自动消失
```

&emsp;&emsp;**（2）WeakSet特性**
```js
// WeakSet的元素必须是对象
const ws = new WeakSet();
const obj1 = { id: 1 };
const obj2 = { id: 2 };

ws.add(obj1).add(obj2);
console.log(ws.has(obj1)); // true
ws.delete(obj1);
console.log(ws.has(obj1)); // false

// 用途：追踪对象状态
const activeUsers = new WeakSet();

function login(user) {
    activeUsers.add(user);
}

function logout(user) {
    activeUsers.delete(user);
}

function isOnline(user) {
    return activeUsers.has(user);
}
```

---

## 27、尾调用优化

&emsp;&emsp;尾调用优化（Tail Call Optimization，TCO）是一种优化技术，可以避免函数调用栈的无限增长。

&emsp;&emsp;**（1）什么是尾调用**
```js
// 尾调用：函数最后一步是调用另一个函数
function f(x) {
    return g(x); // 尾调用
}

// 非尾调用：返回前需要做计算
function f(x) {
    return g(x) + 1; // 不是尾调用
}

// 非尾调用：需要访问外部变量
function f(x) {
    const result = g(x);
    return result; // 不是尾调用
}
```

&emsp;&emsp;**（2）尾递归优化**
```js
// 普通递归：会导致栈溢出
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
console.log(factorial(10000)); // 栈溢出

// 尾递归优化：保持调用栈在同一层级
function factorialTail(n, acc = 1) {
    if (n <= 1) return acc;
    return factorialTail(n - 1, n * acc);
}
console.log(factorialTail(10000)); // 不会栈溢出（如果引擎支持）
```

---

## 28、Proxy高级应用

&emsp;&emsp;**（1）实现响应式系统**
```js
// Vue3响应式原理简化版
function reactive(obj, onChange) {
    return new Proxy(obj, {
        get(target, property, receiver) {
            const value = Reflect.get(target, property);
            // 如果是对象，递归代理
            if (value !== null && typeof value === 'object') {
                return reactive(value, onChange);
            }
            return value;
        },
        set(target, property, value, receiver) {
            const oldValue = target[property];
            const result = Reflect.set(target, property, value);
            if (result && oldValue !== value) {
                onChange(property, value, oldValue);
            }
            return result;
        }
    });
}

const state = reactive(
    { user: { name: '张三', age: 25 }, count: 0 },
    (prop, newVal, oldVal) => {
        console.log(`${prop}从${oldVal}变为${newVal}`);
    }
);

state.count = 10;       // count从0变为10
state.user.age = 26;   // age从25变为26
```

&emsp;&emsp;**（2）实现函数拦截**
```js
function makeDebounced(fn, delay) {
    return new Proxy(fn, {
        apply(target, thisArg, args) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    target.apply(thisArg, args);
                }, delay);
            };
        }
    });
}

const debouncedLog = makeDebounced(console.log, 1000);
debouncedLog('快速调用1');
debouncedLog('快速调用2');
// 只会输出：快速调用2（1秒后）
```

---

## 29、Symbol的高阶应用

&emsp;&emsp;**（1）Symbol.match与正则匹配**
```js
// 自定义对象作为正则表达式
const Validator = {
    [Symbol.match](str) {
        const isValid = /^[a-zA-Z]+$/.test(str);
        return isValid ? [str] : null;
    }
};

console.log('hello'.match(Validator)); // ['hello']
console.log('123'.match(Validator));   // null

// Symbol.split自定义分割行为
const Reverser = {
    [Symbol.split](str) {
        return str.split('').reverse().join('');
    }
};

console.log('hello'.split(Reverser)); // 'olleh'
```

&emsp;&emsp;**（2）Symbol.replace自定义替换**
```js
const ReplaceWrapper = {
    [Symbol.replace](str, replacement) {
        return `[${str} -> ${replacement}]`;
    }
};

console.log('hello'.replace(ReplaceWrapper, 'world')); // [hello -> world]
```

---

## 30、ES6模块化深入理解

&emsp;&emsp;**（1）循环导入处理**
```js
// a.js
import { b } from './b.js';
export const a = 'module A';
export function getB() { return b; }

// b.js
import { a } from './a.js';
export const b = 'module B';
export function getA() { return a; }

// 正确使用：在函数内部导入
export function useA() {
    const { a } = require('./a.js');
    return a;
}
```

&emsp;&emsp;**（2）动态导入实战**
```js
// 按需加载大型模块
async function loadFeature() {
    if (needsAdvancedFeature()) {
        const { advancedFeature } = await import('./advanced.js');
        advancedFeature();
    }
}

// 条件导入不同实现
async function loadParser() {
    if (isMobile) {
        const { LightParser } = await import('./parser-light.js');
        return new LightParser();
    } else {
        const { FullParser } = await import('./parser-full.js');
        return new FullParser();
    }
}
```

---

## 31、Set和Map的进阶用法

&emsp;&emsp;**（1）Map的迭代与转换**
```js
const map = new Map([
    ['name', '张三'],
    ['age', 25],
    ['city', '北京']
]);

// 转数组
const arr1 = [...map];              // [['name', '张三'], ...]
const arr2 = Array.from(map);

// 转对象
const obj = Object.fromEntries(map);
console.log(obj); // { name: '张三', age: 25, city: '北京' }

// Map反转（键值互换）
const reversedMap = new Map([...map].map(([k, v]) => [v, k]));
```

&emsp;&emsp;**（2）Set的数学运算**
```js
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// 并集
const union = new Set([...setA, ...setB]);
console.log([...union]); // [1, 2, 3, 4, 5, 6]

// 交集
const intersection = new Set([...setA].filter(x => setB.has(x)));
console.log([...intersection]); // [3, 4]

// 差集（A中有B中没有）
const difference = new Set([...setA].filter(x => !setB.has(x)));
console.log([...difference]); // [1, 2]
```

---

## 32、Promise与异步错误处理最佳实践

&emsp;&emsp;**（1）统一错误处理**
```js
// 错误处理中间件模式
async function handleAsync(fn) {
    try {
        const result = await fn();
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

const [userResult, configResult] = await Promise.all([
    handleAsync(() => fetchUser()),
    handleAsync(() => fetchConfig())
]);
```

&emsp;&emsp;**（2）重试机制**
```js
async function retry(fn, maxAttempts = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxAttempts) throw error;
            console.log(`第${attempt}次失败，${delay}ms后重试...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

// 使用
const data = await retry(() => fetchData(), 3, 2000);
```

&emsp;&emsp;**（3）并发限制**
```js
async function parallelLimit(tasks, limit = 5) {
    const results = [];
    const executing = new Set();

    for (const task of tasks) {
        const promise = task().then(result => {
            executing.delete(promise);
            return result;
        });

        results.push(promise);
        executing.add(promise);

        if (executing.size >= limit) {
            await Promise.race(executing);
        }
    }

    return Promise.all(results);
}

// 限制同时只有5个请求
const urls = Array(100).fill('/api/item');
const limitedFetch = parallelLimit(
    urls.map(url => () => fetch(url)),
    5
);
```
