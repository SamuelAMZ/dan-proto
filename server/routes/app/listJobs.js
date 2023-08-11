const express = require("express");
const ListJobsRoute = express.Router();

// validation lib
const Joi = require("@hapi/joi");

// models
const Job = require("../../models/job");

ListJobsRoute.post("/", async (req, res) => {
  // check if user exist already by email
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });

    // success message
    return res.status(200).json({
      payload: jobs,
      code: "ok",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error finding jobs",
      code: "bad",
    });
  }
});

module.exports = ListJobsRoute;
