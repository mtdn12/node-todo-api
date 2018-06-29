const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  text:{
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default : Date.now
  }
})

module.exports = Todo = mongoose.model('todos',TodoSchema)