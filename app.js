var port = process.env.PORT || 3000;
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
seedDB();

//=========================//
//passport configuration

app.use(require("express-session")({
    secret: "Yelpcamp secret code",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//============================//

// res.locals makes currentUser available in all routes
//This middleware should be written after Passport configuration
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})
//REQUIRING ROUTES

//if you observe there's a pattern in all routes of campgrounds
//everey route starts with /campground, to avoid redundancy append /campgrounds to the below code and make changes in campgrounds.js accordingly
app.use("/campgrounds", campgroundRoutes); //this piece of code takes all routes from campgrounds and appends "/campground infront of all of them"
app.use("/", indexRoutes); //there's nothing common in index.js so leave it as it is or  append  "/" to follow th pattern
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port, () => {
    console.log("Yelpcamp is started on Server: " + 3000);
})