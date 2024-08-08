const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");
const Schema = mongoose.Schema;
mongoose.connect('mongodb://127.0.0.1:27017/NayaApp');
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  dp: {
    type: String, // Assuming dp is a URL to the display picture
    default: ''
  },
  email: {
    type: String,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  }
});

// Create the User model from the schema
userSchema.plugin(plm);
const User = mongoose.model('User', userSchema);

module.exports = User;
