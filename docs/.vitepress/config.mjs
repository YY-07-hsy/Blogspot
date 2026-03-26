import { defineConfig } from 'vitepress'
import sidebar from './sidebar.js'

export default defineConfig({
  title: '我的博客',
  titleTemplate: '探索与分享',
  description: '代码不仅是工具，更是思想的载体',

  lang: 'zh-CN',
  lastUpdated: true,

  themeConfig: {
    siteTitle: '我的博客',
    logo: '/favicon.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/articles/' },
      { text: '关于', link: '/about' },
      { text: '管理', link: '/admin' }
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    footer: {
      message: '用心记录每一次思考',
      copyright: '© 2024 我的博客'
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3]
    }
  },

  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Patrick+Hand&family=Source+Code+Pro:wght@400;500&display=swap', rel: 'stylesheet' }]
  ]
})