const express = require("express");
const SingleUserRoute = express.Router();

// validation lib
const Joi = require("@hapi/joi");

// models
const JobUser = require("../../models/JobUser");

SingleUserRoute.post("/", async (req, res) => {
  // check if user exist already by email
  try {
    const user = await JobUser.find({ _id: req.body.uid });

    // success message
    return res.status(200).json({
      payload: user,
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

module.exports = SingleUserRoute;
