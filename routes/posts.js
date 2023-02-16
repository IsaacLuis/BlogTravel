
var express = require('express');
var router = express.Router();

// owner has to be defined in middleware
const { isLoggedIn, isOwner, isNotOwner } = require('../middleware/route-guard')

const fileUploader = require('../config/cloudinary.config');

const Post = require('../models/Post.model')

const Review = require('../models/Review.model')


// ******Create Post*******
router.get('/newPost', isLoggedIn,  (req, res, next) => {
    res.render('posts/newPost.hbs');
  });

  router.post('/newPost', isLoggedIn, fileUploader.single('imageUrl'),  (req, res, next) => {

    const { name, description, imageUrl } = req.body

    Post.create({
        name,
        description,
        imageUrl: req.file.path,
        owner: req.session.user._id
    })
    .then((createdPost) => {
        console.log(createdPost)
        res.redirect('/posts/all-posts')
    })
    .catch((err) => {
        console.log(err)
    })

})

// ******All Posts*******
router.get('/all-posts', (req, res, next) => {
    const user = req.session.user
    Post.find()
    .populate('owner')
    .then((foundPosts) => {
        res.render('posts/all-posts.hbs', { foundPosts,user });
    })
    .catch((err) => {
        console.log(err)
    })

});

// ******Details*******
router.get('/details/:id', (req, res, next) => {
    
    Post.findById(req.params.id)
    .populate('owner')
    .populate({
        path: "reviews",
        populate: {path: "user"}
    })
    .then((foundPosts) => {
        res.render('posts/post-details.hbs', foundPosts)
    })
    .catch((err) => {
        console.log(err)
    })

})

// ****** My  Details*******
router.get('/mydetails/:id', (req, res, next) => {
    
    Post.findById(req.params.id)
    .populate('owner')
    .populate({
        path: "reviews",
        populate: {path: "user"}
    })
    .then((foundMyDetailPosts) => {
        res.render('posts/posts-mydetails.hbs', foundMyDetailPosts)
    })
    .catch((err) => {
        console.log(err)
    })

})




// ******Review*******


router.post('/add-review/:id', isNotOwner, (req, res, next) => {

    Review.create({
        user: req.session.user._id,
        comment: req.body.comment
    })
    .then((newReview) => {
       return Post.findByIdAndUpdate(req.params.id, 
            {
                $push: {reviews: newReview._id}
            },
            {new: true})
    })
    .then((postWithReview) => {
        console.log(postWithReview)
        res.redirect(`/posts/details/${req.params.id}`)
    })
    .catch((err) => {
        console.log(err)
    })
})

// ******Edit*******


router.get('/edit/:id', isOwner, (req, res, next) => {

    Post.findById(req.params.id)
    .then((foundPosts) => {
        res.render('posts/edit-posts.hbs', foundPosts)
    })
    .catch((err) => {
        console.log(err)
    })
})

router.post('/edit/:id', fileUploader.single('imageUrl'), (req, res, next) => {
    const { name, description} = req.body
    Post.findByIdAndUpdate(req.params.id, 
        {
            name, 
            description,
            imageUrl: req.file.path,
        },
        {new: true})
    .then((updatedPost) => {
        console.log(updatedPost)
        res.redirect(`/posts/details/${req.params.id}`)
    })
    .catch((err) => {
        console.log(err)
    })
}) 

// ******Delete*******

router.get('/delete/:id', isOwner, (req, res, next) => {
    Post.findByIdAndDelete(req.params.id)
    .then((deleted) => {
        console.log(deleted)
        res.redirect('/posts/all-posts')
    })
    .catch((err) => {
        console.log(err)
    })
})

// ****** All My Posts*******

router.get('/myposts/:id', (req, res, next) => {
    const user = req.session.user

    Post.find({owner: req.params.id})
    .populate('owner')
    .then((foundMyPosts) => {
        console.log(req.params.id)
        res.render('posts/myposts.hbs', { foundMyPosts,user });
    })
    .catch((err) => {
        console.log(err)
    })

});






module.exports = router;
