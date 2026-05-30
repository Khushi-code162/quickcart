const {addToCart , getCart, removeFromcart, clearCart } = require('../services/cart.service.js')
const { sendSuccess, sendError } = require('../utils/response.utils.js')

const addToCartHandler = async(req, res)=>{
    try{
    const userId = req.user.userId
    const {productId , quantity } = req.body
    const cart = await addToCart(userId , productId, quantity)
    return sendSuccess(res, {cart}, 'Item added to cart')
    }catch(error){
        sendError(res, error.message)
    }
}

const getCartHandler = async(req, res) =>{
    try{
        const userId = req.user.userId
        const cart = await getCart(userId)
        return sendSuccess(res, {cart}, 'item fetched successfully')

    }catch(error){
        sendError(res, error.message)
    }
}

const removeFromcartHandler = async(req, res) =>{
    try{
        const userId = req.user.userId
        const productId = req.params.productId
        const cart = await removeFromcart(userId , productId)

        return sendSuccess(res, {cart},'item removed sucessfully')
    }catch(error){
        sendError(res, error.message)
    }
}

const clearCartHandler = async(req, res) =>{
    try{
        const userId = req.user.userId
        const cart = await clearCart(userId)

        return sendSuccess(res, {cart}, "cart cleared sucessfully")

    }catch(error){
        sendError(res, error.message)
    }
}

module.exports={
    addToCartHandler,
    getCartHandler,
    removeFromcartHandler,
    clearCartHandler
}