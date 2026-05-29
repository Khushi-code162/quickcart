const jwt = require('jsonwebtoken')

// Access token banao — 15 min valid
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },           // token ke andar yeh data hoga
    process.env.JWT_SECRET,     // secret key se sign karo
    { expiresIn: '15m' }        // 15 min mein expire
  )
}

// Refresh token banao — 7 din valid
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
}

// Token verify karo
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
}