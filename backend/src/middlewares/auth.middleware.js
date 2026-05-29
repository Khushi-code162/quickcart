const { verifyAccessToken } = require('../utils/jwt.utils')
const { sendError } = require('../utils/response.utils')

const protect = (req, res, next) => {
  try {
    // Header mein token dhundho
    // Frontend bhejta hai: Authorization: Bearer eyJ...
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No token — please login', 401)
    }

    const token = authHeader.split(' ')[1]  // "Bearer eyJ..." → "eyJ..."

    // Token verify karo
    const decoded = verifyAccessToken(token)
    req.user = decoded  // { userId, role } — aage ke controllers use karenge

    next()  // aage jaao
  } catch (error) {
    return sendError(res, 'Invalid or expired token', 401)
  }
}

module.exports = { protect }