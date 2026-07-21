const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['ORDER_CONFIRMED', 'ORDER_SHIPPED', 'ORDER_DELIVERED', 'ORDER_CANCELLED', 'FLASH_SALE'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  channel: {
    type: String,
    enum: ['EMAIL', 'IN_APP'],
    default: 'IN_APP'
  }
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema)