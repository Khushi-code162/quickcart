const { Queue } = require('bullmq')
const IORedis = require('ioredis')

const redisConnection = new IORedis(process.env.REDIS_URL, {
  tls: { rejectUnauthorized: false },
  maxRetriesPerRequest: null,
  enableReadyCheck: false
})

const flashSaleQueue = new Queue('flashsale', {
  connection: redisConnection
})

module.exports = { flashSaleQueue, redisConnection }