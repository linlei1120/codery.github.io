# Class类

### 1、简介
*ES6所推出的类Class，使得开发者可以更好的进行面向对象编程，类编程可以通过封装数据与行为，支持继承与多态，让复杂的代码模块化更好组合、更好维护，更方便代码复用。*

**入门示例：**
```ts
    class Greeter {
        greeting: string; //成员变量
        // 构造函数
        constructor(message: string) {
            this.greeting = message;
        }
        // 方法
        greet() {
            return 'Hello,' + this.greeting
        }
    }
    // 实例化
    let greeter = new Greeter('world')
```

### 2、修饰符

*在类Class中，常用的修饰符有三种，分别是：`公共public(默认)`、`私有private`、`受保护的proetced`*
```ts
// 
class Animal {
    public name: string; // 默认公开，全部可以访问
    private age: number; //私有变量
    public constructor(theName: string) {
        this.name = thename;
    }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}`)
    }
}
new Animal("Cat").age; // Error:错误，私有变量不可在外部访问 
```

**类型兼容性规则：** 

类类型比较需要满足： ① 必须来自同一个类声明的`private`成员；②、子类会继承父类的`private`成员定义；

```ts
class Animal {
    private name: string;
    constructor(name: string) {
        this.name = name;
    }
}
class Rhino extends Animol {
    contructor() {
        super("Rhino");
    }
}
class Employee {
    private name: string; //独立定义的private
    constructor(name: string) {
        this.name = name;
    }
}
const animal = new Animal("Goat");
const rhino = new Rhino();
const employee = new Employee("Bob");
animal = rhino; //兼容，来源于同一个父类
animal = employee; // Error： 异常不兼容，虽然结构相同但是来源不同

```

**protected修饰符**
- 与`private`类似，但是可以在派生类中使用
- 不能从类的外部访问
- 访问控制比` private `稍宽松的
```ts
class Person {
    protected name: string;  // 受保护属性
    
    constructor(name: string) {
        this.name = name;
    }
}

class Employee extends Person {
    private department: string;
    
    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }
    
    // 可以访问父类的 protected 成员
    public intro() {
        return `我是${this.name}，在${this.department}工作`;
    }
}

const emp = new Employee("张三", "技术部");
console.log(emp.intro());  // 正常工作
console.log(emp.name);     // 错误！外部不能访问 protected 成员

// protected构造蛤属使类只能被继承不能直接实例化
class Person {
    protected constructor(public name: string) {}
}
class Employee extends Person {
    constructor(name: string) {
        super(name);
    }
}
new Person("李四");  // 错误！不能实例化 protected 构造函数的类
new Employee("王五");  // 可以
```
**附：** `readonly修饰符`将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。

### 3、存取器

*存取器即在类Class通过getters/setters来截取对对象成员的访问，即在修改对象成员前进行一些前置操作，如判断条件等等，有效控制对对象成员的访问。*

```ts
// 先检查用户密码是否正确，然后再允许其修改信息
let passcode = "secret passcode";

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullname;
    }

    set fullName(newName): string {
        if(passcode && passcode === "secret passcode") {
            this._fullName = newName;
        } else {
            console.log("Error！！！")
        }
    }
}
let employee = new Employee();
employee.fullName = "Bob Smith";
```

### 4、静态属性static
*静态属性适用于需要类级别共享的数据或功能，比如全局配置、计数器、工具方法等等，它与实例属性的关键区别在于生命周期和访问方式——静态属性存在于类定义时就已创建，且通过类名而非实例访问。*
**特点：** ① 属于类本身而非实例；② 所有实例共享一份静态属性；③ 通过类名直接访问，而非`this`访问;

```ts
class Grid {
    // 静态属性
    static origin = { x: 0, y: 0};

    //实例属性
    constructor(public scale: number) {}

    //实例方法
    calculateDisance(point: {x: number; y: number}) {
        const dx = point.x - Grid.origin.x; //直接通过类名访问静态属性
        const dy = point.y - Grid.origin.y;

        return Math.sqrt(dx * dx + dy * dy) / this.scale;
    }
}
console.log(Grid.origin.x) //直接访问静态属性

// 实例使用
const grid1 = new Grid(1);
const grid2 = new Grid(2);
// 所有实例访问的是同一个静态属性
console.log(grid1.calculateDistance({x: 3, y: 4}));  // 5 (√(3²+4²)/1)
console.log(grid2.calculateDistance({x: 3, y: 4}));  // 2.5 (√(3²+4²)/2)
```

### 高级技巧-构造函数

*TypeScript 类的独特之处在于同时扮演类型和值的双重角色，类型和构造函数，它可以描述实例类型也可以用于创建实例的JS函数。*

**高级构造函数模式：**
```ts
class ConfigurableGreeter {
    static defaultGreeting = "Hello";
    
    constructor(public greeting?: string) {}
    
    greet() {
        return this.greeting || ConfigurableGreeter.defaultGreeting;
    }
}

// 修改类静态属性会影响所有实例
ConfigurableGreeter.defaultGreeting = "Hi";

const greeter1 = new ConfigurableGreeter();
console.log(greeter1.greet());  // "Hi"

const GreeterClass: typeof ConfigurableGreeter = ConfigurableGreeter;
GreeterClass.defaultGreeting = "Hola";

const greeter2 = new GreeterClass();
console.log(greeter2.greet());  // "Hola"

```