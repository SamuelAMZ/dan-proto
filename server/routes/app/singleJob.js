const express = require("express");
const SingleJobRoute = express.Router();

// validation lib
const Joi = require("@hapi/joi");

// models
const Job = require("../../models/job");

SingleJobRoute.post("/", async (req, res) => {
  // check if user exist already by email
  try {
    const job = await Job.find({ _id: req.body.jobId });

    // success message
    return res.status(200).json({
      payload: job,
      code: "ok",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error finding user",
      code: "bad",
    });
  }
});

module.exports = SingleJobRoute;
