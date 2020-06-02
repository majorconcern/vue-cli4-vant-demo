import base from './base.js';
import http from '@/util/http.js'

/**
 * 请求收货地址列表POST
 *
 * @param {*} user_id
 * @param {*} page
 * @param {*} size
 *
 *  请求用户地址列表
 *  {
 *    "user_id": 2272
 *  }
 *
 *  请求用户默认收货地址
 *  {
 *     "user_id": 2272,
 *     "page": 0,
 *     "size":1
 *  }
 */
function addressList(params) {
  return http.post(base.activity_api + 'shop/v1.0/address/list', params)
}

/**
 * 请求收货地址详情 GET /shop/v1.0/address/detail/{id}
 * @param {*} id 地址主键id
 */
function addressDetail(params) {
  return http.get(base.activity_api + `shop/v1.0/address/detail/${id}`, params)
}

/**
 * 修改添加收货地址 POST shop/v1.0/address/add_or_update
 * @param {*} user_id
 * @param {*} type 操作类型参数 值为1,2,3; 1:修改默认收货地址 2:修改地址内容信息 3:新增收货地址
 * @param {*} id   地址主键id 当修改地址数据时 传该参数 新增地址信息时不传该参数
 * @param {*} reciever 收件人
 * @param {*} phone 电话
 * @param {*} detail 地址详情
 * @param {*} country
 * @param {*} province
 * @param {*} city
 * @param {*} county
 *
 */
function editorAddress(params) {
  return http.get(base.activity_api + `/shop/v1.0/address/add_or_update`, params)
}

export default {
  addressList,
  addressDetail,
  editorAddress
}
