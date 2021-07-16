const express = require('express')
const router = express.Router()
const { extend } = require('lodash')

// Model
const { User } = require('../models/user.model')

router
  .route('/')
  .get(async (req, res) => {
    try {
      const Users = await User.find({})
      res.json({ success: true, Users })
    } catch (error) {
      res.json({
        success: false,
        message: 'Unable to fetch users.',
        errorMessage: error.message,
      })
    }
  })
  .post(async (req, res) => {
    const addUser = req.body
    try {
      const userToAdd = new User(addUser)
      const userAdded = await userToAdd.save()
      res.json({ success: true, userAdded })
    } catch (error) {
      res.json({
        success: false,
        message: 'Unable to create acccount',
        errorMessage: error.message,
      })
    }
  })

router.param('id', async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.json({ success: false, message: 'Unable to get user.' })
    }
    req.user = user
    next()
  } catch (error) {
    res.json({
      success: false,
      message: 'Error while retrieving user',
      errorMessage: error.message,
    })
  }
})

router
  .route('/:id')
  .get((req, res) => {
    let user = req.user
    res.json({ success: true, user })
  })
  .post(async (req, res) => {
    const updateUser = req.body
    let user = req.user
    user = extend(user, updateUser)
    user = await user.save()

    res.json({ success: true, user })
  })

module.exports = router
