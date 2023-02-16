// middleware/route-guard.js
const Post = require('../models/Post.model')
// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/users/login');
    }
    next();
  };
  
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
const isLoggedOut = (req, res, next) => {
if (req.session.user) {
  return res.redirect('/');
} 
next();
};

const isOwner = (req, res, next) => {

    Post.findById(req.params.id)
    .populate('owner')
    .then((foundPosts) => {
        if (!req.session.user || foundPosts.owner._id.toString() !== req.session.user._id) {
            res.render('index.hbs', {errorMessage: "You are not authorized."})
        } else {
            next()
        }
    })
    .catch((err) => {
        console.log(err)
    })

}

const isNotOwner = (req, res, next) => {

    Post.findById(req.params.id)
    .populate('owner')
    .then((foundPosts) => {
        if (!req.session.user || foundPosts.owner._id.toString() === req.session.user._id) {
            res.render('index.hbs', {errorMessage: "You can't review your own room."})
        } else {
            next()
        }
    })
    .catch((err) => {
        console.log(err)
    })

}

module.exports = {
    isLoggedIn,
    isLoggedOut,
    isOwner,
    isNotOwner
    };