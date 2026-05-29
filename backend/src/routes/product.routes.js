const express = require('express')
const router = express.Router()
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFlashSaleProducts
} = require('../controllers/product.controller')
const { protect } = require('../middlewares/auth.middleware')
const { authorizeRoles } = require('../middlewares/role.middleware')

// Public routes — koi bhi dekh sakta hai
router.get('/', getAllProducts)
router.get('/flash-sale', getFlashSaleProducts)
router.get('/:id', getProduct)

// Admin only routes — pehle login, phir admin check
router.post('/', protect, authorizeRoles('admin'), createProduct)
router.put('/:id', protect, authorizeRoles('admin'), updateProduct)
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct)

module.exports = router