const {
  getAllLaunches,
  // addNewLaunch, // v1 before connect to MongoDB
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch, // v2 after connect to MongoDB
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

// v1 before connect to MongoDB
// function httpGetAllLaunches(req, res) {
//   return res.status(200).json(getAllLaunches());
// }

// v2 after connect to MongoDB
async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  // because we've added in app.js json parsing middleware -> app.use(express.json())
  // our express server will now take json request and populate req.body parameters with that parsed object
  const launch = req.body;

  // validation for POST requests
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  // modify from string to date
  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  // v1 before connect to MongoDB
  // addNewLaunch(launch);

  // v2 after connect to MongoDB
  await scheduleNewLaunch(launch);
  // console.log(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  // v1 (from tabnine)
  // const aborted = abortLaunchById(launchId);

  // // if launch doesn't exist
  // if (!aborted) {
  //   return res.status(404).json({
  //     error: "Launch not found",
  //   });
  // }

  // // if launch does exist
  // return res.status(200).json(aborted);

  // v1 before connect to MongoDB
  // if (!existsLaunchWithId(launchId)) {
  //   return res.status(404).json({
  //     error: "Launch not found",
  //   });
  // }

  // v2 after connect to MongoDB
  const existsLaunch = await existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch already aborted",
    });
  }

  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
