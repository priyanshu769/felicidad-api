const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Cannot create user without name.',
  },
  username: {
    type: String,
    required: 'Cannot create user without username.',
  },
  bio: {
    type: String,
    required: 'Cannot create user without bio.',
  },
  password: {
    type: String,
    required: 'Cannot create user without password.',
  },
  following: {
    type: Array,
    required: 'Cannot create user without following array.',
  },
  followers: {
    type: Array,
    required: 'Cannot create user without following array.',
  },
  posts: {
    type: Array,
    required: 'Cannot create user without following array.',
  },
})

const User = mongoose.model('User', UserSchema)
module.exports = { User }
