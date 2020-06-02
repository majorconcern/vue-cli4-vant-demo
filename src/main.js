import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './assets/css/reset.css'
import './assets/css/common.css'

import Dialog from './components/dialog'
import Loading from './components/loading'
import toast from './components/toast'

import './utils/plugin'
import './utils/FastClick'
import utils from './utils/utils'
import VueScroller from 'vue-scroller'

Vue.use(VueScroller)
Vue.use(utils)

Vue.prototype.$dialog = Dialog
Vue.prototype.$loading = Loading
Vue.prototype.$toast = toast

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  const userInfo = sessionStorage.getItem('userInfo') || null
  if (!userInfo && to.meta.auth) {
    next('/login')
  } else {
    next()
  }
})

export default new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
