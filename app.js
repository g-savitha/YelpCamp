var port = process.env.PORT || 3000;
var app = require('express')(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    seedDB = require("./seeds")
// Comment = require("./models/user")


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
seedDB();


app.get('/', (req, res) => {
    res.render("landing");
})
//index route
app.get('/campgrounds', (req, res) => {
    //Get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (err)
            console.log(err);
        else {
            res.render('index', {
                campgrounds: allCampgrounds
            })
        }
    })

})
//new route
app.get('/campgrounds/new', (req, res) => {
    res.render("new");
})

// NOTe: Always declare new route before show route, (because new also follows an id,)so that App doesnt get confused between and new and show route

//show route - shows more info about  one campground
//ids will be generated by mongo
app.get('/campgrounds/:id', (req, res) => {
    //find the campground with provided ID - FindByID from mongo
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err)
            console.log(err);
        else {
            console.log(foundCampground)
            //generate a show template with that campground
            res.render("show", {
                campground: foundCampground
            });

        }
    })
})

//Create Route
app.post('/campgrounds', (req, res) => {
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    //add to campground array
    var newCampground = {
        name: name,
        image: image,
        description: description
    };
    //create a new Campground and save to DB
    Campground.create(newCampground, (err, newCamp) => {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campground - get route
            res.redirect('/campgrounds');
        }
    })

})


app.listen(port, () => {
    console.log("Yelpcamp is started on Server: " + 3000);
})