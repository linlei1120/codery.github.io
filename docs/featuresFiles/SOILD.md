# SOLID 设计原则

SOLID 是面向对象设计（OOD）的五大核心原则，由 Robert C. Martin（Uncle Bob）提出。目标是让代码更易维护、易扩展、低耦合。

一句话概括：代码应像乐高积木——**模块化（易插拔）**、**高内聚（自包含）**、**低耦合（少依赖）**。

---

## 五大原则速查

| 原则 | 核心思想 | 违反示例 | 遵守方案 | 相关设计模式 |
| --- | --- | --- | --- | --- |
| **S - 单一职责** | 一个类只做一件事 | `User` 类既存数据又发邮件 | 拆成 `User` 与 `EmailService` | 装饰者模式 |
| **O - 开闭原则** | 对扩展开放，对修改关闭 | 每加新功能都改旧代码 | 用接口 / 抽象类扩展 | 策略模式、工厂模式 |
| **L - 里氏替换** | 子类必须能替换父类 | 正方形继承长方形导致面积计算错误 | 用组合替代继承 | 适配器模式 |
| **I - 接口隔离** | 接口要小巧、专注 | `Animal` 接口同时含 `fly()` 和 `swim()` | 拆成 `Flyable` 与 `Swimmable` | 外观模式 |
| **D - 依赖倒置** | 依赖抽象，不依赖具体 | `PaymentProcessor` 直接依赖 `PayPal` | 依赖 `PaymentGateway` 接口 | 依赖注入、模板方法 |

---

## 1. SRP：单一职责原则（Single Responsibility Principle）

**核心：一个类只负责一个功能领域。**

### 违反示例

```java
class User {
    void saveToDatabase() { /* 数据库操作 */ }
    void sendEmail() { /* 发邮件逻辑 */ }
}
```

问题：数据库操作与邮件发送耦合在一起，修改邮件服务可能影响数据库逻辑。

### 改进写法

```java
class UserService {
    void saveToDatabase() { /* 只负责存储 */ }
}

class EmailService {
    void sendEmail() { /* 只负责发邮件 */ }
}
```

这样做的好处：

- 数据库逻辑修改不会牵动邮件服务
- 每个功能更容易单独测试

---

## 2. OCP：开闭原则（Open-Closed Principle）

**核心：对扩展开放（可新增功能），对修改关闭（尽量不改旧代码）。**

### 违反示例

```java
class PaymentProcessor {
    void process(String paymentType) {
        if (paymentType.equals("paypal")) { /* PayPal 逻辑 */ }
        else if (paymentType.equals("stripe")) { /* Stripe 逻辑 */ }
        // 每加一种支付方式都要修改此类
    }
}
```

问题：新增支付方式必须改动 `PaymentProcessor`，违反 OCP。

### 改进写法（策略模式）

```java
interface PaymentGateway {
    void process();
}

class PayPalGateway implements PaymentGateway { /* ... */ }
class StripeGateway implements PaymentGateway { /* ... */ }

class PaymentProcessor {
    void process(PaymentGateway gateway) {
        gateway.process(); // 通过接口扩展，无需修改旧代码
    }
}
```

---

## 3. LSP：里氏替换原则（Liskov Substitution Principle）

**核心：子类必须能完全替换父类，且不破坏程序行为。**

### 经典反例：正方形继承长方形

```java
class Rectangle {
    int width, height;
    void setWidth(int w) { width = w; }
    void setHeight(int h) { height = h; }
}

class Square extends Rectangle {
    void setWidth(int w) { width = height = w; } // 改变了父类语义
}
```

问题：正方形强行重写 `setWidth()`，破坏了长方形使用者对宽高可独立设置的预期，面积计算也会出错。

### 改进写法（组合优于继承）

```java
interface Shape {
    int getArea();
}

class Rectangle implements Shape { /* 正常实现 */ }
class Square implements Shape { /* 独立实现 */ }
```

---

## 4. ISP：接口隔离原则（Interface Segregation Principle）

**核心：不要强迫调用方依赖它不需要的接口方法。**

### 违反示例：臃肿接口

```java
interface Animal {
    void eat();
    void swim();
    void fly(); // 企鹅不会飞，却被迫实现
}
```

问题：`Penguin` 被迫实现 `fly()`，往往只能抛出 `UnsupportedOperationException`。

### 改进写法（拆分接口）

```java
interface Eatable { void eat(); }
interface Swimmable { void swim(); }
interface Flyable { void fly(); }

class Penguin implements Eatable, Swimmable { /* 只实现需要的 */ }
class Eagle implements Eatable, Flyable { /* ... */ }
```

---

## 5. DIP：依赖倒置原则（Dependency Inversion Principle）

**核心：依赖抽象（接口），而不是具体实现。**

### 违反示例

```java
class PaymentProcessor {
    private PayPalGateway gateway; // 直接依赖具体类
    void process() { gateway.charge(); }
}
```

问题：换成 Stripe 等其他实现时，必须修改 `PaymentProcessor`。

### 改进写法（依赖注入 + 接口）

```java
interface PaymentGateway { void charge(); }

class PayPalGateway implements PaymentGateway { /* ... */ }
class StripeGateway implements PaymentGateway { /* ... */ }

class PaymentProcessor {
    private PaymentGateway gateway; // 依赖抽象
    PaymentProcessor(PaymentGateway gateway) { // 依赖注入
        this.gateway = gateway;
    }
}
```

---

## 小结与实践建议

| 原则 | 实践要点 |
| --- | --- |
| **SRP** | 按职责拆分类，保持「小而专注」 |
| **OCP** | 多用策略模式、装饰者模式做扩展 |
| **LSP** | 子类不要改写父类约定；优先组合而非不当继承 |
| **ISP** | 接口细粒度、按能力拆分，避免「大而全」接口 |
| **DIP** | 面向接口编程；Spring 依赖注入是典型实践 |

延伸阅读：

- 《Clean Architecture》（Robert C. Martin）
- Spring 框架源码中的 SOLID 运用
- 用 SonarQube 等工具辅助检查设计异味
