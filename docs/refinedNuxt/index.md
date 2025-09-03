## Nuxt入门基础

### 1、NuxtJS是什么？有什么特点？
&emsp;&emsp;NuxtJS是一个基于Vue.js的灵活的通用应用框架，其特性包括自动代码分层、SSR、静态站点生成、异步数据路由等；

&emsp;&emsp;NuxtJS框架集成包括：Vue2、VueRouter、Vuex、Vue服务端渲染、VueMeta；

**注意：** Vue-Meta 是一个 Vue.js 插件，用于在单页面应用（SPA）中动态管理 HTML 的 `<meta>` 标签，它解决了SPA应用因无页面跳转而导致SEO和社交分享元信息缺失的问题；

### 2、NuxtJS安装配置及目录结构
#### 安装配置命令
&emsp;&emsp;**模板项目：** `yern create nuxt-app <项目名称>`

&emsp;&emsp;**新建项目：** `npm install --save nuxt`

#### 目录结构
```js
- assets 资源目录
- components 组件目录
- layouts 布局目录
- middleware 中间件目录
- pages 页面目录
- plugins 插件目录
- static 静态资源目录
- store 状态管理目录
- nuxt.config.js NuxtJs应用的个性化配置
- package.json 依赖关系及对外暴露的脚本接口
```

### 3、NuxtJS常用配置项

&emsp;&emsp;NuxtJS拥有大部分默认配置项，也可以通过 nuxt.config.js 来覆盖默认的配置；

&emsp;&emsp;**常用配置项：** build构建配置、css全局样式及模块或第三方库配置、dev配置应用是开发还是生产模式、env定义客户端和服务端环境变量、generate动态路由参数配置、head配置meta标签、loading定制加载组件、moodules将Nuxt模块添加到项目中、modulesDir定义NuxtJS应用程序的node_modules文件夹、plugins、rootDir配置NuxtJS根目录、server服务器实例变量配置、srcDir配置应用源码目录路径、dir自定义目录配置、transition配置应用过渡效果属性；

