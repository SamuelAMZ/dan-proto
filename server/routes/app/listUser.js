const express = require("express");
const ListUserRoute = express.Router();

// validation lib
const Joi = require("@hapi/joi");

// models
const JobUser = require("../../models/JobUser");

ListUserRoute.post("/", async (req, res) => {
  // check if user exist already by email
  try {
    const users = await JobUser.find({}).sort({ createdAt: -1 });

    // success message
    return res.status(200).json({
      payload: users,
      code: "ok",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error finding users",
      code: "bad",
    });
  }
});

module.exports = ListUserRoute;
