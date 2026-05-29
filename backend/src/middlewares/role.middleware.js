const { sendError } = require('../utils/response.utils')

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Access denied — admin only', 403)
    }
    next()
  }
}

module.exports = { authorizeRoles }