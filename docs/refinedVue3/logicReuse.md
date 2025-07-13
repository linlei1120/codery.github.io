# Vue3.0 逻辑复用

## 1、组合式函数

&emsp;&emsp;**① 定义：** 组合函数类依赖于Vue的响应式，似于将公共脚本封装但是更加灵活，是一个利用 Vue 的组合式 API 来封装和复用有状态逻辑的函数。而Vue中两种重用代码的方式就包括了组件和组合式函数；

&emsp;&emsp;**② 常用操作：** 组合函数封装使用、组合函数嵌套使用；异步状态：如基于传入的状态来创建执行操作的侦听器

&emsp;&emsp;**③ 约定实践：** 采用驼峰命名，且名称以`use开头`。副作用要在`onMounted`时挂载，要在`onUnmounted`时清理副作用；组合式函数适用于在`<script setup>`或`setup()`方法中使用，也可以在`onMounted()`周期函数中使用，其他地方不可使用；

&emsp;&emsp;**④ 对比Mixin：** Mixin的数据来源不清晰；组合函数可以通过解构赋值添加别名避免冲突；

&emsp;&emsp;抽取组合式函数：基于逻辑问题将组件代码拆分为更小的函数，可以使得逻辑代码可读性复用性更强，也便于查询和理解，而抽取出的组件也可以相互通信服务；

&emsp;&emsp;**⑤ 对比React Hooks：** 组合式函数和React Hooks相识，但前者是基于Vue细粒度响应性系统，与React Hooks的执行模型有本质上的区别；

&emsp;&emsp;**普通纯函数** = 单纯提供「计算工具」（如菜刀）

&emsp;&emsp;**组合式函数** = 提供「工具 + 响应式数据 + 生命周期」（像料理机，一键完成）
```js
    //纯函数，不关心 Vue
export function formatPrice(price) {
  return `￥${price.toFixed(2)}`;
}
// 使用：输入固定，输出固定
import { formatPrice } from './utils.js';

const price = 100;
console.log(formatPrice(price)); // 输出：￥100.00

import { ref } from 'vue';

// 组合式函数：封装了「状态 + 逻辑」
export function useCounter(initialValue = 0) {
  const count = ref(initialValue);  // 依赖 Vue 的 ref

  function increment() {
    count.value++;
  }

  return { count, increment }; // 返回响应式数据和方法
}
//  使用组合函数
import { useCounter } from './useCounter';
const { count, increment } = useCounter(0);
```
## 2、自定义指令

&emsp;&emsp;**三种注册方式：**

&emsp;&emsp;**① 组件内注册：** 在`<script setup>`中，以`v`开头的驼峰命名变量自动成为指令，使用时转为`v-`形式

&emsp;&emsp;**② 选项式注册：** 非`<script setup>`中使用`directives`对象注册

&emsp;&emsp;**③ 全局注册：** 在`main.js`中使用`app.directive()`方法全局注册

```js
// 组件内注册示例
const vHighlight = {
  mounted: el => {
    el.classList.add("is-highlight");
  }
};
// 使用：<div v-highlight></div>
```

## 3、插件封装

&emsp;&emsp;**定义：** 插件是一个拥有 `install()` 方法的对象，用于为Vue应用添加全局功能

&emsp;&emsp;**封装步骤：**

&emsp;&emsp;**① 创建插件对象**
```js
// plugins/myPlugin.js
export default {
  install(app, options) {
    // 插件逻辑
  }
}
```

&emsp;&emsp;**② 添加全局属性/方法**
```js
export default {
  install(app, options) {
    // 全局属性
    app.config.globalProperties.$myMethod = (key) => {
      return options[key]
    }
    
    // 全局方法
    app.provide('myPlugin', options)
  }
}
```

&emsp;&emsp;**③ 注册全局组件**
```js
import MyComponent from './components/MyComponent.vue'

export default {
  install(app, options) {
    app.component('MyComponent', MyComponent)
  }
}
```

&emsp;&emsp;**④ 添加全局指令**
```js
export default {
  install(app, options) {
    app.directive('focus', {
      mounted(el) {
        el.focus()
      }
    })
  }
}
```

&emsp;&emsp;**⑤ 完整插件示例**
```js
// plugins/toast.js
export default {
  install(app, options = {}) {
    const defaultOptions = {
      duration: 3000,
      position: 'top'
    }
    
    const toastOptions = { ...defaultOptions, ...options }
    
    // 全局方法
    app.config.globalProperties.$toast = (message, type = 'info') => {
      console.log(`Toast: ${message} (${type})`)
      // 实际实现toast逻辑
    }
    
    // 全局组件
    app.component('Toast', {
      template: '<div class="toast">{{ message }}</div>',
      props: ['message']
    })
    
    // 提供全局配置
    app.provide('toastConfig', toastOptions)
  }
}
```

&emsp;&emsp;**⑥ 使用插件**
```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import ToastPlugin from './plugins/toast.js'

const app = createApp(App)

// 安装插件
app.use(ToastPlugin, {
  duration: 5000,
  position: 'bottom'
})

app.mount('#app')
```

&emsp;&emsp;**⑦ 在组件中使用**
```vue
<template>
  <div>
    <button @click="showToast">显示Toast</button>
    <Toast :message="toastMessage" />
  </div>
</template>

<script setup>
import { getCurrentInstance, inject } from 'vue'

const instance = getCurrentInstance()
const toastConfig = inject('toastConfig')

const showToast = () => {
  // 使用全局方法
  instance.appContext.config.globalProperties.$toast('Hello World', 'success')
}
</script>
```

&emsp;&emsp;**注意事项：**
- 插件应该有明确的作用域，避免全局污染
- 提供合理的默认配置和用户自定义选项
- 插件名称应该具有描述性，避免冲突
- 考虑插件的性能影响，按需加载
