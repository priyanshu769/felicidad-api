const express = require('express')
const router = express.Router()

// Model
const {User} = require('../models/user.model')

// Middlewares
const verifyUserLoggedIn = require('../middlewares/verifyUserLoggedIn.middleware')

router.use(verifyUserLoggedIn)

router.route('/:username/followers').get(async(req, res)=> {
    const user = await User.findOne({username: req.params.username}).populate("followers", ["name", "username", "profilePic"]).exec()
    res.json({success: true, followersList: user._doc.followers})
})
router.route('/:username/following').get(async(req, res)=> {
    const user = await User.findOne({username: req.params.username}).populate("following", ["name", "username", "profilePic"]).exec()
    res.json({success: true, followingList: user._doc.following})
})

module.exports = router