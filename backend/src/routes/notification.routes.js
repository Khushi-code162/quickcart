const express = require('express')
const router = express.Router()
const { getNotifications, markAsRead } = require('../controllers/notification.controller.js')
const { protect } = require('../middlewares/auth.middleware')

router.get('/', protect, getNotifications)
router.patch('/:id/read', protect, markAsRead)

module.exports = router