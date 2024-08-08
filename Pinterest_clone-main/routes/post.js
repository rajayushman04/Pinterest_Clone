const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Post schema
const postSchema = new Schema({
  imageText: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Array,
    default: []
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Create the Post model from the schema
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
