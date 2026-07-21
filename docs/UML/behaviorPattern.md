---
outline: deep
description: 行为型设计模式详解 — 职责链、命令、解释器、迭代器、中介者、备忘录、观察者、状态、策略、模板方法与访问者模式
---

# UML 之行为型设计模式

行为型模式关注**对象之间的通信与职责分配**，将行为从类结构中解耦，使算法和职责可以在运行时灵活组合与切换。

## 模式速览

| 模式 | 核心思想 | 典型场景 |
| :--- | :--- | :--- |
| [职责链模式](#一职责链模式) | 沿链传递请求，直到有对象处理 | 审批流、中间件、异常处理 |
| [命令模式](#二命令模式) | 将请求封装为对象 | 撤销/重做、任务队列、宏命令 |
| [解释器模式](#三解释器模式) | 定义文法并解释表达式 | 简单 DSL、规则引擎、公式计算 |
| [迭代器模式](#四迭代器模式) | 统一遍历聚合对象 | 集合遍历、分页、树形结构 |
| [中介者模式](#五中介者模式) | 通过中介者集中协调通信 | 聊天室、表单联动、组件解耦 |
| [备忘录模式](#六备忘录模式) | 保存并恢复对象状态 | 撤销、快照、游戏存档 |
| [观察者模式](#七观察者模式) | 一对多状态通知 | 事件总线、MVC、数据绑定 |
| [状态模式](#八状态模式) | 状态改变时切换行为 | 订单状态机、工作流、UI 模式 |
| [策略模式](#九策略模式) | 封装可互换的算法 | 排序/支付方式、促销规则 |
| [模板方法模式](#十模板方法模式) | 父类定义算法骨架 | 框架钩子、固定流程可变步骤 |
| [访问者模式](#十一访问者模式) | 将操作与数据结构分离 | 编译器 AST、报表导出、对象遍历 |

---

## 一、职责链模式(Chain of Responsibility)

::: info 作用
** 把请求沿「处理链」传递，直到某个对象接手，发送方不必知道最终谁来处理。**

- **解耦发送者与接收者**：调用方只发出请求，不关心链路中有哪些处理者、顺序如何。
- **动态组合链路**：可在运行时增删、重排处理节点，灵活应对不同业务规则。
- **职责单一**：每个节点只关心「我能不能处理」和「处理不了就交给下一个」。

> 类比：公司报销审批——员工提交后，依次经过组长、经理、财务，谁有权谁签字，员工不用指定找谁。
:::

#### 实用场景

- **多级审批**：请假、报销、采购等按职级逐级流转，任一环节可驳回或放行。
- **Web 中间件**：Express / Koa 中请求依次经过鉴权、日志、限流等中间件。
- **异常处理链**：捕获异常后按类型依次尝试不同 Handler，直到有人能处理。
- **补充**：注意设置默认处理或超时，避免请求「无人认领」在链上无限传递。

#### UML 图

<div style="text-align: center">

![职责链模式](../public/UML/chainOfResponsibilityPattern.jpg)

</div>

#### 示例代码

```js runnable
class Handler {
  constructor() { this.next = null; }
  setNext(handler) { this.next = handler; return handler; }
  handle(request) {
    if (this.next) return this.next.handle(request);
    console.log('无处理者');
  }
}

class ConcreteHandlerA extends Handler {
  handle(request) {
    if (request === 'A') console.log('处理者A处理');
    else super.handle(request);
  }
}
class ConcreteHandlerB extends Handler {
  handle(request) {
    if (request === 'B') console.log('处理者B处理');
    else super.handle(request);
  }
}

const handlerA = new ConcreteHandlerA();
handlerA.setNext(new ConcreteHandlerB());
handlerA.handle('B'); // 处理者B处理
```

::: tip 优点
- 降低发送者与接收者的耦合
- 动态增删处理者，灵活扩展
:::

::: warning 缺点
- 可能无对象处理请求
- 链过长时调试与追踪困难
:::

---

## 二、命令模式(Command)

::: info 作用
** 把「要做的事」封装成独立对象，调用方只负责触发，具体执行、排队、撤销都可统一管理。**

- **请求即对象**：每个操作是一个 Command，可存储、传递、序列化。
- **解耦调用者与执行者**：Invoker 不知道 Receiver 的细节，只调用 `execute()`。
- **天然支持高级特性**：撤销、重做、宏命令、任务队列、操作日志。

> 类比：餐厅点单——顾客（调用者）下单，订单（命令）交给厨房（接收者）执行，订单还能排队、取消。
:::

#### 实用场景

- **撤销 / 重做**：编辑器、绘图软件的操作历史栈。
- **任务队列 / 异步执行**：将命令放入队列，由工作线程依次执行。
- **宏命令**：多个小命令组合成一个复合命令，一次执行或撤销。
- **补充**：适合「操作需要记录、回放或延迟执行」的场景；简单 CRUD 不必过度封装。

#### UML 图

<div style="text-align: center">

![命令模式](../public/UML/commandPattern.jpg)

</div>

#### 示例代码

```js runnable
// 接收者
class Receiver {
  action() { console.log('执行请求'); }
}
// 命令接口
class Command {
  execute() {}
  undo() {}
}
// 具体命令
class ConcreteCommand extends Command {
  constructor(receiver) { super(); this.receiver = receiver; }
  execute() { this.receiver.action(); }
  undo() { console.log('撤销操作'); }
}
// 调用者
class Invoker {
  constructor() { this.history = []; }
  executeCmd(cmd) {
    cmd.execute();
    this.history.push(cmd);
  }
  undo() {
    const cmd = this.history.pop();
    if (cmd) cmd.undo();
  }
}

const receiver = new Receiver();
const cmd = new ConcreteCommand(receiver);
const invoker = new Invoker();
invoker.executeCmd(cmd);
invoker.undo();
```

::: tip 优点
- 请求发起与执行解耦
- 支持撤销、重做与命令队列
:::

::: warning 缺点
- 增加 Command 类数量，系统更复杂
- 简单操作封装成本可能过高
:::

---

## 三、解释器模式(Interpreter)

::: info 作用
** 为特定语言或表达式定义文法规则，并用解释器逐条解析执行。**

- **文法即类结构**：终结符、非终结符对应不同表达式类，组合成语法树。
- **易于扩展规则**：新增运算符或语句类型，主要增加对应 Expression 子类。
- **适合简单领域语言**：复杂通用语言通常用成熟解析器（如 ANTLR）更合适。

> 类比：数学计算器——「5 + 3」被拆成数字节点和加法节点，逐层 `interpret()` 得出结果。
:::

#### 实用场景

- **简单 DSL**：配置规则、权限表达式、筛选条件字符串。
- **SQL / 正则等子集解析**：业务可控的小型查询语言。
- **公式与规则引擎**：折扣规则、积分计算等可配置逻辑。
- **补充**：文法过于复杂时维护成本高，应考虑专用解析框架。

#### UML 图

<div style="text-align: center">

![解释器模式](../public/UML/interpreterPattern.jpg)

</div>

#### 示例代码

```js runnable
class Context {
  constructor(expression) { this.expression = expression; }
}

class Expression {
  interpret(context) { }
}

class NumberExpression extends Expression {
  constructor(number) { super(); this.number = number; }
  interpret() { return this.number; }
}

class AddExpression extends Expression {
  constructor(left, right) { super(); this.left = left; this.right = right; }
  interpret() { return this.left.interpret() + this.right.interpret(); }
}

const result = new AddExpression(new NumberExpression(5), new NumberExpression(3)).interpret();
console.log(result); // 8
```

::: tip 优点
- 文法扩展方便，结构清晰
- 易于实现简单语言
:::

::: warning 缺点
- 复杂文法难以维护
- 解释执行效率通常较低
:::

---

## 四、迭代器模式(Iterator)

::: info 作用
** 提供统一方式遍历聚合对象，而不暴露其内部存储结构。**

- **遍历与存储分离**：客户端通过 Iterator 访问元素，不关心底层是数组、链表还是树。
- **多种遍历策略**：可同时支持顺序、逆序、过滤等不同迭代器。
- **符合单一职责**：聚合类管数据，迭代器管访问逻辑。

> 类比：图书馆书架（聚合）与导览员（迭代器）——读者按导览路线看书，不用自己翻找书架内部结构。
:::

#### 实用场景

- **统一遍历多种集合**：列表、树、图、自定义数据结构。
- **封装复杂遍历逻辑**：二叉树中序遍历、图 BFS/DFS 等。
- **分页与懒加载**：Iterator 按需取下一项，不必一次加载全部数据。
- **补充**：JavaScript 原生 `for...of` 与 `[Symbol.iterator]` 已是该模式的常见实现。

#### UML 图

<div style="text-align: center">

![迭代器模式](../public/UML/iteratorPattern.jpg)

</div>

#### 示例代码

```js runnable
class Iterator {
  constructor(items) { this.items = items; this.index = 0; }
  hasNext() { return this.index < this.items.length; }
  next() { return this.items[this.index++]; }
}

const items = ['a', 'b', 'c'];
const iterator = new Iterator(items);
while (iterator.hasNext()) { console.log(iterator.next()); }
```

::: tip 优点
- 简化客户端遍历逻辑
- 支持多种聚合结构与遍历方式
:::

::: warning 缺点
- 增加 Iterator 类与接口
- 对简单数组遍历可能显得冗余
:::

---

## 五、中介者模式(Mediator)

::: info 作用
** 用中介者集中管理对象间的交互，同事类之间不再直接引用，降低网状耦合。**

- **星型拓扑**：Colleague 只与 Mediator 通信，由 Mediator 转发、协调。
- **交互逻辑集中**：修改通信规则时只改 Mediator，不必动所有 Colleague。
- **与观察者区别**：观察者是一对多广播；中介者是多对多经中心协调。

> 类比：机场塔台——各航班（同事对象）不直接互喊，统一听塔台（中介者）调度。
:::

#### 实用场景

- **聊天室 / 群聊**：用户发消息给中介者，由中介者分发给其他成员。
- **表单联动**：省市区、品类规格等字段变化，由中介者统一更新关联控件。
- **UI 组件通信**：对话框内多个子组件通过 Mediator 交互，避免互相 import。
- **补充**：中介者逻辑过重时会变成「上帝对象」，需按领域拆分多个中介者。

#### UML 图

<div style="text-align: center">

![中介者模式](../public/UML/mediatorPattern.jpg)

</div>

#### 示例代码

```js runnable
class Mediator {
  notify(sender, event) {}
}

class ConcreteMediator extends Mediator {
  constructor(colleagues) {
    super();
    this.colleagues = colleagues;
    colleagues.forEach(c => c.mediator = this);
  }
  notify(sender, event) {
    if (event === 'A') this.colleagues[1].receive();
    if (event === 'B') this.colleagues[0].receive();
  }
}

class Colleague {
  constructor(name) { this.name = name; }
  send(event) { this.mediator.notify(this, event); }
  receive() { console.log(this.name + ' 收到通知'); }
}

const c1 = new Colleague('A');
const c2 = new Colleague('B');
new ConcreteMediator([c1, c2]);
c1.send('A');
```

::: tip 优点
- 降低同事对象之间的耦合
- 交互逻辑集中，便于维护
:::

::: warning 缺点
- 中介者过于复杂时难以维护
- 可能违背单一职责原则
:::

---

## 六、备忘录模式(Memento)

::: info 作用
** 在不破坏封装的前提下，保存对象某一时刻的内部状态，并在需要时恢复。**

- **状态快照**：Originator 生成 Memento，Caretaker 负责存储，不访问内部细节。
- **支持撤销 / 回滚**：编辑器、游戏、配置修改等「回到之前状态」。
- **封装性**：外部只持有 Memento 对象，不直接读写 Originator 私有字段。

> 类比：游戏存档——角色（发起人）把当前进度打包成存档（备忘录），玩家（管理者）保存/读取，无需知道存档内部数据结构。
:::

#### 实用场景

- **撤销操作**：文本编辑、表单「还原上次保存」。
- **历史版本 / 快照**：配置回滚、审计对比。
- **浏览器前进后退**：页面状态序列化与恢复。
- **补充**：频繁快照会占用内存，可限制栈深度或增量存储。

#### UML 图

<div style="text-align: center">

![备忘录模式](../public/UML/mementoPattern.jpg)

</div>

#### 示例代码

```js runnable
class Memento {
  constructor(state) { this.state = state; }
}
class Originator {
  constructor() { this.state = ''; }
  setState(state) { this.state = state; }
  save() { return new Memento(this.state); }
  restore(memento) { this.state = memento.state; }
}
class Caretaker {
  constructor() { this.mementos = []; }
  backup(originator) { this.mementos.push(originator.save()); }
  undo(originator) {
    const m = this.mementos.pop();
    originator.restore(m);
  }
}

const ori = new Originator();
const care = new Caretaker();
ori.setState('State1');
care.backup(ori);
ori.setState('State2');
care.undo(ori);
console.log(ori.state); // State1
```

::: tip 优点
- 保存对象内部状态而不破坏封装
- 支持撤销与恢复
:::

::: warning 缺点
- 大量快照消耗内存
- 宽接口 Originator 可能增加复杂度
:::

---

## 七、观察者模式(Observer)

::: info 作用
** 定义一对多依赖：主题状态变化时，自动通知所有订阅者更新。**

- **发布 / 订阅**：Subject 维护观察者列表，`notify` 时批量推送。
- **松耦合**：主题不知道观察者具体做什么，只负责发通知。
- **事件驱动基础**：前端框架、消息总线、响应式系统都基于此思想。

> 类比：公众号订阅——博主（主题）发文，所有粉丝（观察者）收到推送，博主不必逐个打电话。
:::

#### 实用场景

- **事件驱动 UI**：按钮点击、数据变化驱动视图刷新。
- **MVC / MVVM**：Model 变化通知 View 更新。
- **消息总线 / EventEmitter**：模块间解耦通信。
- **补充**：注意取消订阅，避免内存泄漏；通知顺序与循环依赖需在设计时考虑。

#### UML 图

<div style="text-align: center">

![观察者模式](../public/UML/observerPattern.jpg)

</div>

#### 示例代码

```js runnable
class Subject {
  constructor() { this.observers = []; }
  attach(obs) { this.observers.push(obs); }
  detach(obs) { this.observers = this.observers.filter(o => o !== obs); }
  notify(data) { this.observers.forEach(o => o.update(data)); }
}
class Observer {
  constructor(name) { this.name = name; }
  update(data) { console.log(this.name + ' 收到:' + data); }
}

const subject = new Subject();
const o1 = new Observer('o1');
subject.attach(o1);
subject.notify('消息');
```

::: tip 优点
- 主题与观察者松耦合
- 支持广播式、动态订阅
:::

::: warning 缺点
- 观察者过多时通知开销大
- 更新顺序不确定，调试较难
:::

---

## 八、状态模式(State)

::: info 作用
** 将行为随内部状态变化而变化的逻辑，拆分到独立状态类中，避免大量 `if/else`。**

- **状态即对象**：每种状态一个类，实现相同接口，Context 委托给当前 State。
- **转换内聚**：状态切换逻辑可在 State 内部或 Context 中统一管理。
- **替代条件分支**：订单「待支付 → 已支付 → 已发货」等流程更清晰。

> 类比：交通灯——红灯、绿灯、黄灯各自定义「下一步亮什么」，控制器只持有「当前灯态」。
:::

#### 实用场景

- **订单 / 工单状态机**：不同状态下允许的操作与流转规则不同。
- **游戏角色状态**：站立、奔跑、攻击各自行为独立。
- **连接状态**：TCP 连接建立、传输、关闭各阶段处理不同。
- **补充**：状态类过多时可配合表驱动或状态机库；简单两三种状态不必强行上模式。

#### UML 图

<div style="text-align: center">

![状态模式](../public/UML/statePattern.jpg)

</div>

#### 示例代码

```js runnable
class Context {
  constructor(state) { this.transitionTo(state); }
  transitionTo(state) {
    this.state = state;
    this.state.context = this;
  }
}
class State {
  handle() {}
}
class ConcreteStateA extends State {
  handle() {
    console.log('状态A处理');
    this.context.transitionTo(new ConcreteStateB());
  }
}
class ConcreteStateB extends State {
  handle() {
    console.log('状态B处理');
    this.context.transitionTo(new ConcreteStateA());
  }
}

const context = new Context(new ConcreteStateA());
context.state.handle();
context.state.handle();
```

::: tip 优点
- 消除臃肿的条件分支
- 状态行为内聚，易于扩展新状态
:::

::: warning 缺点
- 状态类数量随状态增多而增加
- 状态转换关系复杂时需额外管理
:::

---

## 九、策略模式(Strategy)

::: info 作用
** 将一系列可互换的算法封装成独立策略，运行时按需注入，调用方与具体算法解耦。**

- **算法族**：同一接口 `doAlgorithm`，多种实现可替换。
- **消除条件分支**：Context 持有 Strategy 引用，不再 `switch(type)`。
- **开闭原则**：新增算法只需加策略类，不必改 Context。

> 类比：导航选路线——「最快」「最短」「少收费」是不同策略，同一目的地随时切换方案。
:::

#### 实用场景

- **支付方式**：微信、支付宝、银行卡等可切换。
- **排序 / 压缩 / 加密算法**：按配置或用户选择注入不同实现。
- **促销规则**：满减、折扣、包邮等策略组合。
- **补充**：与状态模式区别：策略通常由外部注入、彼此独立；状态常随 Context 内部自动流转。

#### UML 图

<div style="text-align: center">

![策略模式](../public/UML/strategyPattern.jpg)

</div>

#### 示例代码

```js runnable
class Context {
  constructor(strategy) { this.strategy = strategy; }
  execute() { this.strategy.doAlgorithm(); }
}
class ConcreteStrategyA {
  doAlgorithm() { console.log('算法 A'); }
}
class ConcreteStrategyB {
  doAlgorithm() { console.log('算法 B'); }
}

const context = new Context(new ConcreteStrategyA());
context.execute();
```

::: tip 优点
- 算法可自由切换，符合开闭原则
- 避免多重条件判断
:::

::: warning 缺点
- 策略类增多
- 客户端需了解各策略差异以便选择
:::

---

## 十、模板方法模式(Template Method)

::: info 作用
** 在父类中定义算法骨架（固定步骤顺序），将部分步骤延迟到子类实现。**

- **好莱坞原则**：「别调用我们，我们会调用你」——父类 `templateMethod` 控制流程，子类填细节。
- **复用公共流程**：相同步骤在父类实现一次，差异步骤由子类覆盖。
- **框架常用**：钩子方法（hook）允许子类选择性扩展。

> 类比：做菜的固定流程——「备料 → 炒制 → 出锅」，具体炒什么菜由子类决定中间细节。
:::

#### 实用场景

- **框架生命周期**：Servlet `service`、JUnit `setUp/test/tearDown`。
- **数据导入导出**：固定「读取 → 转换 → 写入」，各格式子类实现转换逻辑。
- **游戏循环**：初始化、更新、渲染骨架固定，各游戏子类实现具体内容。
- **补充**：子类过多且差异极小时，可考虑组合优于继承；JavaScript 可用高阶函数替代部分场景。

#### UML 图

<div style="text-align: center">

![模板方法模式](../public/UML/templateMethodPattern.jpg)

</div>

#### 示例代码

```js runnable
class AbstractClass {
  templateMethod() {
    this.step1();
    this.step2();
    this.step3();
  }
  step1() { console.log('默认步骤1'); }
  step2() {}
  step3() {}
}
class ConcreteClass extends AbstractClass {
  step2() { console.log('具体步骤2'); }
  step3() { console.log('具体步骤3'); }
}

new ConcreteClass().templateMethod();
```

::: tip 优点
- 复用公共算法骨架
- 子类只需实现差异化步骤
:::

::: warning 缺点
- 继承结构固定，灵活性低于组合
- 子类数量增加时类层次变深
:::

---

## 十一、访问者模式(Visitor)

::: info 作用
** 将作用于元素上的操作封装到访问者中，新增操作时无需修改元素类，只需新增 Visitor。**

- **双分派**：元素 `accept(visitor)` 再回调 `visitor.visitXxx(this)`，操作与数据结构分离。
- **适合稳定结构、多变操作**：类层次少变，但报表、导出、校验等操作频繁增加。
- **典型应用**：编译器 AST 遍历、IDE 重构、对象结构上的多种统计。

> 类比：博物馆导览——展品（元素）结构固定，不同导游（访问者）讲解侧重不同，不必给每件展品加「艺术版」「历史版」方法。
:::

#### 实用场景

- **AST 处理**：语法树节点稳定，新增优化 pass、代码生成、 lint 规则。
- **对象结构报表**：对同一组 DOM / 文档节点做导出 PDF、统计字数、 accessibility 检查。
- **购物车计价**：商品类型固定，促销、税费、积分等访问者叠加计算。
- **补充**：元素类经常变化时，每增一种元素都要改所有 Visitor，维护成本高。

#### UML 图

<div style="text-align: center">

![访问者模式](../public/UML/visitorPattern.jpg)

</div>

#### 示例代码

```js runnable
class Visitor {
  visitElementA(e) {}
  visitElementB(e) {}
}
class Element {
  accept(visitor) {}
}
class ConcreteElementA extends Element {
  accept(visitor) { visitor.visitElementA(this); }
  operationA() { console.log('元素 A 操作'); }
}
class ConcreteElementB extends Element {
  accept(visitor) { visitor.visitElementB(this); }
  operationB() { console.log('元素 B 操作'); }
}
class ConcreteVisitor1 extends Visitor {
  visitElementA(e) { console.log('访问者1访问A'); }
  visitElementB(e) { console.log('访问者1访问B'); }
}

const elements = [new ConcreteElementA(), new ConcreteElementB()];
const visitor = new ConcreteVisitor1();
elements.forEach(e => e.accept(visitor));
```

::: tip 优点
- 易于新增操作，无需修改元素类
- 相关操作集中在同一 Visitor 中
:::

::: warning 缺点
- 新增元素类型需修改所有 Visitor
- 破坏元素封装，依赖具体 Visitor 类型
:::
