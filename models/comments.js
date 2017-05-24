
// +++++++++++++++  COMMENTS SCHEMA ++++++++++++++
// Dependency
var mongoose = require("mongoose");

// Create the Schema class
var Schema = mongoose.Schema;
// Create a NoteSchema with the Schema class
var CommentSchema = new Schema({
  // title: a string
  commentor: {
    type: String,
    default: "Annonymous"
  },
  // body: a string
  comment: {
    type: String
  }
});

// Make a Note model with the NoteSchema
var Comments = mongoose.model("Comments", CommentSchema);

// Export the User model, so it can be used in server.js with a require
module.exports = Comments;