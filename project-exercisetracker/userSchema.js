const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: String,
  username: { type: String, required: true },
  exercises: [{
    date: String,
    duration: Number,
    description: String,
  }]
})

const User = mongoose.model('User', userSchema)

module.exports = User