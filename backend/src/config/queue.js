const { Queue } = require('bullmq')
const IORedis = require('ioredis')

const redisConnection = new IORedis(process.env.REDIS_URL, {
  tls: { rejectUnauthorized: false },
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect : true,
})

const flashSaleQueue = new Queue('flashsale', {
  connection: redisConnection
})


// Naya — notification queue
const notificationQueue = new Queue('notifications', {
  connection: redisConnection
})

module.exports = { flashSaleQueue, notificationQueue, redisConnection }