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

// Set up DataBase

var mongoose = require("mongoose");

    // Development database setup
// mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true })

    // Deployment database setup
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routing
var routes = require("./router.js")
app.use('/', routes);

app.listen(PORT, function () {
    console.log("Server listening on : http://localhost:" + PORT);
})