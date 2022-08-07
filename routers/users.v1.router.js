const express = require('express')
const router = express.Router()
const { extend } = require('lodash')
const bcrypt = require('bcrypt')

// Model
const { User } = require('../models/user.model')

// Middlewares
const verifyUserLoggedIn = require('../middlewares/verifyUserLoggedIn.middleware')

router.use(verifyUserLoggedIn)

router.route('/').get(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId.userId })
    const {password, __v, ...restUserData} = user._doc
    res.json({ success: true, user: restUserData })
  } catch (error) {
    res.json({
      success: false,
      message: 'Unable to fetch user.',
      errorMessage: error.message,
    })
  }
})
router.route('/all').get(async (req, res) => {
  try {
    const users = await User.find({}, {name: 1, username: 1, profilePic: 1})
    res.json({ success: true, users })
  } catch (error) {
    res.json({
      success: false,
      message: 'Unable to fetch users.',
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
    return next()
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
  .get(async (req, res) => {
    let user = await User.findById(req.params.id)
    const { password, email, __v, ...restUserData } = user._doc
    res.json({ success: true, restUserData })
  })
  .post(async (req, res) => {
    if (req.userId.userId === req.params.id) {
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        req.user.password,
      )
      if (isPasswordCorrect) {
        const updateUser = req.body
        const salt = await bcrypt.genSalt(10)
        updateUser.password = await bcrypt.hash(updateUser.password, salt)
        let user = req.user
        user = extend(user, updateUser)
        user = await user.save()
        const { password, email, __v, ...restUserData } = user._doc
        res.json({ success: true, user: restUserData })
      } else res.send({ success: false, message: 'Incorrect Password' })
    }
    return res.json({
      sucess: false,
      message: 'Unable to edit other users data',
    })
  })

router.route('/:id/follow').get(async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const userToFollow = req.user
    const currentUser = await User.findById(req.userId.userId)
    if (!userToFollow.followers.includes(req.userId.userId)) {
      await userToFollow.updateOne({ $push: { followers: req.userId.userId } })
      await currentUser.updateOne({ $push: { following: req.params.id } })
      res.status(200).json({ success: true, message: 'User has been followed' })
    } else {
      res
        .status(403)
        .json({ success: true, message: 'You already follow this user' })
    }
  } else res.status(403).json({ message: "You can't follow yourself." })
})
router.route('/:id/unfollow').get(async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const userToUnfollow = req.user
    const currentUser = await User.findById(req.userId.userId)
    if (userToUnfollow.followers.includes(req.userId.userId)) {
      await userToUnfollow.updateOne({
        $pull: { followers: req.userId.userId },
      })
      await currentUser.updateOne({ $pull: { following: req.params.id } })
      res
        .status(200)
        .json({ success: true, message: 'User has been unfollowed' })
    } else {
      res
        .status(403)
        .json({ success: true, message: "You don't follow this user" })
    }
  } else res.status(403).json({ message: "You can't unfollow yourself." })
})

router.param('username', async (req, res, next, username) => {
  try {
    const user = await User.findOne({ username: username })
    if (!user) {
      return res.json({ success: false, message: 'Unable to get user.' })
    }
    req.user = user
    return next()
  } catch (error) {
    res.json({
      success: false,
      message: 'Error while retrieving user',
      errorMessage: error.message,
    })
  }
})
router.route('/u/:username').get(async (req, res) => {
  const { password, email, __v, ...restUserData } = req.user._doc
  res.json({ success: true, restUserData })
})

module.exports = router
