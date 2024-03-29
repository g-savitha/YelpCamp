var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//==========================
//CAMPGROUND ROUTES
//==========================

//index route
router.get("/", (req, res) => {
  //Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) console.log(err);
    else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds
      });
    }
  });
});
//Create Route
router.post("/", isLoggedIn, (req, res) => {
  //get data from form
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  //add to campground array
  var newCampground = {
    name: name,
    image: image,
    description: description,
    author: author
  };
  //create a new Campground and save to DB
  Campground.create(newCampground, (err, newCamp) => {
    if (err) {
      console.log(err);
    } else {
      //redirect back to campground - get route
      console.log(newCamp);
      res.redirect("/campgrounds");
    }
  });
});
//new route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// Note: Always declare new route before show route, (because new also follows an id,)so that router doesnt get confused between and new and show route

//show route - shows more info about  one campground
//ids will be generated by mongo
router.get("/:id", (req, res) => {
  //find the campground with provided ID - FindByID from mongo
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) console.log(err);
      else {
        console.log(foundCampground);
        //generate a show template with that campground
        res.render("campgrounds/show", {
          campground: foundCampground
        });
      }
    });
});

//middleware to verify the session of a user
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    //handles "Node.js back button after logout" problem
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );

    return next();
  }
  res.redirect("/login");
}

module.exports = router;
