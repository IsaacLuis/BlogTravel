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
    posts: [{ 
        type: Schema.Types.ObjectId, ref: 'Post' 
    }]
  },
  {
    timestamps: true
  }
);

module.exports = model('UserProfile', profileSchema);

