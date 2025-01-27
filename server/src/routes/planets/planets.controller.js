const { getAllPlanets } = require("../../models/planets.model");

// v1 before connect to MongoDB
// function httpGetAllPlanets(req, res) {
// return res.status(200).json(getAllPlanets());
// }

// v2 after connect to MongoDB
async function httpGetAllPlanets(req, res) {
  return res.status(200).json(await getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
