const mongoose = require("mongoose");
require('dotenv').config();

// Connect to DB inotebook
const mongooseURI =
  process.env.DB ||
  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const connectToMongo = () => {
  mongoose.connect(mongooseURI, () => {
    console.log("Connected to Mongo Server Successfully");
  });
};
module.exports = connectToMongo;
