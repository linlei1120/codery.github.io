# Vue3.0进阶主题

### 深入响应式系统

&emsp;&emsp;① 什么是响应式？

&emsp;&emsp;&emsp;通俗的来说，响应式指的就是我们可以动态的监听到数据状态的变化，并且渲染到页面上。原生的JS并没有动态监听数据状态变化的方法，所以需要构建专门的依赖捕获和依赖触发函数进行响应式操作；

&emsp;&emsp;② Vue响应式的工作原理：

### Vue渲染机制

### 渲染函数和JSX

### Vue3术语表
&emsp;&emsp;**异步组件defineAsyncComponent**

&emsp;&emsp;**① 作用**

&emsp;&emsp;将组件定义为异步加载，只有在需要时才会从服务器获取组件代码，实现代码分割和按需加载

&emsp;&emsp;**② 主要应用场景**

&emsp;&emsp;**代码分割：** 减少初始包体积，提升首屏加载速度
&emsp;&emsp;**路由懒加载：** 页面组件按需加载，优化用户体验
&emsp;&emsp;**条件渲染：** 某些组件只在特定条件下才显示时使用
&emsp;&emsp;**大型组件：** 图表、富文本编辑器等体积较大的组件

&emsp;&emsp;**③ 基本用法**

```js
// 基础用法
const AsyncComponent = defineAsyncComponent(() => import('./MyComponent.vue'))

// 带选项的用法
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./MyComponent.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
})

// 各属性详细解释：
// loader: 异步加载器函数，返回Promise，用于实际加载组件
// loadingComponent: 加载中显示的组件，在异步组件加载期间展示
// errorComponent: 加载失败时显示的组件，网络错误或加载超时时展示
// delay: 延迟时间(ms)，避免加载过快时闪烁，超过此时间才显示loading
// timeout: 超时时间(ms)，超过此时间未加载完成则显示错误组件
```

&emsp;&emsp;**④ 实际示例**

&emsp;&emsp;**路由懒加载：**
```js
// router/index.js
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/profile',
    component: () => import('@/views/Profile.vue')
  }
]
```

&emsp;&emsp;**组件内使用：**
```js
<template>
  <div>
    <button @click="showChart = true">显示图表</button>
    <AsyncChart v-if="showChart" />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

const showChart = ref(false)

// 只有在需要时才加载图表组件
const AsyncChart = defineAsyncComponent({
  loader: () => import('./components/Chart.vue'),
  loadingComponent: { template: '<div>图表加载中...</div>' },
  delay: 200
})
</script>
```
&emsp;&emsp;**优点：** 减少初始加载时间、提升用户体验、优化资源利用
&emsp;&emsp;**注意：** 需要配合Suspense组件处理加载状态

&emsp;&emsp;**编译器宏**

&emsp;&emsp;**定义：** 编译器宏是Vue3在编译阶段处理的特殊函数，只能在`<script setup>`中使用，无需导入即可直接使用

&emsp;&emsp;**常见编译器宏：**

&emsp;&emsp;**`defineProps()`** - 定义组件props
&emsp;&emsp;**`defineEmits()`** - 定义组件事件
&emsp;&emsp;**`defineExpose()`** - 暴露组件方法给父组件
&emsp;&emsp;**`withDefaults()`** - 为props设置默认值
&emsp;&emsp;**`defineSlots()`** - 定义插槽类型（TypeScript）
&emsp;&emsp;**`defineOptions()`** - 定义组件选项

```js
<script setup>
// 无需导入，直接使用
const props = defineProps({
  title: String,
  count: Number
})

const emit = defineEmits(['update', 'change'])

// 暴露方法给父组件
defineExpose({
  focus: () => input.value.focus()
})
</script>
```
&emsp;&emsp;**特点：** 编译时转换、无需导入、类型安全、性能优化

&emsp;&emsp;**组合式函数**

&emsp;&emsp;**自定义元素**

&emsp;&emsp;**指令**

&emsp;&emsp;**动态组件component**

&emsp;&emsp;**作用effect**

&emsp;&emsp;**事件Event**

&emsp;&emsp;**片段fragment**

&emsp;&emsp;**函数式组件**

&emsp;&emsp;**变量提升**

&emsp;&emsp;**提供provide/注入inject**

&emsp;&emsp;**具名插槽/作用域插槽**

&emsp;&emsp;**响应式作用**

&emsp;&emsp;**响应性**

&emsp;&emsp;**渲染函数**

&emsp;&emsp;**单文件组件SFC**

&emsp;&emsp;**副作用**

&emsp;&emsp;**模板 ref**

&emsp;&emsp;**虚拟 DOM**

&emsp;&emsp;**虚拟DOM节点VNode**

