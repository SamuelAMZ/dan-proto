// init express
const express = require("express");
const app = express();

// libs
const cookieParser = require("cookie-parser");
const cors = require("cors");
const timeout = require("connect-timeout");
const mongoose = require("mongoose");

// loading env variables
require("dotenv").config();

// server loading timeout
app.use(timeout(600000));

// cors
let alloweds = {
  origin: [process.env.DOMAIN],
};
app.use(
  cors({
    origin: (origin, callback) => {
      // Check if the origin is allowed
      if (alloweds.origin.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    optionSuccessStatus: 200,
  })
);

// setting headers globally
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header("Access-Control-Allow-Origin", origin);
  res.set({
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
  });
  next();
});

// connect mongoose
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URI, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to db");
  }
});

const uploadFileRoute = require("./routes/app/uploadFile");

/*   
    @desc: upload files
    @method: POST
    @privacy: public
*/
app.use("/api/upload-file", uploadFileRoute);

// body parsing and limit
app.use(express.json({ limit: "10mb" }));

// cookies
app.use(cookieParser());

// isServer up
app.get("/", (req, res) => {
  res.status(200).send("Server up");
});

// auth routes
const NewUserRoute = require("./routes/auth/newUser");

// app routes
const NewJobUserRoute = require("./routes/app/newUser");
const ListUserRoute = require("./routes/app/listUser");
const ListJobsRoute = require("./routes/app/listJobs");
const JobMatchesRoute = require("./routes/app/jobMatches");
const UserMatchesRoute = require("./routes/app/userMatches");
const SingleJobRoute = require("./routes/app/singleJob");
const SingleUserRoute = require("./routes/app/singleUser");
const ApplyToJob = require("./routes/app/apply");

// routes handlers
/*   
    @desc: new user
    @method: POST
    @privacy: public
*/
app.use("/api/new-user", NewUserRoute);
/*   
    @desc: new job user
    @method: POST
    @privacy: public
*/
app.use("/api/new-job-user", NewJobUserRoute);
/*   
    @desc: list users
    @method: POST
    @privacy: public
*/
app.use("/api/list-users", ListUserRoute);
/*   
    @desc: list jobs
    @method: POST
    @privacy: public
*/
app.use("/api/list-jobs", ListJobsRoute);
/*   
    @desc: find job matches
    @method: POST
    @privacy: public
*/
app.use("/api/job-matches", JobMatchesRoute);
/*   
    @desc: find user matches
    @method: POST
    @privacy: public
*/
app.use("/api/user-matches", UserMatchesRoute);
/*   
    @desc: find single job
    @method: POST
    @privacy: public
*/
app.use("/api/single-job", SingleJobRoute);
/*   
    @desc: find single user
    @method: POST
    @privacy: public
*/
app.use("/api/single-user", SingleUserRoute);
/*   
    @desc: apply to jobs
    @method: POST
    @privacy: public
*/
app.use("/api/apply", ApplyToJob);

// start server
app.listen(process.env.PORT, () =>
  console.log(`app listen on port ${process.env.PORT}`)
);
