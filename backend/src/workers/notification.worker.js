const { Worker } = require('bullmq')
const { redisConnection } = require('../config/queue')  // ← queue.js se lo
const Notification = require('../models/notification.js')
const User = require('../models/user.js')
const sendEmail = require('../config/email.js')

console.log('Notification worker started ✓')

const notificationWorker = new Worker('notifications', async (job) => {
  console.log('Job processing:', job.id)
  const { userId, type, message } = job.data

  await Notification.create({
    user: userId,
    type: type,
    message: message,
    channel: 'IN_APP'
  })

  const user = await User.findById(userId)

  await sendEmail({
  to: user.email,
  subject: `QuickKart — Order #${userId} Update`,
  text: message
})

}, {
  connection: redisConnection,  // ← same connection
  concurrency: 5
})

notificationWorker.on('completed', (job) => {
  console.log(`Notification sent — job ${job.id}`)
})

notificationWorker.on('failed', (job, err) => {
  console.log(`Notification failed — ${err.message}`)
  console.error(err)
})

module.exports = notificationWorker