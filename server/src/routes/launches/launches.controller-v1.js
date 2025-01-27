const { launches } = require("../../models/launches.model");

function getAllLaunches(req, res) {
  // returns an iterable of values in the map
  // creates an array from an iterable object.
  // @param iterable — An iterable object to convert to an array.
  return res.status(200).json(Array.from(launches.values()));
}

module.exports = {
  getAllLaunches,
};
