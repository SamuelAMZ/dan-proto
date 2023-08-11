const express = require("express");
const ApplyToJob = express.Router();

// validation lib
const Joi = require("@hapi/joi");

// models
const JobUser = require("../../models/JobUser");
const Job = require("../../models/job");

// bot
const scrapeSite1 = require("../../bot/site1");
const scrapeSite2 = require("../../bot/site2");

const schema = Joi.object({
  userId: Joi.string().max(255).required(),
  jobIds: Joi.array().max(255).required(),
});

ApplyToJob.post("/", async (req, res) => {
  // joi validation body data
  try {
    const validation = await schema.validateAsync(req.body);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, code: "bad" });
    return;
  }

  try {
    // load user info
    const user = await JobUser.findOne({ _id: req.body.userId });

    // apply one by one
    for (let i = 0; i < req.body.jobIds.length; i++) {
      let jobId = req.body.jobIds[i];

      // find job
      const job = await Job.findOne({ _id: jobId });

      // start bot with the right handler and user data
      if (job && job.indice === "site1") {
        await scrapeSite1(job, user);
      }
      if (job && job.indice === "site2") {
        await scrapeSite2(job, user);
      }
    }

    return res.status(200).json({
      message: "applying...",
      code: "ok",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error when applying",
      code: "bad",
    });
  }
});

module.exports = ApplyToJob;
