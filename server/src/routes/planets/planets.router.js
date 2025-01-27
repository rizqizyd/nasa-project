const express = require("express");

const { httpGetAllPlanets } = require("./planets.controller");

const planetsRouter = express.Router();

// v1
// planetsRouter.get("/planets", httpGetAllPlanets);

// v2
planetsRouter.get("/", httpGetAllPlanets);

module.exports = planetsRouter;
