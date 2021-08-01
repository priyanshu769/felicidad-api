const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: 'Cannot add post without caption',
  },
  likes: {
    type: Number,
    required: 'Cannot add post without defining likes',
  },
  user: {
    type: Object,
    required: 'Please specify user',
    userID: {
      type: String,
      required: 'Cannot add post without defining userID',
    },
    username: {
      type: String,
      required: 'Cannot add post without defining username',
    },
  },
})

const Post = mongoose.model('Post', PostSchema)
module.exports = { Post }
