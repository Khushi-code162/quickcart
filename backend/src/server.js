require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const connectDB = require('./config/db')

const authRoutes = require('./routes/auth.routes')
const productRoutes = require('./routes/product.routes')
const cartRoutes = require('./routes/cart.routes.js')
const orderRoutes = require('./routes/order.routes.js')
const app = express();
const redis = require('./config/redis.js')
const flashSaleRoutes = require('./routes/flashsale.routes')
require('./workers/flashsale.worker')

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/orders', orderRoutes);


app.use('/api/flash-sale', flashSaleRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})