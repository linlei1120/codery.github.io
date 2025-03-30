---
outline: deep
---

# UML之创建型设计模式

## 工厂方法模式

### 1、概述：

&emsp;&emsp;工厂方法模式就像一个对象工厂，你告诉工厂想要什么，工厂就会为你生产对应的商品，而不需要你自己去new这个对象。工厂方法遵循开放-封闭原则，提供了一个创建对象的接口，允许子类来决定需要实例化的对象的类型。

### 2、特点：

&emsp;&emsp;① 将对象的创建和使用分离；② 便于扩展新的对象类型；③ 更加易于代码的维护和修改；④ 减少大量`if...else`语句
![Example Image](../public/UML/factoryPattern.jpg)

### 3、案例：
```js
// 传统方式
function previewFile(file) {
  if (file.type === 'pdf') {
    renderPDF(file.content);
  } else if (file.type === 'image') {
    renderImage(file.content);
  } else if (file.type === 'video') {
    renderVideo(file.content);
  }
  // 每新增一种类型就要修改这个函数
}

// 工厂模式方式
class PreviewerFactory {
  static createPreviewer(fileType) {
    switch(fileType) {
      case 'pdf': return new PDFPreviewer();
      case 'image': return new ImagePreviewer();
      case 'video': return new VideoPreviewer();
      // 新增类型只需添加case，不修改原有逻辑
      case 'markdown': return new MarkdownPreviewer(); 
    }
  }
}

// 使用
const previewer = PreviewerFactory.createPreviewer(file.type);
previewer.render(file.content);
```
### 4、注意：

&emsp;&emsp;模式适用于重复/复杂场景，简单实现不应强制使用模式，需要权衡利弊；


## 抽象工厂模式

### 1、概述：

&emsp;&emsp; 抽象工厂模式类似于一个超级工厂和其他工厂的关系，超级工厂提供模板服务，其他各类工厂根据模板提供产品，无需再去指定每一个工厂。即提供一系列相关或相互依赖的对象的接口，而无需指定具体的类。

### 2、特点：

&emsp;&emsp;① 一致性：多种类型对象保持一致；② 易扩展：新主题仅需要新增一个新的类；③ 解耦性：实例化类无需知道具体的对象或类；

![Example Image](../public/UML/abstrctFactoryPattern.jpg)

### 3、案例：UI主题更换
```js

```

## 单例模式

### 1、概述：单例模式是前端开发中常用的一种模式，适合全局唯一状态控制或共享资源的场景。单列模式确保一个类仅有一个实例，并提供一个全局访问点来访问该实例。

### 2、特点：① 唯一性：内存仅有一个实例，减少内存开销； ② 避免频繁创建和销毁实例时的资源小号； ③ 全局可访问；

### 3、应用场景：全局状态管理如Vuex的store、浏览器中的window对象、数据库连接池等
![Example Image](../public/UML/singletonPattern.jpg)
### 4、案例
```js
// 全局日志监听器

```

