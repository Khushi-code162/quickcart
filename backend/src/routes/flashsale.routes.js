const express = require('express')
const router = express.Router()
const { buyFlashSale } = require('../controllers/flashsale.controller')
const { protect } = require('../middlewares/auth.middleware')

router.post('/buy', protect, buyFlashSale)

module.exports = router