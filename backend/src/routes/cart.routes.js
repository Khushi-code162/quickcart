const express = require('express')
const router = express.Router()
const {addToCartHandler,
    getCartHandler,
    removeFromcartHandler,
    clearCartHandler} = require('../controllers/cart.controller.js')

const { protect } = require('../middlewares/auth.middleware.js')    

router.get('/',protect,getCartHandler)
router.post('/add',protect ,addToCartHandler)
router.delete('/remove/:productId',protect,removeFromcartHandler)
router.delete('/clear',protect,clearCartHandler)

module.exports = router


    