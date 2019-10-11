var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route

router.get('/', (req, res) => {
    res.render("landing");
})

//========================//
//Auth ROUTES
//========================//

//register route

router.get('/register', (req, res) => {
    res.render('register');
})
//signup logic - register the user and login using passport.authenticate if there is no error
router.post('/register', (req, res) => {
    var newUser = new User({
        username: req.body.username
    });
    var password = req.body.password;
    User.register(newUser, password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register")
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect("/campgrounds");
        })
    })
})

//login route

router.get('/login', (req, res) => {
    res.render('login');
})

//login logic - validate the signed up user and login if its correct and redirect to new page
//router.post('/login',middleware-> given by passport-local-mongoose [passport.use(new LocalStrategy(User.authenticate()));],callback)

router.post('/login', passport.authenticate('local', {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {

})
//logout route

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
})
//=======================//

//middleware to verify the session of a user
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        //handles "Node.js back button after logout" problem
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

        return next();
    }
    res.redirect('/login');
}

module.exports = router;