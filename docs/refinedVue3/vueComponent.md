# Vue3.0 深入组件

## 1、组件注册

### ① 全局注册

&emsp;&emsp;**概念：** 在应用的根实例上注册组件，使其在整个应用中的任何地方都可以使用。

&emsp;&emsp;**使用场景：** 适用于在多个组件中频繁使用的基础组件，如按钮、输入框等。

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import MyButton from './components/MyButton.vue'
import MyInput from './components/MyInput.vue'
import MyModal from './components/MyModal.vue'

const app = createApp(App)

// 单个组件注册
app.component('MyButton', MyButton)

// 多个组件链式注册
app
  .component('MyInput', MyInput)
  .component('MyModal', MyModal)

app.mount('#app')
```

```vue
<!-- 在任何组件中都可以直接使用，无需导入 -->
<template>
  <div>
    <MyButton>点击我</MyButton>
    <MyInput placeholder="请输入内容" />
    <MyModal title="提示框" />
  </div>
</template>
```

&emsp;&emsp;**优点：** 注册简单，可在任何组件中使用，无需重复导入。

&emsp;&emsp;**缺点：** 未使用的组件无法在打包时被`tree-shaking`自动移除，依赖关系不明确，可能影响长期可维护性。

```js
// ✅ 可被 Tree-Shaking
import { funcA } from 'moduleA'

// ❌ 整个模块都会被打包（即使只用一个方法）
const _ = require('lodash')

```

### ② 局部注册

&emsp;&emsp;**概念：** 在具体的组件中导入并注册，只能在当前组件中使用。

&emsp;&emsp;**使用场景：** 适用于特定场景下使用的组件，依赖关系明确，便于维护。

```vue
<!-- 选项式API写法 -->
<template>
  <div>
    <UserCard :user="userInfo" />
    <ProductList :products="products" />
  </div>
</template>

<script>
import UserCard from './components/UserCard.vue'
import ProductList from './components/ProductList.vue'

export default {
  // 局部注册组件
  components: {
    UserCard,
    ProductList
  },
  data() {
    return {
      userInfo: { name: '张三', age: 25 },
      products: []
    }
  }
}
</script>
```

```vue
<!-- 组合式API写法 (推荐) -->
<template>
  <div>
    <UserCard :user="userInfo" />
    <ProductList :products="products" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserCard from './components/UserCard.vue'
import ProductList from './components/ProductList.vue'

const userInfo = ref({ name: '张三', age: 25 })
const products = ref([])
</script>
```

&emsp;&emsp;**优点：** 依赖关系明确，支持`Tree-shaking`优化，便于维护和调试。

&emsp;&emsp;**缺点：** 需要在每个使用的组件中重复导入。

### ③ 注册方式对比

| 特性 | 全局注册 | 局部注册 |
|------|----------|----------|
| 使用范围 | 整个应用 | 当前组件 |
| 导入方式 | 一次注册，处处可用 | 按需导入 |
| Tree-shaking | ❌ 不支持 | ✅ 支持 |
| 依赖关系 | 不明确 | 明确 |
| 适用场景 | 基础通用组件 | 特定功能组件 |

## 2、props使用

&emsp;&emsp;① props的声明：有两种声明方式，一种是常规的数组类型声明，在`setup()`方法使用时；另一种则是使用`defineProps宏`来声明，适用于`<script setup>`标签使用时；声明的值的类型可以是字符串，但更推荐使用对象声明，显示值的类型默认值等信息；
```js
// 在TypeScript中则使用类型标注来声明props;
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

## 3、Props响应解构
&emsp;&emsp;`Vue` 的响应系统基于属性访问跟踪状态的使用情况，但是注意在`watch侦听器`中监听`props`不能直接绑定，也需要将其返回为一个`getter`值；若需要传递结构的`prop`到外部函数中并保持响应性则需要用到`useComposable()`方法；
```js
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // 在 3.5 之前只运行一次
  // 在 3.5+ 中在 "foo" prop 变化时重新执行
//在3.4版本下则需要声明props.foo
  console.log(foo)
})

watch(
  () => props.message,
  (newVal, oldVal) => {
    console.log("newVal", newVal);
    console.log("oldVal", oldVal);
  }
);
```

## 4、单向数据流
&emsp;&emsp;`props`始终遵循单向数据流的原则，只有在父组件中才可以更新`props`对应的依赖，从而也避免了子组件会意外修改父组件状态的情况使数据流变得混乱难以理解；

&emsp;&emsp;但在某些情况下需要在子组件中结合`props`传入的值进行修改，可以做一下处理，如：子组件修改`Props`的方式：重新定义一个局部组件，在`props`上获取初值；使用计算属性对`props`值进一步转换返回一个计算属性值；

&emsp;&emsp;组件修改Props并同步到父组件：
```html
<!-- 方法一： -->
<!-- 父组件 -->
<ChildComp v-model:title="parentValue"  v-model:content="pageContent"/>

<!-- 子组件 -->
<script setup>
const props = defineProps(['title','content'])
const emit = defineEmits(['update:title','update:content'])

function updateValue(newVal) {
  emit('update:modelValue', newVal)
}
</script>
<!-- 方法二： -->
<!-- 使用VueUse代码库 -->
<script setup>
import { useVModel } from '@vueuse/core'

const props = defineProps(['value'])
const emit = defineEmits(['update:value'])

const valueProxy = useVModel(props, 'value', emit)
</script>
```

## 5、组件间事件
&emsp;&emsp;① 触发及监听事件：在子组件中可以通过创建函数触发父组件中的`emits`函数，也可以直接在标签内联中进行`$emits`触发；
```template
<!-- 直接触发事件 -->
<button @click="$emit('someEvent')">Click</button>
<!-- 事件绑定监听 -->
 <MyComponent @some-event="callback" />
```

**注意：** 事件命名可以使用camelCase命名，也可以使用kebab-case命名；组件触发的事件没有冒泡机制，所以只能监听直接子组件触发的事件，平级组件或者跨组件多层嵌套的组件之间通信只能使用外部事件总线如EventBus，或者全局状态管理方案。

&emsp;&emsp;② 事件参数：`emits` 选项和 `defineEmits()` 宏还支持对象语法。通过 `TypeScript` 为参数指定类型，它允许我们对触发事件的参数进行验证；
```template
<!-- 父组件 -->
<button @click="$emit('increaseBy', 1)">
  Increase by 1
</button>
<!-- 子组件 -->
 <MyButton @increase-by="(n) => count += n" />
```

&emsp;&emsp;③ 事件声明触发：在Vue3中可以使用`defineEmits()`宏来声明触发的事件；

```vue
<script setup lang='ts'>
  // 运行时
  const emit = defineEmits(['change', 'update'])

  // 基于选项声明
  const emits = defineEmits({
    change: (id:number) => {
      // 表明验证通过或失败
    },
    update: (value:string) => {
      // 表明验证通过或失败
    }
  })

  // 基于类型标注
  const emit = defineEmits<{
    (e: 'change', id: number): void
    (e: 'update', value: string): void
  }>()
</script>
```
&emsp;&emsp;③ 事件校验：同`props`相同，事件校验也可以采用对象类型的方式进行，通过把事件赋值为一个函数，接受传入的内容然后进行判断并返回`boolean`值来判断校验是否成功；
```vue
<script setup>
const emit = defineEmits({
  // 没有校验
  click: null,

  // 校验 submit 事件
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```
## 6、组件缓存

### ① 动态组件 - `:is` 属性

&emsp;&emsp;**概念：** 使用`:is`属性可以在多个组件间进行动态切换，值可以是注册的组件名或导入的组件对象。

```vue
<!-- 基础动态组件示例 -->
<template>
  <div>
    <!-- 切换按钮 -->
    <div class="tab-buttons">
      <button 
        v-for="tab in tabs" 
        :key="tab.name"
        :class="{ active: currentTab === tab.name }"
        @click="currentTab = tab.name"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 动态组件区域 -->
    <div class="tab-content">
      <component :is="currentTab" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HomeView from './views/HomeView.vue'
import AboutView from './views/AboutView.vue'
import ContactView from './views/ContactView.vue'

const currentTab = ref('HomeView')

const tabs = [
  { name: 'HomeView', label: '首页' },
  { name: 'AboutView', label: '关于' },
  { name: 'ContactView', label: '联系' }
]
</script>
```

### ② KeepAlive 组件缓存

&emsp;&emsp;**概念：** `<KeepAlive>`组件可以缓存被切换掉的组件实例，保持组件状态不被销毁。

```vue
<!-- 基础KeepAlive使用 -->
<template>
  <div>
    <div class="controls">
      <button @click="currentView = 'UserList'">用户列表</button>
      <button @click="currentView = 'UserDetail'">用户详情</button>
      <button @click="currentView = 'UserSettings'">用户设置</button>
    </div>

    <!-- 使用KeepAlive缓存组件 -->
    <KeepAlive>
      <component :is="currentView" />
    </KeepAlive>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserList from './components/UserList.vue'
import UserDetail from './components/UserDetail.vue'
import UserSettings from './components/UserSettings.vue'

const currentView = ref('UserList')
</script>
```

### ③ KeepAlive 高级用法

```vue
<!-- 条件缓存 - include/exclude -->
<template>
  <div>
    <!-- 只缓存指定组件 -->
    <KeepAlive :include="['UserList', 'UserDetail']">
      <component :is="currentView" />
    </KeepAlive>

    <!-- 排除指定组件不缓存 -->
    <KeepAlive :exclude="['UserSettings']">
      <component :is="currentView" />
    </KeepAlive>

    <!-- 限制缓存实例数量 -->
    <KeepAlive :max="3">
      <component :is="currentView" />
    </KeepAlive>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentView = ref('UserList')
</script>
```

### ④ KeepAlive 生命周期钩子

```vue
<!-- 子组件中使用缓存生命周期 -->
<template>
  <div>
    <h3>用户列表</h3>
    <p>当前搜索关键词: {{ searchKeyword }}</p>
    <input v-model="searchKeyword" placeholder="搜索用户" />
    <ul>
      <li v-for="user in filteredUsers" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onActivated, onDeactivated, onMounted } from 'vue'

const searchKeyword = ref('')
const users = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' }
])

const filteredUsers = computed(() => {
  return users.value.filter(user => 
    user.name.includes(searchKeyword.value)
  )
})

// 组件首次挂载
onMounted(() => {
  console.log('UserList组件挂载')
})

// 组件被激活时（从缓存中恢复）
onActivated(() => {
  console.log('UserList组件激活 - 搜索关键词:', searchKeyword.value)
  // 可以在这里刷新数据或执行其他操作
})

// 组件被停用时（进入缓存）
onDeactivated(() => {
  console.log('UserList组件停用 - 保存搜索状态')
  // 可以在这里保存状态或清理操作
})
</script>
```

### ⑤ 实际应用场景示例

```vue
<!-- 选项卡应用 - 保持表单状态 -->
<template>
  <div class="tab-container">
    <!-- 选项卡导航 -->
    <nav class="tab-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        {{ tab.title }}
        <span v-if="tab.hasChanges" class="dot">●</span>
      </button>
    </nav>

    <!-- 选项卡内容 - 使用KeepAlive保持表单状态 -->
    <div class="tab-content">
      <KeepAlive>
        <component 
          :is="activeTab" 
          @form-change="handleFormChange"
        />
      </KeepAlive>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PersonalInfo from './forms/PersonalInfo.vue'
import ContactInfo from './forms/ContactInfo.vue'
import PreferenceSettings from './forms/PreferenceSettings.vue'

const activeTab = ref('PersonalInfo')

const tabs = ref([
  { key: 'PersonalInfo', title: '个人信息', hasChanges: false },
  { key: 'ContactInfo', title: '联系方式', hasChanges: false },
  { key: 'PreferenceSettings', title: '偏好设置', hasChanges: false }
])

const switchTab = (tabKey) => {
  activeTab.value = tabKey
}

const handleFormChange = (tabKey) => {
  const tab = tabs.value.find(t => t.key === tabKey)
  if (tab) {
    tab.hasChanges = true
  }
}
</script>

<style scoped>
.tab-nav {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.tab-nav button {
  padding: 10px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  position: relative;
}

.tab-nav button.active {
  background: #007bff;
  color: white;
}

.dot {
  color: #ff4444;
  margin-left: 5px;
}

.tab-content {
  padding: 20px;
  min-height: 400px;
}
</style>
```

### ⑥ KeepAlive vs 普通组件对比

```vue
<!-- 对比示例：显示缓存效果 -->
<template>
  <div class="comparison">
    <div class="section">
      <h3>无缓存 (每次都重新创建)</h3>
      <button @click="showNormal = !showNormal">
        {{ showNormal ? '隐藏' : '显示' }}计数器
      </button>
      <Counter v-if="showNormal" title="普通组件" />
    </div>

    <div class="section">
      <h3>有缓存 (保持状态)</h3>
      <button @click="showCached = !showCached">
        {{ showCached ? '隐藏' : '显示' }}计数器
      </button>
      <KeepAlive>
        <Counter v-if="showCached" title="缓存组件" />
      </KeepAlive>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Counter from './Counter.vue'

const showNormal = ref(false)
const showCached = ref(false)
</script>
```

```vue
<!-- Counter.vue 组件 -->
<template>
  <div class="counter">
    <h4>{{ title }}</h4>
    <p>计数: {{ count }}</p>
    <button @click="count++">+1</button>
    <button @click="count--">-1</button>
    <p><small>创建时间: {{ createTime }}</small></p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps(['title'])

const count = ref(0)
const createTime = ref('')

onMounted(() => {
  createTime.value = new Date().toLocaleTimeString()
  console.log(`${props.title} 组件已创建`)
})
</script>
```

### ⑦ 使用建议

| 场景 | 是否使用KeepAlive | 原因 |
|------|------------------|------|
| 表单组件 | ✅ 建议使用 | 保持用户输入状态 |
| 列表页面 | ✅ 建议使用 | 保持滚动位置和筛选条件 |
| 图表组件 | ✅ 建议使用 | 避免重新渲染，提升性能 |
| 实时数据组件 | ❌ 不建议 | 需要实时更新数据 |
| 一次性组件 | ❌ 不建议 | 避免内存占用 |

## 7、defineModel()宏

&emsp;&emsp;在父组件中可以使用`v-model指令`进行双向数据绑定，而在子组件中推荐使用`defineModel()宏+v-model`，因为这种方式可以起到父子组件变量之间双向绑定的作用；
```js
// 多v-model值绑定及解构赋值
<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName')
const [lastName, lastNameModifiers] = defineModel('lastName')

console.log(firstNameModifiers) // { capitalize: true }
console.log(lastNameModifiers) // { uppercase: true }
</script>
```


## 8、透传Attribute
&emsp;&emsp;定义：透传指的是传递给一个组件却没有被`props`或`emits`声明的属性或事件，如`class类`、`style样式`等，这些就是透传属性；若父子组件的透传属性名称相同则会被合并；同样绑定在引入子组件上的`v-on事件`也会发生透传；在模板表达式中可以在直接用 `$attrs` 访问到透传属性；

&emsp;&emsp;禁止透传：在组件选项中设置`defineOptions()`的`inheritAttrs:false`就可以禁止透传继承；在JS中获取透传属性：使用引入API：useAttrs即可在js中获取透传属性

## 9、插槽

&emsp;&emsp;① 具名插槽：一种将多个插槽内容传入到各自目标插槽的出口，就是具名插槽；由`v-slot:name`声明自定义的具名插槽，也可以简写为`#name`；

&emsp;&emsp;② 条件插槽：目的是为了根据内容是否被传入了插槽来渲染内容，需要对传入状态做出判断，此时就需要用到`$slots`结合v-if使用；如：`$slots.name`

&emsp;&emsp;③ 具名作用域插槽：有时需要在父组件的插槽区域获取子组件的数据状态，即可使用作用域插槽，通过在子组件对应的`slot`上绑定属性，然后在父组件中通过具名暴露出插槽上所绑定的数据状态；相比于`Vue2`的作用域插槽更加高效简洁；

&emsp;&emsp;④ 使用插槽的优势总结：

&emsp;&emsp;&emsp;父组件中绑定在插槽事件也可以通过插槽在子组件中渲染的同时依然绑定，避免跨组件间的事件通讯；

&emsp;&emsp;&emsp;组件中制定模块的内容和样式等控制权交由父组件控制；
```js
    <h3>透传+具名插槽+作用域插槽</h3>
    <childBlock @click="bindBtn">
      <template #header="header"> 测试具名插槽Header {{ header }}</template>
      <template>测试默认具名插槽Default</template>
      <template #footer="footer"> 测试具名插槽Footer {{ footer }}</template>
    </childBlock>
```
&emsp;&emsp;⑤ 案例：高级列表组件渲染


## 10、依赖注入
&emsp;&emsp;① 概述：在多层嵌套的组件应用中，深层子组件若想获取远端父组件的数据是，通常需要props逐级递传，这会导致数据状态在传输过程中管理混乱；而依赖注入则通过provide和inject有效的解决逐级递传的问题，通过在父组件或者应用层根组件提供依赖即可在需要的子组件中注入使用；

&emsp;&emsp;② 应用层的依赖注入：

&emsp;&emsp;③ 依赖注入数据动态绑定：

&emsp;&emsp;⑤ 如何避免依赖注入冲突：

## 11、异步组件 defineAsyncComponent

### ① 什么是异步组件？

&emsp;&emsp;**简单理解：** 就是"用到的时候才加载"的组件，而不是一开始就把所有组件都加载进来。

&emsp;&emsp;**为什么要用：** 让网页打开更快，特别是那些很大的组件（比如图表、编辑器）可以先不加载。

### ② 基础用法

```vue
<template>
  <div>
    <button @click="showChart = !showChart">
      {{ showChart ? '隐藏' : '显示' }}图表
    </button>
    
    <!-- 只有点击按钮后才会加载Chart组件 -->
    <Chart v-if="showChart" />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

// 异步组件 - 用到时才加载
const Chart = defineAsyncComponent(() => 
  import('./components/Chart.vue')
)

const showChart = ref(false)
</script>
```

### ③ 添加加载状态

```vue
<template>
  <div>
    <button @click="loadDashboard">加载仪表板</button>
    <Dashboard v-if="showDashboard" />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

// 带加载状态的异步组件
const Dashboard = defineAsyncComponent({
  loader: () => import('./components/Dashboard.vue'),
  loadingComponent: {
    template: '<div>正在加载中...</div>'
  },
  delay: 200,  // 200ms后才显示loading
  timeout: 5000  // 5秒超时
})

const showDashboard = ref(false)

const loadDashboard = () => {
  showDashboard.value = true
}
</script>
```

### ④ 在路由中使用（最常用）

```js
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      // 普通同步加载
      component: () => import('../views/Home.vue')
    },
    {
      path: '/about',
      name: 'About',
      // 异步加载 - 只有访问这个页面才加载
      component: () => import('../views/About.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      // 带加载状态的异步加载
      component: defineAsyncComponent({
        loader: () => import('../views/Dashboard.vue'),
        loadingComponent: {
          template: '<div class="loading">页面加载中...</div>'
        }
      })
    }
  ]
})
```

### ⑤ 实际应用场景

```vue
<template>
  <div>
    <!-- 模态框内容 - 点击时才加载 -->
    <button @click="showModal = true">打开设置</button>
    <SettingsModal v-if="showModal" @close="showModal = false" />
    
    <!-- 选项卡内容 - 切换时才加载 -->
    <div class="tabs">
      <button @click="activeTab = 'users'">用户管理</button>
      <button @click="activeTab = 'products'">商品管理</button>
    </div>
    <component :is="currentTab" />
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'

// 模态框异步加载
const SettingsModal = defineAsyncComponent(() => 
  import('./components/SettingsModal.vue')
)

// 选项卡组件异步加载
const tabs = {
  users: defineAsyncComponent(() => import('./admin/UserManagement.vue')),
  products: defineAsyncComponent(() => import('./admin/ProductManagement.vue'))
}

const showModal = ref(false)
const activeTab = ref('users')

const currentTab = computed(() => tabs[activeTab.value])
</script>
```

### ⑥ 何时使用异步组件？

| 组件类型 | 是否使用 | 原因 |
|---------|----------|------|
| 路由页面 | ✅ **强烈推荐** | 减少首屏加载时间 |
| 模态框/弹窗 | ✅ **推荐** | 用户可能不会打开 |
| 图表组件 | ✅ **推荐** | 图表库文件通常很大 |
| 富文本编辑器 | ✅ **推荐** | 编辑器文件很大 |
| 头部导航 | ❌ **不推荐** | 用户马上就能看到 |
| 按钮、输入框 | ❌ **不推荐** | 基础组件应该立即可用 |

### ⑦ 简单的错误处理

```vue
<template>
  <div>
    <button @click="loadComponent">加载组件</button>
    <HeavyComponent v-if="showComponent" />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

const HeavyComponent = defineAsyncComponent({
  loader: () => import('./components/HeavyComponent.vue'),
  errorComponent: {
    template: '<div style="color: red;">组件加载失败，请刷新重试</div>'
  },
  timeout: 3000
})

const showComponent = ref(false)

const loadComponent = () => {
  showComponent.value = true
}
</script>
```

### ⑧ 小贴士

1. **优先考虑路由级组件**：这是最常见和最有效的使用场景
2. **不要过度使用**：小的、常用的组件没必要异步加载
3. **加载状态很重要**：让用户知道正在加载，提升体验
4. **合理设置超时时间**：避免用户等待太久
