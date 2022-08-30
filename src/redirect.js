/**
 * 网站支付SDK
 */

  // 输出 SDK class 接受 token 和 根域名
const axios = require('axios')

const SDK = require('./sdk')

/**
 * 网站支付, 支付宝webview可用的SDK
 *
 * 给定 token 及商户域名
 * 返回SDK实例, 可进行创建查询等订单操作
 */
class PaySDK extends SDK{
  static VERSION = '0.0.1'

  static API = '/api/v1/redirect/orders'

  host = ''

  constructor(props) {
    super(props)
    this.host = props.host
  }

  /**
   * 创建订单
   * @param {Object} data
   * @param {number} data.amount                - 订单金额      - order amount
   * @param {string} data.merchant_order_id     - 商户后台的唯一的订单id - The unique order id of the merchant's backend
   * @param {string} data.note                  - 订单备注      - order notes
   * @param {string} data.redirect_url          - 成功回调地址   - Successful callback address
   * @param {string} data.redirect_url_fail     - 失败回调地址   - Failed callback address
   * @param {string} data.timestamp             - 时间戳        - timestamp
   * @param {string} [data.provider]            - 国家或地区     - country or region
   */
  orderCreate(data) {
    const url = `${ PaySDK.API }`
    return axios({
      url: this.host + url,
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      data: {
        ...data,
        signature: this.getSignature(url, data)
      }
    })
  }

  /**
   * 查询订单
   * @param {string} order_id           - 要查询的商户订单id
   * @param {Object} params
   * @param {string} params.timestamp   - 时间戳
   */
  orderQuery(order_id, params) {
    const url = `${ PaySDK.API }/${ order_id }`
    return axios({
      url: this.host + url,
      method: 'GET',
      params: {
        ...params,
        signature: this.getSignature(url, params)
      }
    })
  }

  /**
   * 退款订单
   * @param {string} order_id               - 要退款的商户订单id
   * @param data
   * @param {number} data.refund_amount     - 要退款的金额
   * @param {string} data.timestamp         - 时间戳
   * @param {string} data.refund_order_id   - 退款id
   * @param {string} [data.mid]
   * @param {string} [data.provider]        - 国家或地区
   */
  orderRefund(order_id, data) {
    const url = `${ PaySDK.API }/${ order_id }`

    return axios({
      url: this.host + url,
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      data: {
        ...data,
        signature: this.getSignature(url, data)
      }
    })
  }

  /**
   * 取消订单
   * @param order_id                        - 要取消的订单
   * @param data
   * @param {string} data.timestamp         - 时间戳
   * @param {string} [data.mid]
   * @param {string} [data.provider]        - 国家或地区
   */
  orderCancel(order_id, data) {
    const url = `${ PaySDK.API }/${ order_id }`

    return axios({
      url: this.host + url,
      method: 'DELETE',
      headers: { "Content-Type": "application/json" },
      data: {
        ...data,
        signature: this.getSignature(url, data)
      }
    })
  }
}

module.exports = PaySDK
