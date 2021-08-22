const express = require('express')
const router = express.Router()

// Models
const { Post } = require('../models/post.model')

router
  .route('/')
  .get(async (req, res) => {
    try {
      const posts = await Post.find({}).populate("user", ["name", "username", "profilePic"]).exec()
      res.json({ success: true, posts })
    } catch (error) {
      res.json({
        success: false,
        message: 'Unable to fetch posts.',
        errorMessage: error.message,
      })
    }
  })
  .post(async (req, res) => {
    const addPost = req.body
    try {
      const postToAdd = new Post(addPost)
      const postAdded = await postToAdd.save()
      res.json({ success: true, postAdded })
    } catch (error) {
      res.json({
        success: false,
        message: 'unable to add post',
        errorMessage: error.message,
      })
    }
  })

module.exports = router
