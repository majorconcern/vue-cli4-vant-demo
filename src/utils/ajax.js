import axios from 'axios'
import vm from '../main'
import { baseApi } from '../config'
import store from '@/store'
import router from '@/router'

/* 全局默认配置 */
var http = axios.create({
  baseURL: baseApi,
  timeout: 5000
})
/* 请求拦截器 */
http.interceptors.request.use(
  config => {
    // config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    // config.headers.timestamp = Math.floor(new Date().getTime() / 1000)
    // config.headers.token = sessionStorage.getItem('token') || ''
    // 统一设置headers
    config.headers = store.getters.headers
    // 接口没返回时显示loadin
    if (config.loading === true) {
      vm.$loading.hide()
      vm.$loading.show()
    }
    return config
  },
  error => {
    vm.$loading.hide()
    return Promise.reject(error)
  }
)
/* 响应拦截器 */
http.interceptors.response.use(
  res => {
    // 请求错误
    if (res.data && res.data.code !== 0 ) {
      // router.replace({ path: '/err', query: {message: res.data.message} });
      vm.$toast({
        msg: res.data.message,
        type: 'fail'
      })
    }
    vm.$loading.hide()
    return res
  },
  error => {
    if (!error.response) {
      // 断网
      vm.$toast({
        msg: '网络错误',
        type: 'fail'
      })
    }
    // if (error.response.status === 404) {
    //   router.push({name: 'err', query: {code: error.response.status}})
    // }
  
    // if (error.response.status === 401) {
    //   router.push({name: 'err', query: {code: error.response.status}});
    // }
  
    // if (error.response.status === 500) {
    //   router.push({name: 'err', query: {code: error.response.status}});
    // }
    vm.$loading.hide()
    return Promise.reject(error)
  }
)

export default http
