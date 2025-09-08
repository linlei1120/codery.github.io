# Interface 接口
### 1、简介
*接口是 TypeScript 的核心特性，它就像是代码的合同或类型契约，定义了对象应该具有的结构和能力。接口的使用可以提高类型的安全、代码可读性以及代码复用性等。*
```ts
// 未使用interface
const update = ({id: string, name: string, age: number, isVIP: boolean}): void => {}
// 使用interfce: 可以用于变量定义，函数传参等多种场景
interface Person {
    id: string;
    name: string;
    readonly age: number; //只读属性
    isVIP?: boolean; //可选属性
}

// 只读属性赋值会报异常
let p1: Person = {id: '123', name: 'Tom', age:18, isVIP:true}
p1.age = 20 //error
const updatePerson = (p: Person): void => {
    // 函数体实现
    console.log(`更新用户: ${p.name}, 年龄: ${p.age}`);
}
```
**注意：** 类型检查器不会去检查类型顺序，只需要对应类型的数据存在即可

### 2、额外类型检查
*TS中的额外类型检查是一种严格的类型守卫，在传递对象字面量给函数时，它会检查对象属性、接口定义、以及出现未定义属性时，会抛出异常；这种方式可以防止拼写错误、传参丢失等等；*
```ts
// 额外类型检查
interface ListConfig {
    name?: string;
    age?: number
}

const list = (l: ListConfig) => {
    console.log(l.name, l.age);
}

// 这会报错：'gender' not expected in type 'ListConfig'
list({name:'Tom', gender: '男'}) // ❌ 编译错误
```
##### 绕过检查的方法通常有：`类型断言as`、`添加签名索引`

```ts
// 方法1：类型断言 - 强制告诉TS这个对象符合ListConfig类型
list({name:'Tom', gender: '男'} as ListConfig) // ✅ 绕过检查

// 方法2：添加索引签名 - 允许任意额外属性
interface ListConfigWithIndex {
    name?: string;
    age?: number;
    [propName: string]: any; // 索引签名：允许任意字符串键
}

const listWithIndex = (l: ListConfigWithIndex) => {
    console.log(l.name, l.age);
}
listWithIndex({name:'Tom', gender: '男'}) // ✅ 不会报错

// 方法3：使用变量赋值（推荐）
const config = {name:'Tom', gender: '男'};
list(config); // ✅ 不会报错，因为TS只对对象字面量进行额外检查
```
### 3、函数类型接口

*使用接口直接定义函数类型，可以扩展函数的传参类型以及返回值类型等；参数名不重要，位置和类型重要；函数类型接口是大型项目中保持代码一致性的利器.*

```ts
interface SearchFunc {
    (source: string, subStrinf: string): boolean;
}
// 接口函数类型使用
let mySearch = SearchFunc;
mySearch = function(src, sub) {
    let result = src.search(sub);
    return result > -1;
}
```

### 4、索引类型
*索引类型可以预先规定类型，然后使用索引值获取对应的返回值，类似一个收纳盒，先规定索引类型，类似收纳盒标签，再规定返回值类型，即指定盒子只能存放指定物品；*
```ts
interface BOX {
    [index: number]: string;
}
let myBox: Box;
myBox = ["Bob", "Tom"];

let myName: string = myBox[0]; //Bob

interface Color {
  [colorName: string]: string;
}
const colorBox: Color = {
  masterColor: "#1890ff",
  waringColor: "#f5222d"
};

let waringColor: string = colorBox[1];
```

**索引类型接口可以定义灵活的字典结构、自定义类数组对象以及限制动态属性的类型；**

### 5、类类型接口

##### (1) 类与接口相结合，类似于约定一个功能需求清单，清单内制定了具体属性类型，函数类型等，可以让不同的类能统一标准、互换使用、常用于大型的项目架构设计。类类型接口的重要特性：只检查公共部分，不关心私有成员，且方法必须实现。
```ts
interface Developer {
    readonly id: string;          // 只读标识
    name: string;
    skills?: string[];            // 可选属性
    coding(lang: string): number; // 返回本次编码的行数（示例）
    introduce(): string;          // 自我介绍
}

class FrontendDev implements Developer {
    readonly id: string;
    name: string;
    skills?: string[];

    // 私有成员不参与接口检查
    private framework: string = 'Vue';

    constructor(id: string, name: string, skills?: string[]) {
        this.id = id;
        this.name = name;
        this.skills = skills;
    }

    coding(lang: string): number {
        console.log(`${this.name} 使用 ${lang}/${this.framework} 开发前端功能`);
        return 300;
    }

    introduce(): string {
        return `Hi，我是前端工程师 ${this.name}`;
    }
}

class BackendDev implements Developer {
    readonly id: string;
    name: string;
    skills?: string[];

    // 受保护成员同样不影响接口匹配
    protected runtime: string = 'Node.js';

    constructor(id: string, name: string, skills?: string[]) {
        this.id = id;
        this.name = name;
        this.skills = skills;
    }

    coding(lang: string): number {
        console.log(`${this.name} 使用 ${lang}/${this.runtime} 编写后端服务`);
        return 500;
    }

    introduce(): string {
        return `Hi，我是后端工程师 ${this.name}`;
    }
}

// 简单工厂：根据类型创建不同实现，体现接口与实现解耦
type DevKind = 'fe' | 'be';
function createDeveloper(kind: DevKind, id: string, name: string, skills?: string[]): Developer {
    if (kind === 'fe') return new FrontendDev(id, name, skills);
    return new BackendDev(id, name, skills);
}

// 使用示例
const alice = createDeveloper('fe', 'u_001', 'Alice', ['HTML', 'CSS', 'TypeScript']);
const bob = createDeveloper('be', 'u_002', 'Bob', ['Node', 'SQL']);

alice.coding('TypeScript');
console.log(alice.introduce());

bob.coding('TypeScript');
console.log(bob.introduce());

// 结构化类型：满足接口的“形状”即被视为兼容
const tempDev: Developer = {
    id: 'temp_01',
    name: 'Temp',
    coding: () => 100,
    introduce: () => '临时开发者'
};

// 只读属性不可修改 -> 编译错误
// alice.id = 'new_id'; // ❌
```

##### (2) 继承接口：可以从一个接口里赋值成员到另外一个接口里使用，更加灵活的将接口分割到可重用的模块里；

```ts
interface Shape {
    color: string;
}
// 多接口继承
interface PenStroke {
    penWidth: number;
}
interface Square extends Shape, PenStroke {
    sidelength: number;
}

let square = <Square>{};
square.color = "bule";
square.sideLength = 10;
square.penWidth = 5.0;
```