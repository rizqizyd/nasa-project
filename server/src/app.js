// now we've seperated all of our express middleware from our server functions
// to organize our code just a little bit better
const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const api = require("./routes/api");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
); // return cors middleware

app.use(morgan("combined"));

app.use(express.json());

// we'll serve all of our public files (for "build" folder from client - after npm run build in client folder)
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);
// app.use("/v2", v2Router); // if there any other version

// "*" matches everything that follow the /, so it will match all routes
// when express sees one of these path "/*" that don't match any of the routes above, it will serve the index.html file (react.js / frontend will handle the routing)
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
