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
  .post(async (req, res) => {
    const likedByUser = req.body.likedByUser
    try {
      let postToUpdate = await Post.findById(req.params.postId)
      if (postToUpdate) {
        if (!postToUpdate.likes.includes(likedByUser)) {
          const postUpdated = await postToUpdate.updateOne({ $push: { likes: likedByUser } })
          res.status(200).json({ success: true, message: 'You liked the post.', postUpdated })
        } else {
          const postUpdated = await postToUpdate.updateOne({ $pull: { likes: likedByUser } })
          res
            .status(200)
            .json({ success: true, message: 'Your like removed from post.', postUpdated })
        }
      } else res.json({ success: false, message: "Post not found" })
    } catch (error) {
      res.json({ success: false, message: "Some error occured while liking", errorMessage: error.message })
    }
  })

router.route('/:postId/delete')
  .post(async (req, res) => {
    try {
      const postToDelete = await Post.findOne({ _id: req.params.postId })
      if (postToDelete) {
        const postDeleted = await Post.findOneAndDelete({ _id: req.params.postId })
        res.json({ success: true, postDeleted })
      } else res.json({ success: false, message: 'Post not found' })
    } catch (error) {
      res.json({ success: false, message: "Unable to delete post", errorMessage: error.message })
    }
  })
router.route('/:postId/edit')
  .post(async (req, res) => {
    const editPost = req.body
    try {
      const postToEdit = await Post.findOne({ _id: req.params.postId })
      if (postToEdit) {
        let postEdited = extend(postToEdit, editPost)
        postEdited = await postEdited.save()
        res.status(200).json({ success: true, postEdited })
      } else res.json({ success: false, message: 'Post not found' })
    } catch (error) {
      res.json({ success: false, message: "Unable to update post", errorMessage: error.message })
    }
  })

module.exports = router
