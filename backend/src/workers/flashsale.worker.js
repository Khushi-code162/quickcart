const { Worker } = require('bullmq')
const IORedis = require('ioredis')
const Order = require('../models/order')
const redis = require('../config/redis')

// BullMQ ke liye alag connection
const redisConnection = new IORedis(process.env.REDIS_URL, {
  tls: { rejectUnauthorized: false },
  maxRetriesPerRequest: null,
  enableReadyCheck: false
})

const flashSaleWorker = new Worker('flashsale', async (job) => {
  const { userId, productId, quantity } = job.data

  const stockKey = `stock:${productId}`
  const currentStock = await redis.get(stockKey)

  if (!currentStock || parseInt(currentStock) < quantity) {
    throw new Error('Out of stock')
  }

  await redis.decrby(stockKey, quantity)

  const order = await Order.create({
    user: userId,
    items: [{ product: productId, quantity }],
    totalAmount: 0,
    status: 'CONFIRMED',
    statusHistory: [{ status: 'CONFIRMED', note: 'Flash sale order' }]
  })

  return { orderId: order._id }

}, {
  connection: redisConnection,  // ← yeh connection
  concurrency: 1
})

flashSaleWorker.on('completed', (job, result) => {
  console.log(`Flash sale done — ${result.orderId}`)
})

flashSaleWorker.on('failed', (job, err) => {
  console.log(`Flash sale failed — ${err.message}`)
})

module.exports = flashSaleWorker