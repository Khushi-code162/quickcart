const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  images: [String],
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  isFlashSale: {
    type: Boolean,
    default: false
  },
  flashSalePrice: {
    type: Number,
    default: null
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true })

// Fast filtering ke liye index
productSchema.index({ category: 1, price: 1 })

module.exports = mongoose.model('Product', productSchema)