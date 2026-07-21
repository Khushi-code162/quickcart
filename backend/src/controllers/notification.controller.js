const Notification = require('../models/notification.js')
const { sendSuccess, sendError } = require('../utils/response.utils.js')

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
    return sendSuccess(res, { notifications }, 'Notifications fetched')
  } catch (error) {
    return sendError(res, error.message)
  }
}

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    )
    if (!notification) return sendError(res, 'Notification not found', 404)
    return sendSuccess(res, { notification }, 'Marked as read')
  } catch (error) {
    return sendError(res, error.message)
  }
}

module.exports = { getNotifications, markAsRead }