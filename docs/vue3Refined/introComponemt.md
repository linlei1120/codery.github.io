# Vue3.0 内置组件

## 1、`<Transition>`过渡和动画组件
&emsp;&emsp;① 原理：`<Transition>`过渡动画内置组件在任意别的组件中都可以使用，触发条件包括：使用`v-if`、`v-show`、由特殊动态元素`<component>`切换的组件、改变特殊的`key`属性；但仅支持单个元素和组件作为插槽内容；

&emsp;&emsp;组件会搭配`.css动画属性`或`JS监听器`钩子使用，其实现原理为若元素在插入或删除时，且有CSS动画要样式，则是通过在特点时机添加或删除这些样式实现；若都没有则会在下一次动画帧执行；

&emsp;&emsp;② 6种进入和离开过渡效果class选择器：`v-enter-from`、`v-enter-active`、`v-enter-to`、`v-leave-from`、`v-leave-from`、、
`v-leave-to`;分别表示进入和离开时的动画起始、生效、结束状态；可以通过`name属性`为`transition命名来替换通用符号;

&emsp;&emsp;&emsp;除此之外还包含了6种自定义的过渡class选择器：`enter-active-class`、`enter-from-class`、`enter-to-class`、`leave-active-class`、`leave-from-class`、`leave-to-class`
```js
    <Transition
      name="transName"
      enter-active-class="animated-active"
      leave-from-class="animated-from"
      :duration="{ enter: 2000, leave: 10000 }"
      @before-enter="beforeEnter"
    >
      <p v-if="showTrans">SSSSSSS</p>
    </Transition>
    .transName-enter-active,
    .transName-leave-active {
        transition: opacity 0.5s;
    }
    .transName-enter-from,
    .transName-leave-to {
        opacity: 0;
    }
```
&emsp;&emsp;③ 8种过渡事件钩子：`@before-enter` 、`@enter`、`@after-enter`、`@enter-cacelled`、`@before-leave`、`@leave`、`@after-leave`、`@leave-cancelled`;这些钩子可以和CSS过渡动画结合使用，也可以单独使用；

&emsp;&emsp;&emsp;注意：`:class=false`属性可以防止css规则意外干扰过渡效果;

&emsp;&emsp;③ 过渡效果复用：过渡效果可以通过组件封装结合插槽的方式进行复用；`appear`属性用于设置某个节点在渲染时就应用过渡效果；
```js
    //子组件
    <Transition name="my-transition" @enter="onEnter" @leave="onLeave" appear>
        <slot />
    </Transition>
    // 父组件引用
    <MyTransition>
      <div v-if="showTrans">过渡组件复用:HAHAHAHA</div>
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

## 3、`<KeepAlive>`缓存组件

## 4、`<Teleprot>`模板内置组件

## 5、`<Suspense>`异步依赖协调组件