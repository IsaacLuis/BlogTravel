var express = require('express');
var router = express.Router();

const mongoose = require('mongoose')

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model')

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/*  Log in */
router.get('/login', isLoggedOut, (req, res, next) => {
  res.render('auth/login.hbs');
});

router.post('/login', isLoggedOut,  (req, res, next)=>{
  const {email, password} = req.body;
  if (!email || !password) {
    res.render('auth/login.hbs')
    return;
  }

  User.findOne({email})
  .then(user=>{
    if (!user) {
      res.render('auth/login.hbs',  { errorMessage: 'Email is not registered.' });
      return;
    }
    else if (bcryptjs.compareSync(password, user.password)) {
      req.session.user = user;
      console.log(req.session);
      res.redirect('/users/profile');   // /users/profile
    }
    else {
      res.render('auth/login.hbs', { errorMessage: 'Incorrect password.' });
    }
  })
  .catch(error => next(error));
})

/* Sign Up */

router.get('/signup', isLoggedOut,  (req, res, next) => {
  res.render('auth/signup.hbs');
});

router.post('/signup', isLoggedOut, (req, res, next) => {
  
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.render('auth/signup.hbs', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }


  bcryptjs  
    .genSalt(saltRounds)
    .then((salt) => {
      return bcryptjs.hash(password, salt)
    })
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        password: hashedPassword
      });
    })
    .then((userFromDB) => {
      console.log('Newly created user is: ', userFromDB);
      res.redirect('/users/login')
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
           errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }
    })


})

// **********
router.get('/profile', isLoggedIn, (req, res, next) => {
  const user = req.session.user
  console.log('SESSION =====> ', req.session);
  res.render('profile.hbs', { user })
})

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;
