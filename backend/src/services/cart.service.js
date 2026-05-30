const redis = require('../config/redis.js')
const Product = require('../models/product.js')

const addToCart = async(userId, productId, quantity) =>{
    //step1product db me dhundho
    const product = await Product.findById(productId);
    if(!product){
        throw new Error("product not found");
    }
    //stock check kro 
    if(product.stock< quantity){
        throw new Error("product is out of stock");
    }
    //redis me save kro
    const cartKey =`cart:${userId}`;

    const cartItem=JSON.stringify({
        productId,
        "name":product.name,
        "price":product.price,
        quantity,
        image:product.images[0]
})


await redis.hset(cartKey, productId, cartItem)
await redis.expire(cartKey, 1800)
return getCart(userId)
}

const getCart = async(userId) => {
  const cartKey = `cart:${userId}`
  
  // Step 1 — Redis se cart lo
  const items = await redis.hgetall(cartKey)
  
  // Step 2 — cart khali hai toh
  if(!items) {
    return { items: [], total: 0 }
  }
  
  // Step 3 — har item parse karo
  const parsed = Object.values(items).map(i => JSON.parse(i))
  
  // Step 4 — total calculate karo
  const total = parsed.reduce((sum, i) => sum + i.price * i.quantity, 0)
  
  return { items: parsed, total }
}

//remove cart 
const removeFromcart = async(userId, productId) =>{
    const cartKey =`cart:${userId}`
    await redis.hdel(cartKey, productId)
}

//clear cart
const clearCart = async(userId)=>{
    await redis.del( `cart:${userId}` )
}

module.exports ={
    addToCart,
    getCart,
    removeFromcart,
    clearCart
}