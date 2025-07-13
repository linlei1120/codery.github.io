# Vue3.0 内置组件

## 1、`<Transition>`过渡和动画组件

&emsp;&emsp;**① 基本原理**

&emsp;&emsp;`<Transition>`是Vue内置的过渡动画组件，可在任意组件中使用。

&emsp;&emsp;**触发条件：**
- 使用`v-if`、`v-show`控制显示/隐藏
- 由`<component>`动态切换组件
- 改变特殊的`key`属性

&emsp;&emsp;**限制：** 仅支持单个元素和组件作为插槽内容

&emsp;&emsp;**实现机制：** 通过在特定时机添加或删除CSS类名实现动画效果，配合CSS动画属性或JS监听器钩子使用

&emsp;&emsp;**② 过渡Class类名**

&emsp;&emsp;**默认6种过渡class：**

| 阶段 | 类名 | 说明 |
|------|------|------|
| 进入 | `v-enter-from` | 进入动画起始状态 |
| 进入 | `v-enter-active` | 进入动画生效期间 |
| 进入 | `v-enter-to` | 进入动画结束状态 |
| 离开 | `v-leave-from` | 离开动画起始状态 |
| 离开 | `v-leave-active` | 离开动画生效期间 |
| 离开 | `v-leave-to` | 离开动画结束状态 |

&emsp;&emsp;**自定义过渡class：**

&emsp;&emsp;可通过以下属性自定义类名：
- `enter-from-class`、`enter-active-class`、`enter-to-class`
- `leave-from-class`、`leave-active-class`、`leave-to-class`

&emsp;&emsp;**命名空间：** 通过`name`属性可替换默认前缀`v-`，如`<Transition name="fade">`会生成`fade-enter-from`等类名

&emsp;&emsp;**③ 过渡事件钩子**

&emsp;&emsp;**8种事件钩子：**

| 阶段 | 事件钩子 | 说明 |
|------|----------|------|
| 进入 | `@before-enter` | 元素插入前 |
| 进入 | `@enter` | 元素插入时 |
| 进入 | `@after-enter` | 进入动画完成后 |
| 进入 | `@enter-cancelled` | 进入动画被取消时 |
| 离开 | `@before-leave` | 元素离开前 |
| 离开 | `@leave` | 元素离开时 |
| 离开 | `@after-leave` | 离开动画完成后 |
| 离开 | `@leave-cancelled` | 离开动画被取消时 |

&emsp;&emsp;**使用说明：** 
- 事件钩子可以与CSS过渡动画结合使用，也可以单独使用
- 使用`:css="false"`属性可以防止CSS规则意外干扰过渡效果

&emsp;&emsp;**④ 过渡效果复用**

&emsp;&emsp;**组件封装方式：** 通过组件封装结合插槽实现过渡效果复用

&emsp;&emsp;**appear属性：** 用于设置节点在初始渲染时就应用过渡效果

```js
// 子组件
<Transition name="my-transition" @enter="onEnter" @leave="onLeave" appear>
    <slot />
</Transition>

// 父组件引用
<MyTransition>
    <div v-if="show">内容</div>
</MyTransition>
```

&emsp;&emsp;④ 其他用法：
```js
// 组件间过渡
<Transition name="fade" mode="out-in">
    <component :is="activeComponent"></component>
</Transition>
// 动态过渡
<Transition :name="fade">
    ...
</Transition>
// key属性强制渲染
```

## 2、`<TransitionGroup>`过渡和动画组件合集
&emsp;&emsp;① `<TransitionGroup>`的主要特点：  

&emsp;&emsp;&emsp;该标签不会作为一盒渲染容器，但是可以通过tag属性指定一个标签作为渲染容器元素；

&emsp;&emsp;&emsp;在此标签中过渡模式不可用，因为容器中的元素不再是互斥切换；

&emsp;&emsp;&emsp;容器中列表元素每一个都必须绑定唯一key值；

&emsp;&emsp;&emsp;与CSS过渡动画样式结合，样式会被绑定到容器内元素上；

[动画示例](https://cn.vuejs.org/examples/#list-transition)

## 3、`<KeepAlive>`缓存组件
&emsp;&emsp;① 概述：作为缓存内置组件，其主要作用是避免组件之间在切换时被频繁地创建和销毁，通过缓存可以保证各组件之间的状态和数据被缓存，有效提高性能；

&emsp;&emsp;② 常用属性：`include`、`exclude`、`max`
```js
    <KeepAlive include="a,b">
        <component :is="view"></component>
    </KeepAlive>

    <KeepAlive include="/a|b/">
        <component :is="view"></component>
    </KeepAlive>

    <KeepAlive include="['a','b']" :max="10">
        <component :is="view"></component>
    </KeepAlive>
```
&emsp;&emsp;③ 周期钩子：`onActivated()` 组件挂载时会调用/` onDeactivated()` 组件卸载时会调用；注意周期钩子不适用于keepAlive缓存的根组件；
```js
import { onActivated, onDeactivated } from 'vue'
onActivated(() => {
  // 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
})

onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
})
```

## 4、`<Teleprot>`模板内置组件
&emsp;&emsp;① 概述：该内置组件的主要作用是可以将组件内的一部分模板，传送到指定的外层DOM元素上，比如模态框、遮罩层等组件渲染到body等元素上；

&emsp;&emsp;② 解决问题：通常我们需要元素脱了文档流，需要借助css中定位属性并将元素层级进行设置，这样容易造成全局元素布局异常，而Teleprot原则则可以统一解决这个问题；
```js
// 子组件
  <button @click="open = true">Open Model</button>
  <Teleport to="body">
    <div v-if="open" class="model">
      <p>Hello From The Model</p>
      <button @click="open = false">Close</button>
    </div>
  </Teleport>

// 父组件
    <h3>Teleport模块内置组件</h3>
    <MyModel />
```
## 5、`<Suspense>`异步依赖协调组件

&emsp;&emsp;**① 基本概念**

&emsp;&emsp;用于协调异步依赖的内置组件，可以在组件树上层等待下层多个嵌套组件的异步操作完成后统一渲染

&emsp;&emsp;**② 基本用法**

&emsp;&emsp;**两个插槽：**
- `#default`：异步组件加载完成后显示的内容
- `#fallback`：异步组件加载中显示的占位内容

```js
<Suspense>
  <!-- 异步组件加载完成后显示 -->
  <template #default>
    <AsyncComponent />
  </template>
  
  <!-- 加载中显示 -->
  <template #fallback>
    <div>Loading...</div>
  </template>
</Suspense>
```

&emsp;&emsp;**③ 异步组件定义**

```js
// 方式1：异步导入
const AsyncComponent = defineAsyncComponent(() => import('./AsyncComponent.vue'))

// 方式2：setup中使用async/await
<script setup>
import { ref } from 'vue'

const data = ref(null)

// 异步操作
const fetchData = async () => {
  const response = await fetch('/api/data')
  data.value = await response.json()
}

await fetchData() // 直接在setup中使用await
</script>
```

&emsp;&emsp;**④ 错误处理**

&emsp;&emsp;配合`onErrorCaptured`钩子或错误边界组件处理异步错误

```js
<script setup>
import { onErrorCaptured } from 'vue'

onErrorCaptured((error) => {
  console.error('异步组件加载失败:', error)
  return false // 阻止错误冒泡
})
</script>

<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

&emsp;&emsp;**⑤ 实际应用场景**

&emsp;&emsp;**适用场景：**
- 路由懒加载
- 数据预加载
- 组件异步依赖

&emsp;&emsp;**完整示例：**
```js
<template>
  <Suspense>
    <template #default>
      <UserProfile :user-id="userId" />
    </template>
    <template #fallback>
      <div class="loading">
        <span>用户数据加载中...</span>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
// UserProfile.vue 组件
import { ref } from 'vue'

const props = defineProps(['userId'])
const user = ref(null)

// 异步获取用户数据
const fetchUser = async () => {
  const response = await fetch(`/api/users/${props.userId}`)
  return response.json()
}

user.value = await fetchUser() // 组件挂载前等待数据加载
</script>
```

&emsp;&emsp;**注意事项：**
- 仅在异步组件首次加载时显示fallback
- 支持嵌套使用，但要避免过度嵌套
- 异步错误需要额外的错误处理机制
