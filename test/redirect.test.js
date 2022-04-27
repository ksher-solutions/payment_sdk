const chalk = require('chalk')

const PaySDK = require('../src/redirect')
const { token, host } = require('./setting.json')


const sdk = new PaySDK({ token, host });
const getTime = () => '' + +new Date()

describe("test redirect", () => {
  const amount = 100
  const order_id = getTime()
  const note = 'some note for this order'
  const timestamp = getTime()

  const params = {
    "amount": amount,
    "merchant_order_id": order_id,
    "note": note,
    "provider": "Ksher",
    "redirect_url": "http://www.baidu.com",
    "redirect_url_fail": "http://www.baidu.com",
    "timestamp": timestamp,
  }

  test('Create Order', async () => {
    const { status, data } = await sdk.orderCreate(params)
    expect(status).toBe(200)

    expect(data.amount).toBe(amount)
    expect(data.merchant_order_id).toBe(order_id)
    expect(data.note).toBe(note)
    expect(data.timestamp).toBe(timestamp)
    expect(data.status).toBe('Available')
    expect(data.error_code).toBe('SUCCESS')
    expect(data.api_name).toBe('Redirect')

    console.log(chalk.bgGreen('  '), chalk.green.bold('Create order result'), data);
    console.log(`payment link: ${ chalk.green(data.reference) }`);
  });

  test('checking order', async () => {
    const timestamp = getTime()
    const { status, data } = await sdk.orderQuery(order_id, { timestamp })
    expect(status).toBe(200)

    expect(data.merchant_order_id).toBe(order_id)
    expect(data.timestamp).toBe(timestamp)
    expect(data.api_name).toBe('Redirect')

    console.log(chalk.bgGreen('  '), chalk.green.bold('Query order result'), data);
  })

  test('refund order', async () => {
    const timestamp = getTime()

    const refund_amount = 100

    const params = {
      "refund_amount": refund_amount,
      "timestamp": timestamp,
      "refund_order_id": order_id
    }

    const { status, data } = await sdk.orderRefund(order_id, params)
    expect(status).toBe(200)

    console.log(chalk.bgGreen('  '), chalk.green.bold('Order refund result'), data);
  })
})


