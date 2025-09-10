# 泛型
### 入门基础
*泛型的使用可以理解为组件的使用，使用泛型来创建可重用的组件，使用时再定义具体类型，一个组件可以支持多种类型的数据，为大型复杂系统提供了十分灵活的功能。*

```ts
function identity<T>(arg: T): T {
    return arg;
}
let output = identity<string>('Hello World!');
let output = identuty('Hello World!'); // ✔ 推荐：自动推导类型
// T用于捕获使用时传入的类型
// 泛型的类型与any不同，使用any会丢失具体的类型信息
```

### 泛型变量
*异常场景：在泛型函数中预先操作某些数据类型的方法时会提示异常，如获取数组长度：*
```ts
function getLength<T>(arg: T): number {
    console.log(arg.length);  // ❌ 错误：T类型不一定有length属性
    return arg.length;
}
```
*泛型变量允许我们创建灵活且类型安全的函数，但需要注意编译器无法确认任意泛型类型的具体属性。处理数组类型时，可以通过 `T[]`或 `Array<T>` 语法解决，因为这些类型已知包含 `length` 属性。*
```ts
// 方式一：使用T[]语法
function logArray<T>(arr: T[]): T[] {
    console.log(arr.length)
    return arr;
}
// 方式2：使用Array<T>语法（效果相同）
function logArray2<T>(arr: Array<T>): Array<T> {
    console.log(arr.length);
    return arr;
}
// 使用示例
logArray1([1, 2, 3]);       // 推断为number[]
logArray2(["a", "b", "c"]); // 推断为string[]
```
*更复杂的场景可以使用 `extends` 约束泛型类型，确保类型参数满足特定接口要求，从而实现更精确的类型控制。*
```ts
interface Lengthwise {
    length: number;
}
function getLengthSafe<T extend Lengthwise>(arg: T): number {
    console.log(arg.length);
    return arg.length;
}
// 使用示例
getLengthSafe("hello"); // string有length属性
getLengthSafe([1,2,3]); // 数组有length属性
getLengthSafe({length: 5, name: 'test'}); // 自定义对象
// getLengthSafe(123); // ❌ 数字没有length属性
```

### 泛型函数&泛型接口
*泛型接口的衍生可以参考泛型类型函数的使用，在使用泛型函数时可以使用不同的泛型参数名：如T可以变为U，只要数量及使用方式上对应即可，或者使用带有签名的对象字面量等；*
```ts
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: <U>(arg: U) => U = identity;

// 三种等效的泛型函数类型声明方式
let fn1: <T>(arg: T) => T = identity;        // 箭头函数形式
let fn2: { <T>(arg: T): T } = identity;      // 对象字面量形式
type FnType<T> = (arg: T) => T;              // 类型别名形式

```
*在使用对象字面量定义时可以将其提取出来为一个接口；泛型接口通常有方法级别和接口级别两种；*
```ts
// 方法级别泛型接口
interface GenericIdentityFn {
    <T>(arg: T): T;
}
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: GenericIdentityFn = identity;

// 接口级别泛型接口
interface SprcificFn<T> {
    (arg: T): T;
}
const numFn: SpecificFn<number> = identity;
numFn(42);    // 正确
// numFn("hi"); // 错误：类型不匹配
```

### 泛型类
*泛型类又与泛型接口查差不多在类名后面以及属性方法后带上对应的泛型变量*
```ts
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```
与接口一样，直接把泛型类型放在类后面，可以帮助我们确认类的所有属性都在使用相同类型;

### 泛型约束
*泛型约束通过关键字`extends`让泛型具具备更强的类型安全性,主要作用包括确保类型具备特定能力,限制类型范围,安全访问对象属性等等;*

| 约束类型 | 语法示例 | 作用场景 |
|---------|---------|---------|
| 属性约束 | `T extends { prop: type }` | 确保类型具有特定属性 |
| 联合约束 | `T extends A | B` | 限制类型在指定范围内 |
| 键名约束 | `K extends keyof T` | 安全访问对象属性 |
| 值类型约束 | `T[K] extends type` | 确保属性值为特定类型 |
| 构造约束 | `C extends new (...args) => T` | 类型安全的实例创建 |

```ts
// 多类型参数约束
// 确保key是obj的合法属性
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { name: "Alice", age: 30 };

getValue(user, "age");  // 正确
// getValue(user, "email"); // 报错："email"不是user的属性

```