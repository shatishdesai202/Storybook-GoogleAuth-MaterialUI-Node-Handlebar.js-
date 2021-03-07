const express = require('express');
const routes = express.Router();
const passport = require('passport');

// @desc Auth with google
// @route GET /auth/google

routes.get('/google', passport.authenticate('google', {scope:['profile']}));

// routes.get('/', (req, res) => {
//     res.render('login', {
//         layout: 'login'
//     });
// });

//@desc google auth callback
// @ route  GET/auth/google/callback

routes.get('/google/callback',passport.authenticate('google', {failureRedirect: '/'}), (req, res)=>{
    res.redirect('/dashboard');
});

// routes.get('/dashboard', (req, res) => {
//     res.render('dashboard');
// });


//@desc Logout User
// @ route  /auth/logout

routes.get('/logout',(req, res)=>{
    req.logOut();
    res.redirect('/');
});


module.exports = routes;