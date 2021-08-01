const express = require('express')
const router = express.Router()

// Model
const {User} = require('../models/user.model')

// Middlewares
const verifyUserLoggedIn = require('../middlewares/verifyUserLoggedIn.middleware')

router.use(verifyUserLoggedIn)

router.route('/:username/followers').get(async(req, res)=> {
    const user = await User.findOne({username: req.params.username})
    const userFollowers = await Promise.all(user.followers.map(followerId => {
        return User.findOne({_id: followerId})
    }))
    const followersList = userFollowers.map(userFollower => {
        const {password, email, followers, following, bio, __v, ...restData} = userFollower._doc
        return restData
    })
    res.json({success: true, followersList})
})
router.route('/:username/following').get(async(req, res)=> {
    const user = await User.findOne({username: req.params.username})
    const userFollowing = await Promise.all(user.following.map(followerId => {
        return User.findOne({_id: followerId})
    }))
    const followingList = userFollowing.map(userFollowed => {
        const {password, email, followers, following, bio, __v, ...restData} = userFollowed._doc
        return restData
    })
    res.json({success: true, followingList})
})

module.exports = router