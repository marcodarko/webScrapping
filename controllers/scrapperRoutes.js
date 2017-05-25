
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

var express = require("express");
var Article = require('../models/articles.js');
var Comment = require('../models/comments.js');

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

mongoose.Promise = Promise;


var router = express.Router();

// Create the Schema class
var Schema = mongoose.Schema;

// URI's
//var uri = "mongodb://<dbusername>:<password>@ds149551.mlab.com:49551/heroku_zlww6fwt";
var uri = "mongodb://localhost/zoo";

mongoose.connect(uri);

// mongoose.model('Actor', new Articles);

var db = mongoose.connection;


// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


//db.Articles.create({headline:"this", headlineLink: "that", summary:"all of this"});

router.get('/', function(req, res){
  res.render('index');
});

// Retrieve data from the db
router.get("/saved", function(req, res) {
  // Find all results from the Articles collection in the db
  Article.find({saved: true}).populate('comments').exec(function(error, found) {
    // Throw any errors to the console
    if (error) {
      res.render('error');
    }
    // If there are no errors, send the data to the browser as a json
    else {
    	var hbsObject={
        articles: found
      	}
      res.render("saved", hbsObject);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
router.get("/scrape", function(req, res) {
  // Make a request for the news section of ycombinator
  request("http://www.nytimes.com/pages/todayspaper/index.html?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=More/Today%27s%20Paper&contentPlacement=2&pgtype=Homepage?campaignid=4Q9QY&gclid=CjwKEAjwu4_JBRDpgs2RwsCbt1MSJABOY8anz1FwAitlmLi6pOGAyWtuKM6k4u2KMufytJBNesw7VBoCdSzw_wcB", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $(".story").each(function(i, element) {

    	console.log("found item #"+i);
    	 // Save the text of each link enclosed in the current element
      var headline = $(this).find("a").text();

      console.log(headline);
      // Save the text of each link enclosed in the current element
      var headlineLink = $(this).find("a").attr("href");
      // Save the href value of each link enclosed in the current element
      var summary = $(this).find("p.summary").text();

      // If this title element had both a title and a link
      if (headline && headlineLink && summary) {

      	console.log("saving one item!");

      	var newArticle = new Article({
          headline: headline,
          link: headlineLink,
          summary: summary
        });

        newArticle.save(
        function(error, saved) {
          // If there's an error during this query
          if (error) {
            console.log("ERROR: "+error);
          }
          
        });
      }
    });
  });
// once done, redirect to results view 
  res.redirect('/results');
});

router.get('/results', function(req, res){

    // Find all results from the Articles collection in the db
  Article.find({saved: false},function(error, found) {
    // Throw any errors to the console
    if (error) {
      return res.render('error');
    }
    // If there are no errors, send the data to the browser as a json
    else {
      var hbsObject={
        articles: found
        }
      res.render("results", hbsObject);
    }
  });

});

router.put('/id/:id', function(req, res){

  var ID= req.params.id;

  Article.update({_id: ID},{ $set:{saved: true} }, function(error, updated){
      if (error) {
      res.render('error');
    }
    else{
      res.redirect('/results');
    }
  })

});

router.put('/remove/:id', function(req, res){

  var ID= req.params.id;

  Article.update({_id: ID},{ $set:{saved: false} }, function(error, updated){
      if (error) {
      res.render('error');
    }
    else{
      res.redirect('/saved');
    }
  })

});

router.put('/comment/:id', function(req, res){

  var ID= req.params.id;
  var YourComment= req.body.comment;

  var newComment = new Comment({
    comment: YourComment
  });

  Article.findOneAndUpdate({_id: ID}, { $push: { "comments": newComment } }, function(error, documentUpdated) {
      if (error) {
      res.render('error');
    }
    else{
      res.redirect('/saved');
    }
  });

});



// Export routes for server.js to use.
module.exports = router;



