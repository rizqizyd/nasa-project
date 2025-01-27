const mongoose = require("mongoose");

const planetsSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

// Perform action in our mongo database
module.exports = mongoose.model("Planet", planetsSchema);
