# vue-vant-demo

## 简介

技术栈：vue/cli4 + vant + axios + postcss-px2rem

```js
// 安装依赖
yarn install

// 本地启动
yarn serve

// 生产打包
yarn build
```

## 配置 vant

1、安装依赖

```
yarn add babel-plugin-import -D
```

2、配置 .babelrc 或者 babel.config.js 文件

```js
// 在.babelrc 中添加配置
{
  "plugins": [
    ["import", {
      "libraryName": "vant",
      "libraryDirectory": "es",
      "style": true
    }]
  ]
}

```

3、按需引入

你可以在代码中直接引入 Vant 组件，插件会自动将代码转化为方式二中的按需引入形式

```js
import Vue from 'vue'
import { Button } from 'vant'

Vue.use(Button)
```

## rem 适配

使用 postcss 中的 px2rem-loader

1、安装依赖

```
yarn add px2rem-loader --save-dev
```

2、在 vue.config.js 进行如下配置

```js
  css: {
    // css预设器配置项
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            remUnit: 100
          })
        ]
      }
    }
  },
```

3、在 main.js 设置 html 跟字体大小

```js
function initRem() {
  let cale = window.screen.availWidth > 750 ? 2 : window.screen.availWidth / 375
  window.document.documentElement.style.fontSize = `${100 * cale}px`
}

window.addEventListener('resize', function() {
  initRem()
})
```

## axios 请求封装

1、设置请求拦截和响应拦截

```js
const PRODUCT_URL = 'https://xxxx.com'
const MOCK_URL = 'http://xxxx.com'
let http = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? PRODUCT_URL : MOCK_URL,
})
// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 统一设置headers 引入保存至store的headers
    config.headers = store.getters.headers
    // 请求显示loading效果
    if (config.loading === true) {
      vm.$loading.show()
    }
    return config
  },
  (error) => {
    vm.$loading.hide()
    return Promise.reject(error)
  }
)
// 响应拦截器
http.interceptors.response.use(
  (res) => {
    vm.$loading.hide()
    if (!error.response) {
      // 断网
      vm.$toast({
        msg: '网络错误',
        type: 'fail'
      })
    }
    // token失效，重新登录
    if (res.data.code === 401) {
      //  重新登录
    }

    // 统一跳转至err
    // router.push({name: 'err', query: {code: error.response.status}})
    return res
  },
  (error) => {
    vm.$loading.hide()
    return Promise.reject(error)
  }
)

export default http

```

2、封装 api

```js
import base from './base.js';
import http from '@/util/http.js'

function xx1(params) {
  return http.post(base.activity_api + 'shop/xxx', params)
}

function xx2(params) {
  return http.get(base.activity_api + `shop/xxx/${id}`, params)
}

export default {
  xx1,
  xx2
}

```

3、使用

```js

import xx from '@/api/xx.js';
xx.xx1(
{
  page: 0,
  size: 10
}).then(({data}) => {})

```

## 工具类函数封装

1、添加方法到 vue 实例的原型链上

```js
export default {
  install (Vue, options) {
    Vue.prototype.util = {
      method1(val) {
        ...
      },
      method2 (val) {
       ...
      },
  }
}
```

2、在 main.js 通过 vue.use()注册

```js
import utils from './js/utils'
Vue.use(utils)
```

## 多环境变量配置

首先我们先来了解一下环境变量，一般情况下我们的项目会有三个环境，本地环境(development)，测试环境(staging)，生产环境(production)，我们可以在项目根目录下建三个配置环境变量的文件.env.development，.env.test，.env.production

环境变量文件中只包含环境变量的“键=值”对：

```js
NODE_ENV = 'production'
VUE_APP_ENV = 'production' // 只有VUE_APP开头的环境变量可以在项目代码中直接使用
```

除了自定义的 VUE*APP*\*变量之外，还有两个可用的变量：

- NODE_ENV : "development"、"production" 或 "staging"中的一个。具体的值取决于应用运行的模式。
- BASE_URL : 和 vue.config.js 中的 publicPath 选项相符，即你的应用会部署到的基础路径。

下面开始配置我们的环境变量

1、在项目根目录中新建.env.\*

- .env.development 本地开发环境配置

```
NODE_ENV='development'
VUE_APP_ENV = 'development'
```

- env.staging 测试环境配置

```
NODE_ENV='staging'
VUE_APP_ENV = 'staging'
```

- env.production 正式环境配置

```
NODE_ENV='production'
VUE_APP_ENV = 'production'
```

为了在不同环境配置更多的变量，我们在 src 文件下新建一个 config/index

```js
// 根据环境引入不同配置 process.env.NODE_ENV
const config = require('./env.' + process.env.VUE_APP_ENV)
module.exports = config
```

在同级目录下新建 env.development.js，env.test.js，env.production.js，在里面配置需要的变量。
以 env.development.js 为例

```js
module.exports = {
  baseUrl: 'http://localhost:8089', // 项目地址
  baseApi: 'https://www.mock.com/api', // 本地api请求地址
}
```

2、配置打包命令

package.json 里的 scripts 不同环境的打包命令

- 通过 yarn serve 启动本地
- 通过 yarn build:dev 打包测试
- 通过 yarn build 打包正式

```js
  "scripts": {
    "serve": "vue-cli-service serve",
    "serve:pro": "vue-cli-service serve --mode production",
    "build:dev": "vue-cli-service build  --mode development",
    "build": "vue-cli-service build"
  },
```

## vue.config.js 配置

vue-cli3 开始，新建的脚手架都需要我们在 vue.config.js 配置我们项目的东西。主要包括

- 打包后文件输出位置
- 关闭生产环境 souecemap
- 配置 rem 转化 px
- 配置 alias 别名
- 去除生产环境 console
- 跨域代理设置

此外，还有很多属于优化打包的配置，后面会一一道来。

```js
module.exports = {
  // 部署应用包时的基本URL，默认为'/'
  publicPath: './',

  // 将构建好的文件输出到哪里，本司要求
  outputDir: 'dist/static',

  // 放置生成的静态资源(js、css、img、fonts)的目录。
  assetsDir: 'static',

  // 指定生成的 index.html 的输出路径
  indexPath: 'index.html',

  // 是否使用包含运行时编译器的 Vue 构建版本。
  runtimeCompiler: false,

  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  transpileDependencies: [],

  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,

  // 配置css
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    sourceMap: true,
    // css预设器配置项
    loaderOptions: {
      postcss: {
        // options here will be passed to postcss-loader
        plugins: [
          require('postcss-px2rem')({
            remUnit: 100,
          }),
        ],
      },
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
  },

  // 是一个函数，允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: (config) => {
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))

    config.optimization.minimizer('terser').tap((args) => {
      // 去除生产环境console
      args[0].terserOptions.compress.drop_console = true
      return args
    })
  },

  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  parallel: require('os').cpus().length > 1,

  devServer: {
    host: '0.0.0.0',
    port: 8088, // 端口号
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器  open: 'Google Chrome'-默认启动谷歌

    // 配置多个代理
    proxy: {
      '/api': {
        target: 'https://www.mock.com',
        ws: true, // 代理的WebSockets
        changeOrigin: true, // 允许websockets跨域
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
}
```
## gZip 加速优化

```js
const CompressionPlugin = require('compression-webpack-plugin')
configureWebpack: (config) => {
  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
      new CompressionPlugin({
        // gzip压缩配置
        test: /\.js$|\.html$|\.css/, // 匹配文件名
        threshold: 10240, // 对超过10kb的数据进行压缩
        deleteOriginalAssets: false, // 是否删除原文件
      })
    )
  }
}
```
