const mongoose = require('mongoose');
// const User = require('./User');

const { Schema } = mongoose;
const BlogPostSchema = new Schema({
  message_id: Number,
  chat_id: Number,
  username: String,
  text: String,
  responseText: String,
  date: {
    type: Date,
    default: new Date(),
  },
});
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
/* userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }, */

module.exports = BlogPost;
