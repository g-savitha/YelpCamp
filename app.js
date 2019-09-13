var port = process.env.PORT || 3000;
var app = require('express')();
var bodyParser = require('body-parser');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

var campgrounds = [{
        name: 'Mountain Hill',
        image: 'https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg'
    },
    {
        name: 'Norway',
        image: 'https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_1280.jpg'
    },
    {
        name: 'Long Caves',
        image: 'https://cdn.pixabay.com/photo/2016/11/29/04/17/bonfire-1867275_1280.jpg'
    }
];

app.get('/', (req, res) => {
    res.render("landing");
})

app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', {
        campgrounds: campgrounds
    })
})

app.get('/campgrounds/new', (req, res) => {
    res.render("new");
})


//REStful convention
app.post('/campgrounds', (req, res) => {
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    //add to campground array
    var newCampground = {
        name: name,
        image: image
    };
    campgrounds.push(newCampground);
    //redirect back to campground
    res.redirect('/campgrounds');
})


app.listen(port, () => {
    console.log("Yelpcamp is started on Server: " + 3000);
})