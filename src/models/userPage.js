const mongoose = require("mongoose")

const userPageSchema = new mongoose.Schema({
  ownerID: {
    type: String,
    required: true
  },
  ownerDisplayName: {
    type: String,
    required: true
  },
  posts: [{
    title: {
      type: String,
      maxlength: 50
    },
    content: {
      type: String,
      maxlength: 200
    },
    comments: [{
      commenter: {
        type: String
      },
      content: {
        type: String
      }
    }]
  }]
})

module.exports = mongoose.model("userpage", userPageSchema)