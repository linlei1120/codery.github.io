# Vue3.0
## 入门基础

### 1、Vue的特性概述
&emsp;&emsp;① 声明式渲染：它是一种编程范式，只注重结果，由框架控制细节；而原生开发中的`命令式渲染`则更加关注过程，需要开发者控制每一步；
```js
//声明式渲染
<p v-for="item in list">{{item}}</p>
//命令时渲染
<ul id='list'>
    <li class="item"></li>
</ul>
<script>
    let list = [1,2,3]
    let itemList = null;
    let list = document.getElementById('list')
    list.forEach(item => {
        itemList += `<li class="item">${item}</li>`
    })
    list.innerHTML = itemList
</script>
```
&emsp;&emsp;② 单组件应用：每一个应用都会有一个根组件如`App.vue`，其他的所有逻辑功能组件都是它的子组件并互相嵌套，通过`createApp(根组件)`创建后再由`mount('#app')`方法进行挂载应用，`createApp()`允许一个页面中创建多个Vue实例，并分别进行挂载；
挂载应用需要在所有应用配置和资源注册完成后方可执行调用；
```vue
import { createApp } from 'vue'
import App from './App'

const app.createApp(App)
app.mount('#app')
```
关键词：应用实例、根组件、挂载应用、应用配置，多应用实例挂载

### 2、选项式API和组合式API
&emsp;&emsp;**① 选项是API：** 该方式以`组件实例`的概念为核心，也就是this；

&emsp;&emsp;&emsp; **特点包括：** 需要多个选项的对象来描述组件的逻辑，如`data()`、`methods`、`computed()`等；选项多定义的属性都会暴露在当前函数的this上，并指向当前的组件实例；

&emsp;&emsp;**② 组合式API：** 直接在函数作用域内定义响应式状态变量，并将从多个函数中获得的状态组合起来处理复杂问题；

&emsp;&emsp;&emsp; **特点包括：** 采用导入API函数的方式来描述组件逻辑；功能业务内代码的聚合性越强，方便更灵活的组织和重用逻辑代码；`<script setup>`中的`setup`作为一个属性标识用来告诉Vue在编译时进行一些处理，可以更简洁的使用选项式API开发；

### 3、计算属性computed的变化
&emsp;&emsp;`computed`主要用于派生状态，根据依赖项动态计算并返回一个计算数学`ref`可以通过`.value`读取，他应该是一个纯函数，即只依赖于其依赖项，而不应该产生副作用即不可执行其他操作如状态修改等；而`watch`则可以执行修改状态/触发异步等操作；

&emsp;&emsp;计算属性和方法返回的区别：计算属性值会基于其响应式依赖被缓存，只有当所依赖的状态发生更新时才会重新计算；相较于方法返回，在进行大量数据计算时更加节省性能；

&emsp;&emsp;计算属性默认是只读的，但是也可以通过getter、setter来重新创建一个可写的计算属性；同样也可以在getter中获取上一个值；但是以上方式都不建议使用，因为每一次更新都会重新触发计算；且计算属性的值作为ref派生出来的临时`快照`，修改也是没有意义的；
```js
//可写计算属性
const firstName = ref("John");
const lastName = ref("Doe");
//可写的计算属性
const fullName = computed({
  get(previous) {
    return firstName.value + "" + lastName.value;
  },
  set(newValue) {
    //解构赋值
    [firstName.value, lastName.value] = newValue.split(" ");
  }
});
//调用方法修改ref，内容会发生变化
function ChangeName() {
    firstName.value = "林"
    lastName.value = "磊"
}
```
**注意：** 在计算属性的最佳实践中：不要改变其他状态、在 getter 中做异步请求或者更改 DOM等！
### 4、侦听器watch和watchEffect
&emsp;&emsp;**① watch：** 侦听器有三个参数分别是监听的值、变化的新值、变化的旧值，适合更加精准的控制监听数据源，监听的值可以是一个或者多个

&emsp;&emsp;&emsp; **特点包括：** 惰性执行：回调函数默认不会立即执行，而是监听的数据源发生变化是才会触发；支持配置深度监听`{deep:true}`，但是可以通过设置`immediate: true`强制侦听器立即执行；可以设置侦听器仅仅只在源变化时触发一次，使用once:true属性;

&emsp;&emsp;&emsp; **适用于：** 当你需要监听特定的响应式数据，并且需要访问旧值和新值；当你需要惰性执行（即只在数据变化时执行）；当你需要深度监听对象或数组；

&emsp;&emsp;**① watchEffect：** 会自动追踪回调函数中使用的全部响应式数据，且不需要指定特定的依赖

&emsp;&emsp;&emsp; **特点包括：** 不提供旧值，只关注当前状态；

&emsp;&emsp;&emsp; **适用于：** 当你希望回调函数立即执行；当你不需要旧值，只关注当前状态；

补充：
1、onWatcherCleanup()3.5+：用于避免在进行副作用的过程中监听依赖就发生了变化，该方法注册一个清理函数，当侦听器失效并准备重新运行时会被调用，且该方法必须在同步函数中执行，不能再await异步中使用：

2、watchPostEffect()方法：在侦听器回调中能访问被 Vue 更新之后的所属组件的 DOM可以设置`flush: 'post'`属性或使用该方法；

3、同步侦听器：同步触发的侦听器，会在 Vue 进行任何更新之前触发，设置 `flush: 'sync'`属性
```js
//deep属性启用深度监听，可以设置数字来控制深度监听层数
//immediate属性用于开启立即回调，关闭默认惰性特性
watch(count, (newVal, oldVal) => {
  console.log("newVal", newVal);
  console.log("oldVal", oldVal);
  console.log("count", count.value);
},{deep:true,immediate:true});

watchEffect(() => {
  console.log("countssss", count.value);
  console.log("isShow", isShow.value);
  console.log("todo", todo.value);
});
//补充
import { watch, onWatcherCleanup } from 'vue'
watch(id, (newId) => {
  const controller = new AbortController()
  fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
    // 回调逻辑
  })
  onWatcherCleanup(() => {
    // 终止过期请求
    controller.abort()
  })
})
```
### 5、组件通信的方式
&emsp;&emsp;**① Props：** 定义props使用`defineProps方法，它是一种编译时宏不需要导入即可直接使用，在父组件自定义绑定属性后，在子组件中使用`defineProps`声明属性后直接使用；

&emsp;&emsp;**② Emits使用：** 定义emits同样是使用编译时宏`defineEmits()`，定义后可携带参数触发事件`emits(eventName,params)`；
```js
// 子组件中
// props
const props = defineProps({
    msg:String,
    count:Number
})
//emits
const emits = defineEmits(["printMessage"]);
const handleEmits = () => {
  emits("printMessage", { value: "HAHAHAHAH" });
};
```
**解释：** 编译时宏（Compile-Time Macros）是指在 Vue 模板编译阶段被处理的特殊标记或指令。这些宏在编译时会被 Vue 的编译器解析并转换为实际的 JavaScript 代码，而不是在运行时处理。主要目的是减少开销，提升性能，简介语法；

### 6、插槽slot应用
&emsp;&emsp;插槽可以使父组件在引入的子组件中加入内容并由solt作为模板片段的出口传递到子组件中进行展示，当父组件没有模板片段时也可以在slot插槽中定义默认值
```js
//父组件
<Children>定义文本传递</Children>
//children组件
<slot>默认文本：Fallback content</slot>
//children+定义文本传递
```

## 模板语法

### 1、模板语法特性概述

### 2、插值文本和v-html指令

### 3、Arribute属性绑定

### 4、指令使用

### 5、绑定动态参数

### 6、修饰符使用

## 响应式基础

### 1、声明响应式状态

### 2、为什么使用ref?

### 3、nextTick()全局API

### 4、深度监听响应式

### 5、fallowRef()的浅层作用

## 类与样式动态绑定
