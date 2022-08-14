const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Cannot create user without name.',
  },
  email: {
    type: String,
    reuired: 'Cannot create user without a valid email.'
  },
  username: {
    type: String,
    min: 3,
    max: 15,
    required: 'Cannot create user without username.',
  },
  profilePic: {
    type: String
  },
  bio: {
    type: String,
    max: 50
  },
  password: {
    type: String,
    min: 6,
    required: 'Cannot create user without password.',
  },
  followers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },
  following: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },
  bookmarks: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    default: []
  },
})

const User = mongoose.model('User', UserSchema)
module.exports = { User }
