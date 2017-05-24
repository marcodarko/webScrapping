//mongodb://<artofmarco@gmail.com>:<Italiano1>@ds149551.mlab.com:49551/heroku_zlww6fwt
// mongolab-deep-19712
// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");

// Initialize Express
var app = express();

const PORT = process.env.PORT || 3000; 

// Listen on port 3000
app.listen(PORT, function(err, res) {
	if (err) throw err;
  console.log("App running on port 3000!");
});

// Use morgan and body parser with our app
app.use(logger("dev"));

// HANDLEBARS

// Set Handlebars.
var exphbs = require("express-handlebars");


app.use(bodyParser.urlencoded({
  extended: false
}));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Make public a static dir
app.use(express.static("public"));


// Import routes and give the server access to them.
var routes = require("./controllers/scrapperRoutes.js");

app.use('/',routes);

