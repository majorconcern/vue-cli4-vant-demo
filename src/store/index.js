import Vue from 'vue'
import Vuex from 'vuex'
import headers from './modules/headers'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    headers
  },
  getters
})