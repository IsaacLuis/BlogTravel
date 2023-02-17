var express = require('express');
var router = express.Router();

/* GET home page. */

const Post = require('../models/Post.model')

router.get('/', (req, res, next) => {
  const user = req.session.user
  Post.find()
  .populate('owner')
  .then((foundPosts) => {
      res.render('index', { foundPosts,user });
  })
  .catch((err) => {
      console.log(err)
  })

});

module.exports = router;
