const express = require('express')
const router = express.Router()
const { placeOrder, getOrders, getOrder, updateStatus }= require('../controllers/order.controller.js')
const { protect } = require('../middlewares/auth.middleware.js')
const { authorizeRoles } = require('../middlewares/role.middleware.js')

router.post('/', protect, placeOrder)
router.get('/', protect, getOrders)
router.get('/:id', protect, getOrder)
router.patch('/:id/status', protect, authorizeRoles('admin'), updateStatus)

module.exports = router