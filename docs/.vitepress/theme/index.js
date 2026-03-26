import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './custom.css'
import AdminPanel from './AdminPanel.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout)
  },
  enhanceApp({ app, router }) {
    app.component('AdminPanel', AdminPanel)

    // // 检测首页并添加类名
    router.onAfterRouteChanged = (to) => {
      const vpDoc = document.querySelector('.VPDoc')
      if (vpDoc) {
        if (to.path === '/') {
          vpDoc.classList.add('home-page')
        } else {
          vpDoc.classList.remove('home-page')
        }
      }
    }
  }
}
