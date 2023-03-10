const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    name: String,
    description: String,
    imageUrl: String,
    location: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{type: Schema.Types.ObjectId, ref: "Review"}] 
  });

module.exports = model('Post', postSchema);