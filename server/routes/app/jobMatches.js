const express = require("express");
const JobMatchesRoute = express.Router();

// validation lib
const Joi = require("@hapi/joi");

// models
const JobUser = require("../../models/JobUser");
const Job = require("../../models/job");

const schema = Joi.object({
  term: Joi.array().max(255).required(),
});

JobMatchesRoute.post("/", async (req, res) => {
  // joi validation body data
  try {
    const validation = await schema.validateAsync(req.body);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, code: "bad" });
    return;
  }

  // check if user exist already by email
  try {
    const jobs = await Job.find({
      terms: { $in: req.body.term.map((term) => new RegExp(term, "i")) },
    }).sort({
      createdAt: -1,
    });

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

module.exports = JobMatchesRoute;
