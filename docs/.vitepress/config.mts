import { defineConfig } from "vitepress";

export default defineConfig({
  base:'/codery.github.io/',
  title: "Codery's 的开发文档",
  description: "Codery's Blog Site",
  // header标签里面插入的内容
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  themeConfig: {
    // 网站的logo
    logo: "/logo.svg",
    // 文章右侧大纲目录
    outline: {
      level: [2, 6],
      label: "目录",
    },
    //自定义上下页名
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    // 主题
    darkModeSwitchLabel: "深浅模式",
    // 返回顶部label
    returnToTopLabel: "返回顶部",
    // 搜索
    search: {
      provider: "local",
    },
    // 页脚
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present China Codery",
    },
    // 文档的最后更新时间
    // lastUpdated: {
    // text: "Updated at",
    // formatOptions: {
    //     dateStyle: "full",
    //     timeStyle: "medium",
    //   },
    // },
    nav: [
      { text: "首页", link: "/" },
      { text: "前端开发文档",items:[
        {
          text: '前端面经',
          link: '/interview/h5css-skill',
        },{
          text: 'Vue3.0精读文档',
          link: '/refinedVue3/index',
        },{
          text: 'NuxtJS精读文档',
          link: '/refinedNuxt/index',
        },{
          text: 'TypeScript精读文档',
          link: '/refinedTS/index',
        },{
          text: 'React开发文档',
          link: '/react/reactFiles',
        },{
          text: 'Flutter开发文档',
          link: '/flutter/flutterFiles',
        },{
          text: '前端开发规范',
          link: '/devGuide/index',
        },{
          text: '算法题解',
          link: '/algorithm/addAlg',
        }] },
        { text: "后端开发文档",items:[
          {
            text: 'Docker文档',
            link: '/endFront/dockerStudy/dockerIndex',
          },
          {
            text: 'K8S文档',
            link: '/endFront/k8s-study/k8sIndex',
          }] },
      { text: "AI知识文库", link: "/aiFiles/index" },
      { text: "工作笔记",items:[
        {
          text: '2025年4月',
          link: '/workNote/2025年4月',
        },{
          text: '2025年3月',
          link: '/workNote/2025年3月',
        },{
          text: '2025年2月',
          link: '/workNote/2025年2月',
        },{
          text: '2025年1月',
          link: '/workNote/2025年1月',
        },
        
        {
          text: '2024年12月',
          link: '/workNote/2024年12月',
        },] },
      { text: "工具导航栏", link: "/toolsFiles/tools-list" },
      { text: "工作项目集", link: "/projectFiles/project-list" }
    ],

    sidebar: {
      '/interview/': [{
        text: '前端面经',
          items: [
              { text: 'H5/CSS3知识积累', link: '/interview/h5css-skill' },
              { text: 'JS/TS知识积累', link: '/interview/js-skill' },
              { text: 'ES6知识积累', link: '/interview/ES6-skill' },
              { text: 'Vue知识积累', link: '/interview/vue-skill' },
              { text: 'Hybrid知识积累', link: '/interview/hybrid-skill' },
              { text: '常用面试积累', link: '/interview/interview-skill' },
              { text: '实践知识积累', link: '/interview/practice-skill' }
          ]
      }],
      '/refinedTS/': [{
        text: 'TS入门基础',
          items: [
              { text: 'Interface接口', link: '/refinedTS/tsInterface' },
              { text: 'Class类', link: '/refinedTS/tsClass' }
          ]
      }],
      '/refinedNuxt/': [{
        text: 'NuxtJS精读文档',
          items: [
              { text: 'NuxtJS入门基础', link: '/refinedNuxt/index' },
              { text: 'NuxtJS路由', link: '/refinedNuxt/nuxtRouter' },
          ]
      }],
      '/refinedVue3/': [{
        text: 'Vue3.0精读',
          items: [
              { text: '深入组件', link: '/refinedVue3/vueComponent' },
              { text: '逻辑复用', link: '/refinedVue3/logicReuse' },
              { text: '内置组件', link: '/refinedVue3/introComponemt' },
              { text: '应用模块化', link: '/refinedVue3/applyMoudel' },
              { text: '最佳实践', link: '/refinedVue3/bestPractice' },
              { text: 'Vue3结合TS', link: '/refinedVue3/Vue3TS' },
              { text: 'Vue进阶主题', link: '/refinedVue3/vueAdvance' }
              
          ]
      }],
      '/devGuide/': [{
        text: '前端开发规范',
          items: [
            { text: '前端开发规范', link: '/devGuide/index' },
            { text: '常用编码规范', link: '/devGuide/commonGuide' },
          ]
      }],
      '/algorithm/': [{
        text: '算法',
          items: [
            { text: '排序算法', link: '/algorithm/sortAlg' },
            { text: '查找算法', link: '/algorithm/sreachAlg' },
            { text: '求和算法', link: '/algorithm/addAlg' }
          ]
      }],
      '/workNote/': [{
        text: '工作笔记',
          items: [
            { text: '2025年4月', link: '/workNote/2025年4月' },
            { text: '2025年3月', link: '/workNote/2025年3月' },
            { text: '2025年2月', link: '/workNote/2025年2月' },
            { text: '2025年1月', link: '/workNote/2025年1月' },
            { text: '2024年12月', link: '/workNote/2024年12月'}
          ]
      }]
      ,
      '/UML/': [{
        text: 'UML设计模式',
          items: [
            { text: '创建型设计模式', link: '/UML/createPattern' },
            { text: '结构型设计模式', link: '/UML/behaviorPattern' },
            { text: '行为型设计模式', link: '/UML/behaviorPattern' },
          ]
      }]
    },
    // 社交链接
    socialLinks: [{ icon: "github", link: "https://github.com/ChinaCarlos" }],
    // 部署的时候需要注意该参数避免样式丢失
    // base: "/vitepress-blog-template/",
  }
});
