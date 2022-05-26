const express = require('express')
const router = express.Router()
const { extend } = require('lodash')

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
      const newPostWithUserCred = await postAdded.populate("user", ["name", "username", "profilePic"]).execPopulate()
      res.json({ success: true, postAdded: newPostWithUserCred })
    } catch (error) {
      res.json({
        success: false,
        message: 'unable to add post',
        errorMessage: error.message,
      })
    }
  })

  router.route('/:postId/like')
  .post(async(req, res) => {
    try{
      let postToUpdate = await Post.findById(req.params.postId)
      if(postToUpdate){
      const likes = {likes: postToUpdate.likes + 1}
      console.log(likes)
      postToUpdate = extend(postToUpdate, likes)
      const postUpdated = await postToUpdate.save()
      console.log(postUpdated)
      res.json({success: true, postUpdated})
    } else res.json({success: false, message: "Post not found"})
  } catch(error) {
    res.json({success: false, message: "Some error occured while liking", errorMessage: error.message})
  }
  })

module.exports = router
