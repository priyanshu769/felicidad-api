const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: 'Cannot add post without caption',
  },
  likes: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    default: []
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

const Post = mongoose.model('Post', PostSchema)
module.exports = { Post }
