const User = require('../models/user.js')
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../utils/jwt.utils.js')
const { sendSuccess, sendError } = require('../utils/response.utils.js')

// -------- REGISTER --------
const register = async (req, res) => {
  try {
    const { name, email, password ,role} = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return sendError(res, 'Email already registered', 400)
    }

    const user = await User.create({ name, email, password ,role})

    const accessToken = generateAccessToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)

    // save() nahi — findByIdAndUpdate use karo
    await User.findByIdAndUpdate(user._id, { refreshToken })

    return sendSuccess(res, { user, accessToken, refreshToken }, 'Registered successfully', 201)
  } catch (error) {
    return sendError(res, error.message)
  }
}

// -------- LOGIN --------
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return sendError(res, 'Invalid email or password', 401)
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401)
    }

    const accessToken = generateAccessToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)

    // save() nahi — findByIdAndUpdate use karo
    await User.findByIdAndUpdate(user._id, { refreshToken })

    return sendSuccess(res, { user, accessToken, refreshToken }, 'Login successful')
  } catch (error) {
    return sendError(res, error.message)
  }
}

// -------- REFRESH TOKEN --------
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return sendError(res, 'Refresh token required', 400)

    const decoded = verifyRefreshToken(refreshToken)

    const user = await User.findById(decoded.userId)
    if (!user || user.refreshToken !== refreshToken) {
      return sendError(res, 'Invalid refresh token', 401)
    }

    const newAccessToken = generateAccessToken(user._id, user.role)
    return sendSuccess(res, { accessToken: newAccessToken }, 'Token refreshed')
  } catch (error) {
    return sendError(res, 'Invalid or expired refresh token', 401)
  }
}

// -------- LOGOUT --------
const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.userId, { refreshToken: null })
    return sendSuccess(res, null, 'Logged out successfully')
  } catch (error) {
    return sendError(res, error.message)
  }
}

// -------- GET ME --------
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return sendError(res, 'User not found', 404)
    return sendSuccess(res, { user })
  } catch (error) {
    return sendError(res, error.message)
  }
}

module.exports = { register, login, refresh, logout, getMe }