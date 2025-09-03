## NuxtJS路由
#### NuxtJS会根据pages目录结构自动生成vue-router路由配置，通常使用`<nuxt-link>`标签进行路由v切换；常用的路由类型包括：基础路由、动态路由、嵌套路由、动态嵌套路由；其中会涉及到中间件、过渡动效等模块配置。

## 1、基础路由
#### 基础路由根据pages目录结构自动生成，目录配置结构如下：
```js
router: {
  routes: [
    {
      name: 'index',
      path: '/',
      component: 'pages/index.vue'
    },
    {
      name: 'user',
      path: '/user',
      component: 'pages/user/index.vue'
    },
    {
      name: 'user-one',
      path: '/user/one',
      component: 'pages/user/one.vue'
    }
  ]
}
```

## 2、动态路由
#### NuxtJS中动态路由需要根据对于的`以下划线为前缀`的Vue目录和文件：但使用`generate`命令则会忽略动态路由创建的配置；
```js
pages/
--| _slug/
-----| comments.vue
-----| index.vue
--| users/
-----| _id.vue
--| index.vue
```

对应的动态路由配置表：
```js
router: {
  routes: [
    {
      name: 'index',
      path: '/',
      component: 'pages/index.vue'
    },
    {
      name: 'users-id',
      path: '/users/:id?',
      component: 'pages/users/_id.vue'
    },
    {
      name: 'slug',
      path: '/:slug',
      component: 'pages/_slug/index.vue'
    },
    {
      name: 'slug-comments',
      path: '/:slug/comments',
      component: 'pages/_slug/comments.vue'
    }
  ]
}
```
路由参数校验：
```js
// pages/user/_id.vue
export default {
  validate({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id)
  }
}
//如果校验方法返回的值不为 true或Promise中 resolve 解析为false或抛出 Error ， Nuxt.js 将自动加载显示 404 错误页面或 500 错误页面。
```

## 3、嵌套路由
#### 嵌套路由需要创建一个与文件夹同名且同级目录的`.vue`文件来存放子视图组件。
目录结构：
```js
pages/
--| users/
-----| _id.vue
-----| index.vue
--| users.vue
```
生成后的路由数据：
```js
router: {
  routes: [
    {
      path: '/users',
      component: 'pages/users.vue',
       children: [
        {
          path: '',
          component: 'pages/users/index.vue',
          name: 'users'
        },
        {
          path: ':id',
          component: 'pages/users/_id.vue',
          name: 'users-id'
        }
      ]
    }
  ]
}
```

## 4、动态嵌套路由
#### 动态嵌套路由具有多级页面结构，深度链接，动态内容渲染等特点，可以提升灵活性和SEO效果。

#### (1) 结构规则：
- 动态参数：目录和文件都可使用_声明
- 嵌套路由：父级需同名目录 + 子路由.vue 文件 
- 用` <NuxtPage> `嵌套子路由
```js
pages/
│
├── blog/               # 父路由路径：/blog
│   ├── [category]/     # 动态分类层：/blog/vue
│   │   └── [post].vue  # 动态文章层：/blog/vue/nuxt-routing
│   └── index.vue       # 父路由默认页：/blog
// 生成路由
/blog → pages/blog/index.vue
/blog/:category → pages/blog/[category]/index.vue（需自行创建）
/blog/:category/:post → pages/blog/[category]/[post].vue
```
#### (2) 参数获取
子页面中通过`useRoute()`和`$route`访问动态参数：
```js
<!-- pages/blog/[category]/[post].vue -->
const route = useRoute()
console.log(route.params.category) // 输出 URL中的分类（如 'vue'）
console.log(route.params.post)     // 输出 URL中的文章名（如 'nuxt-routing'）

```