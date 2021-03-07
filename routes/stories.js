const express = require('express');
const routes = express.Router();
const passport = require('passport');

const {
    ensureAuth
} = require('../middleware/auth');

const Story = require('../models/Story');



// @desc Show Add Page
// @route GET /stories/add
routes.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
});


//@desc post stories
//@route POST / /stories/add
routes.post('/', ensureAuth, async (req, res) => {
    try {

        req.body.user = req.user.id;
        await Story.create(req.body);

        res.redirect('/dashboard');
        // res.render('dashboard', {
        //     name: req.user.firstName,
        //     stories : x
        // });
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
})

// @desc Show All Stories
// @route GET /stories/add

routes.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
                status: 'public'
            })
            .populate('user')
            .sort({
                createdAt: 'desc'
            })
            .lean()
        res.render('stories/index', {
            stories
        });
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
});

// @desc Show Edit Page
// @route GET /stories/add

routes.get('/edit/:id', ensureAuth, async (req, res) => {

    try {

        const story = await Story.findOne({
            _id: req.params.id
        }).lean()

        if (!story) {
            res.render('error/404');
        }

        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            res.render('stories/edit', {
                story,
            })
        }

    } catch (error) {

        console.log(error);
        return res.render('error/500');

    }



});

// @desc Update Post
// @route PUT /stories/:id

routes.put('/:id', ensureAuth, async (req, res) => {

    try {

        let story = await Story.findById(req.params.id);

        if (!story) {
            res.render('error/404');
        }

        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {

            story = await Story.findOneAndUpdate({
                _id: req.params.id
            }, req.body, {
                new: true,
                runValidators: true
            });

            res.redirect('/dashboard');
        }

    } catch (error) {

        console.log(error);
        return res.render('error/500');

    }

});

// @desc Delete story
// @route DELETE / stories/:id
routes.delete('/add', ensureAuth, async (req, res) => {

    try {

        await Story.remove({
            _id: req.params.id
        });
        res.redirect('/dashboard');

    } catch (error) {

        console.log(error);
        return res.render('error/500');

    }

});

// @desc Show Single Story
// @route GET / stories / :id
routes.get('/:id', ensureAuth, async (req, res) => {

    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean()

        if (!story) {
            return res.render('error/404');
        }

        res.render('stories/show', {
            story
        })

    } catch (error) {

        console.log(error)
        res.render('error/404');

    }

});

// @desc User Stories 
// @route GET /stories/user/:userid
routes.get('/user/:userId', ensureAuth, async (req, res) => {

    try {

        const stories = await Story.find({
                user: req.params.userId,
                status: 'public'
            })
            .populate('user')
            .lean()

        res.render('stories/index', {
            stories
        })

    } catch (error) {

        console.log(error)
        res.render('error/500')

    }

});



module.exports = routes;