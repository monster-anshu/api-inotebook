const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema for the user
const usrSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Svae Data in 'user' collection
module.exports = mongoose.model("user", usrSchema);
