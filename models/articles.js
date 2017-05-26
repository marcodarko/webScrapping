
// Dependency
var mongoose = require("mongoose");

// Create the Schema class
var Schema = mongoose.Schema;

// Instantiate a userSchema object with the Schema class we just made
var ArticleSchema = new Schema({

   headline:{
      type: String,
      required: true,
      unique: true
   },
   summary:{
      type: String,
      required: true
   },
   link:{
      type: String
   },
   date:{
      type: Date,
      default: Date.now
   },
    // notes property for the user
   comments: {
      type: Array
   }
   ,
    saved: {
      type: Boolean,
      default: false
  }

});

// Create the "User" model with our UserSchema schema
var Article = mongoose.model("Article", ArticleSchema);



// Export the User model, so it can be used in server.js with a require
module.exports = Article;
