const Order = require('../models/order.js')
const { getCart, clearCart } = require('../services/cart.service.js')
const { sendSuccess, sendError } = require('../utils/response.utils.js')

// -------- PLACE ORDER --------
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId
    const { shippingAddress } = req.body

    const cart = await getCart(userId)

    if (cart.items.length === 0) {
      return sendError(res, 'Cart is empty', 400)
    }

    const order = await Order.create({
      user: userId,
      items: cart.items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        priceAtOrder: item.price
      })),
      totalAmount: cart.total,
      shippingAddress,
      statusHistory: [{ status: 'PENDING', note: 'Order placed' }]
    })

    await clearCart(userId)
    return sendSuccess(res, { order }, 'Order placed successfully', 201)
  } catch (error) {
    return sendError(res, error.message)
  }
}

// -------- GET ALL ORDERS --------
const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
    return sendSuccess(res, { orders }, 'Orders fetched')
  } catch (error) {
    return sendError(res, error.message)
  }
}

// -------- GET SINGLE ORDER --------
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return sendError(res, 'Order not found', 404)
    return sendSuccess(res, { order })
  } catch (error) {
    return sendError(res, error.message)
  }
}

// -------- UPDATE STATUS — Admin --------
const VALID_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: []
}

const updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body
    const order = await Order.findById(req.params.id)

    if (!order) return sendError(res, 'Order not found', 404)

    // State machine check
    const validNext = VALID_TRANSITIONS[order.status]
    if (!validNext.includes(status)) {
      return sendError(res, `Cannot change from ${order.status} to ${status}`, 400)
    }

    order.status = status
    order.statusHistory.push({ status, note })
    await order.save()

    return sendSuccess(res, { order }, 'Status updated')
  } catch (error) {
    return sendError(res, error.message)
  }
}

module.exports = { placeOrder, getOrders, getOrder, updateStatus }