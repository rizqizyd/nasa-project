const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

// v1 before connect to MongoDB
// const habitablePlanets = [];

// v2 after connect to MongoDB
const planets = require("./planets.mongo");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

/**
 * const promise = new Promise((resolve, reject) => {
 * resolve(42);
 * });
 * promise.then((result) => {
 *
 * });
 * const result = await promise;
 * console.log(result);
 */

function loadPlanetsData() {
  // we just using our promise so that we know when our planets data has been successfully loaded
  // createReadStream: only reading the data as bit and bytes
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      // connecting the two streams together
      // readable.pipe(writeable)
      .pipe(
        parse({
          // treat lines that start with # as a comment
          comment: "#",
          // return each row and our csv file as a JS object
          columns: true,
        })
      )
      .on("data", async data => {
        // the results is only raw buffers of bytes (without pipe)
        if (isHabitablePlanet(data)) {
          // v1 before connect to MongoDB
          // habitablePlanets.push(data);

          // -- TODO: Replace below create with insert + update = upsert
          // v2 after connect to MongoDB
          savePlanet(data);
        }
      })
      .on("error", err => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        // v1 before connect to MongoDB
        // console.log(`${habitablePlanets.length} habitable planets found!`);

        // v2 after connect to MongoDB
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        resolve();
      });
  });
}

// v1 before connect to MongoDB
// function getAllPlanets() {
//   return habitablePlanets;
// }

// v2 after connect to MongoDB
async function getAllPlanets() {
  // console.log(await planets.find({}));
  // {} all documents will be returned
  // { _id: 0, __v: 0 } exclude _id and __v to the response
  return await planets.find({}, { _id: 0, __v: 0 });
}

// v2 after connect to MongoDB
async function savePlanet(planet) {
  try {
    // our planets will only be added if it doesn't already exist
    await planets.updateOne(
      {
        keplerName: planet.kepler_name, // "kepler_name" the name of the column that corresponds to the name of planets from kepler_data.csv
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(`Could not save planet ${error}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
