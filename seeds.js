var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

//starter data
var data = [{
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Campfire with songs"
    },
    {
        name: "Nature's fury",
        image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Camp tent in forest night"
    },
    {
        name: "High hills",
        image: "https://images.unsplash.com/photo-1414016642750-7fdd78dc33d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Best place to travel alone"
    }
]

function seedDB() {
    //Remove all campgrounds
    Campground.deleteMany({}, (err) => {
        if (err)
            console.log(err)
        else
            console.log("Removed campgrounds");
        //Add few campgrounds
        data.forEach((seed) => {
            Campground.create(seed, (err, campground) => {
                if (err)
                    console.log(err);
                else {
                    console.log("Added a campground");
                    //Add comments to the campground
                    Comment.create({
                        text: "A great Place, Wish there was an internet too :(",
                        author: "Camper"
                    }, (err, comment) => {
                        if (err)
                            console.log(err)
                        else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created a new comment");
                        }

                    })
                }

            })
        })
    })



}
module.exports = seedDB;