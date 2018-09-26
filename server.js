var request = require("request")

// Set up Express

var express = require("express");
var bodyParser = require("body-parser")

var app = express();

var PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// Set up Express Handlebars

var exphbs = require("express-handlbars");

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