const express = require('express')
const router = express.Router()

// Model
const {User} = require('../models/user.model')

// Middlewares
const verifyUserLoggedIn = require('../middlewares/verifyUserLoggedIn.middleware')

router.use(verifyUserLoggedIn)

router.route('/:id/followers').get(async(req, res)=> {
    const user = await User.findOne({_id: req.params.id})
    const userFollowers = await Promise.all(user.followers.map(followerId => {
        return User.findOne({_id: followerId})
    }))
    const followersList = userFollowers.map(userFollower => {
        const {password, email, followers, following, bio, __v, ...restData} = userFollower._doc
        return restData
    })
    res.json({success: true, followersList})
})
router.route('/:id/following').get(async(req, res)=> {
    const user = await User.findOne({_id: req.params.id})
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