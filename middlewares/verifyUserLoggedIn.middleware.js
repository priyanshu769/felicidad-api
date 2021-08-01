const jwt = require('jsonwebtoken')
require('dotenv').config()
const secretKey = process.env.SECRET

const verifyUserLoggedIn = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    res.status(403).json({ message: 'Invalid Token' })
  }
  try {
    const decode = jwt.verify(token, secretKey)
    req.userId = { userId: decode.userId }
    return next()
  } catch (error) {
    res.json({
      success: false,
      message: 'Unable to decode data from token',
      errorMessage: error.message,
    })
  }
}

module.exports = verifyUserLoggedIn