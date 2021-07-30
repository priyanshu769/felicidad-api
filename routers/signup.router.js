const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
const secretKey = process.env.SECRET

// Model
const { User } = require('../models/user.model')

router.route('/').post(async (req, res) => {
  const newUser = req.body
  try {
    const verifyNewUser = new User(newUser)
    const userWithEmail = await User.findOne({ email: verifyNewUser.email })
    const userWithUsername = await User.findOne({
      username: verifyNewUser.username,
    })
    if (userWithEmail) {
      return res.json({
        success: false,
        message: 'User already exist with this email. Try logging in instead.',
      })
    }
    if (userWithUsername) {
      return res.json({
        success: false,
        message: 'User already exist with this username.',
      })
    }
    try {
      const salt = await bcrypt.genSalt(10)
      verifyNewUser.password = await bcrypt.hash(verifyNewUser.password, salt)
      const savedNewUser = await verifyNewUser.save()
      const token = jwt.sign({ userId: savedNewUser._id }, secretKey)
      res.json({ success: true, savedNewUser, token })
    } catch (error) {
      res.json({
        success: false,
        message: 'Unable to signup.',
        errorMessage: error.message,
      })
    }
  } catch (error) {
    res.json({
      success: false,
      message: 'Some error occured.',
      errorMessage: error.message,
    })
  }
})

module.exports = router
