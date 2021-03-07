const express = require('express');
const routes = express.Router();
const passport = require('passport');

const {
    ensureAuth,
    ensureGuest
} = require('../middleware/auth');

const Story = require('../models/Story');

// @desc Auth with google
// @route GET /auth/google

// routes.get('/google', passport.authenticate('google', {scope:['profile']}));

routes.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    });
});

// @desc google auth callback
// @route  GET/auth/google/callback

// routes.get('/google/callback',passport.authenticate('google', {failureRedirect: '/'}), (req, res)=>{
//     res.redirect('/dashboard');
// });


routes.get('/dashboard', ensureAuth, async (req, res) => {
    console.log(req.user);
    try {

        // const stories = Story.find({ user: req.user.id }).lean();
        const stories = await Story.find({ user: req.user.id }).lean()
        // console.log(req.user.id)
        // console.log(Story.find({ user: req.user.id }).lean());
        
        res.render('dashboard', {
            name: req.user.firstName,
            stories 
        });

    } catch (error) {
        console.log(error);
        res.render('/views/error/500.hbs');
    }
});


module.exports = routes;