var express = require('express');
var router = express.Router({
    mergeParams: true
}); //merges params from campgrounds and comments together. If you see we are accessing campground id in /new, which is not available
//to use params from other files use mergeParams
var Campground = require("../models/campground");
var Comment = require("../models/comment");


//Comments New
router.get("/new", isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err)
            console.log(err);
        else {
            res.render("comments/new", {
                campground: campground
            });
        }
    })

})
//comments create
router.post("/", isLoggedIn, (req, res) => {
    //lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err)
            res.redirect("/campgrounds")

        } else {
            //create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) console.log(err)
                else {
                    //add username and id to comments and save that comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            })

        }
    })
})
//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        //handles "Node.js back button after logout" problem
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

        return next();
    }
    res.redirect('/login');
}

module.exports = router;