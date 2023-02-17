const { Schema, model } = require('mongoose');

const profileSchema = new Schema(
  {
  
    fullname:{
      type: String,
    },
    bio:{
      type: String,
    },
    imageUrl:{
      type: String,
    },
    powner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true
  }
);

module.exports = model('UserProfile', profileSchema);

