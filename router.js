// Router Setup
var express = require("express")
var router = express.Router();
var db = require("./models")

// Set up Scraping Tools

var axios = require("axios");
var cheerio = require("cheerio");

// Routes



router.get("/", function(req, res) {

    db.Article.find({}).then(function(articles) {
        res.render("index", {articles: articles})
    }).catch(function(err) {
        res.json(err)
    }) 
});

router.get("/scrape", function(req,res) {
    axios.get("https://www.npr.org/sections/news/").then(function(response) {
        var $ = cheerio.load(response.data);

        var length = $("article.has-image").length;
        
        $("article.has-image").each(function(i, element) {
            var result = {};
            
            result.title = $(this).children("div.item-info-wrap").children("div.item-info").children("h2").children("a").text()
            result.image = $(this).children("div.item-image").children("div.imagewrap").children("a").children("img").attr("src")
            result.link = $(this).children("div.item-info-wrap").children("div.item-info").children("h2").children("a").attr("href")
            
            // For quick debugging if NPR changes their layout again.
            // console.log(result)

            // Check if an Article with that link already exists
            db.Article.findOne({ 'link': result.link}, function (err,item) {
                console.log(item)
                if (!item) {
                    db.Article.create(result)
                    .then(function(dbArticle) {
                        console.log(dbArticle)
                    })
                    .catch(function(err) {
                        return res.json(err);
                    });
                } else {
                    console.log("Article already in Database: \n" + result )
                }
                // Send back Completion Result
                if (i === length -1) {
                    res.redirect("back")
                }

            })
        });
    })
});

router.get("/articles", function(req, res) {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle)
    }).catch(function(err) {
        res.json(err)
    })
});

router.get("/articles/:id", function(req, res) {
    var reqId = req.params.id;

    db.Article.find({ _id: reqId }).populate("Note")
        .then(function(dbArticle) {
            res.json(dbArticle)
        })
        .catch(function(err) {
            res.json(err)
        });
})

router.get("/notes/:id", function(req, res) {
    var reqId = req.params.id;

    db.Note.find({ _id: reqId }).populate("Note")
        .then(function(note) {
            res.json(note)
        })
        .catch(function(err) {
            res.json(err)
        });
})

router.post("/articles/:id", function(req, res) {

    console.log("Req.Body: " + req.body)
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id}, { $set: { note: dbNote._id } });
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err)
      })
})

router.delete("/notes/delete/:id", function(req, res) {

    db.Note.deleteOne({  _id: req.params.id })
    .then(function(response) {
        res.json(response)
    })

})

router.delete("/articles/delete", function(req, res) {

    db.Article.remove({}).then(response => console.log(response))

    res.redirect("back")
    
});

module.exports = router;