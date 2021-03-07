const GoogleStrategy = require('passport-google-oauth20').Strategy

const mongoose = require('mongoose');

const User = require('../models/User');

//-------- process.env
const dotenv = require('dotenv');
const { use } = require('passport');

// load config
dotenv.config({
    path: './config/config.env'
});

// GOOGLE_CLIENT_ID = '101494032427-vo890f9bhefqj0q19vojtc0kua1g2jre.apps.googleusercontent.com'

// GOOGLE_CLIENT_SECRET = 'd9ap-GsehzGCyZVXA2zFTZw9'


module.exports = function (passport) {

    passport.use(
        new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret:process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback'
            },
            async (accessToken, refreshToken, profile, done) => {
                // console.log(profile);

                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value
                };

                try {
                    let user = await User.findOne({googleId : profile.id});

                    if(user){
                        done(null, user);
                    }else{
                        user = await User.create(newUser);
                        done(null, user);
                    }

                    
                } catch (error) {
                    console.log(error);                    
                }

            }
        )
    )
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
};