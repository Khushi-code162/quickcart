const { flashSaleQueue } = require('../config/queue')  // ← destructure karo
const { sendSuccess, sendError } = require('../utils/response.utils')

const buyFlashSale = async (req, res) => {
  try {
    const userId = req.user.userId
    const { productId, quantity } = req.body

    const job = await flashSaleQueue.add('buy', {
      userId,
      productId,
      quantity
    })

    return sendSuccess(res, { jobId: job.id }, 'Added to queue — processing your order')
  } catch (error) {
    return sendError(res, error.message)
  }
}

module.exports = { buyFlashSale }