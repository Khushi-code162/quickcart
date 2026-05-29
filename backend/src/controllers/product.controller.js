const Product = require('../models/product.js')
const { sendSuccess, sendError } = require('../utils/response.utils.js')

// -------- GET ALL PRODUCTS --------
// GET /api/products?category=electronics&minPrice=100&maxPrice=5000&page=1&limit=10
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort
    } = req.query

    // Filter object banao
    const filter = {}
    if (category) filter.category = category
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    // Sort banao
    let sortObj = { createdAt: -1 } // default — naye pehle
    if (sort === 'price_asc') sortObj = { price: 1 }
    if (sort === 'price_desc') sortObj = { price: -1 }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit)

    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))

    const total = await Product.countDocuments(filter)

    return sendSuccess(res, {
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    return sendError(res, error.message)
  }
}

// -------- GET SINGLE PRODUCT --------
// GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return sendError(res, 'Product not found', 404)
    return sendSuccess(res, { product })
  } catch (error) {
    return sendError(res, error.message)
  }
}

// -------- CREATE PRODUCT --------
// POST /api/products — sirf admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      images,
      isFlashSale,
      flashSalePrice
    } = req.body

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images,
      isFlashSale,
      flashSalePrice
    })

    return sendSuccess(res, { product }, 'Product created successfully', 201)
  } catch (error) {
    return sendError(res, error.message)
  }
}

// -------- UPDATE PRODUCT --------
// PUT /api/products/:id — sirf admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!product) return sendError(res, 'Product not found', 404)
    return sendSuccess(res, { product }, 'Product updated successfully')
  } catch (error) {
    return sendError(res, error.message)
  }
}

// -------- DELETE PRODUCT --------
// DELETE /api/products/:id — sirf admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return sendError(res, 'Product not found', 404)
    return sendSuccess(res, null, 'Product deleted successfully')
  } catch (error) {
    return sendError(res, error.message)
  }
}

// -------- GET FLASH SALE PRODUCTS --------
// GET /api/products/flash-sale
const getFlashSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFlashSale: true })
    return sendSuccess(res, { products })
  } catch (error) {
    return sendError(res, error.message)
  }
}

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFlashSaleProducts
}