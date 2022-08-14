const express = require('express')
const router = express.Router()

// Model
const { User } = require('../models/user.model')
const { Post } = require('../models/post.model')

// Middlewares
const verifyUserLoggedIn = require('../middlewares/verifyUserLoggedIn.middleware')

router.use(verifyUserLoggedIn)

router
    .route('/')
    .get(async (req, res) => {
        let user = await User.findById(req.userId.userId).populate('bookmarks').exec()
        res.json({ success: true, userwithBookmarkPosts: user })
    })

router.param('postId', async (req, res, next, postId) => {
    try {
        const postToBookmark = await Post.findById(postId)
        if (!postToBookmark) {
            return res.json({ success: false, message: 'Unable to get Post.' })
        }
        req.postToBookmark = postToBookmark
        req.postToBookmarkId = postId
        return next()
    } catch (error) {
        res.json({
            success: false,
            message: 'Error while retrieving Post',
            errorMessage: error.message,
        })
    }
})

router
    .route('/:postId')
    .post(async (req, res) => {
        let user = await User.findById(req.userId.userId)
        try {
            if (!user.bookmarks.includes(req.postToBookmarkId)) {
                const userUpdated = await user.updateOne({ $push: { bookmarks: req.postToBookmarkId } })
                res
                    .status(200)
                    .json({ success: true, message: 'You bookmarked the post.', userUpdated })
            } else {
                const userUpdated = await user.updateOne({ $pull: { bookmarks: req.postToBookmarkId } })
                res
                    .status(200)
                    .json({ success: true, message: 'You removed post from bookmark.', userUpdated })
            }
        } catch (error) {
            res.json({ success: false, message: "Some error occured while adding to bookmark", errorMessage: error.message })
        }
    })

module.exports = router