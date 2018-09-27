var request = require("request")

// Set up Express

var express = require("express");
var bodyParser = require("body-parser")

var app = express();

var PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up Express Handlebars

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up Scraping Tools

var axios = require("axios");
var cheerio = require("cheerio");

// Set up DataBase

var mongoose = require("mongoose");

    // Development database setup
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true })

    // Depoyment database setup
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);

// Require all Models
var db = require("./models")

// Routes

app.get("/", function(req, res) {
    // display exphbs page with all data
});

// app.get("/scrape", function(req,res) {

//     axios.get("").then(function(response) {
//         var $ = cheerio.load(response.data);

//         $("article.has-image").each(function(i, element) {
//             var result = {};

//             result.first = $(this)
//             result.sub = $(this).children("div.item-info").children("h2").children("a")

//             console.log(result)
//         })
//     })
// })

axios.get("https://www.npr.org/sections/news/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("article.has-image").each(function(i, element) {
        var result = {};

        result.title = $(this).children("div.item-info").children("h2").children("a").text()
        result.image = $(this).children("div.item-image").children("div.imagewrap").children("a").children("img").attr("src")
        result.link = $(this).children("div.item-info").children("h2").children("a").attr("href")

        console.log(result)
    })
    res.send("done")
})