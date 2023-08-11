const express = require("express");
const NewUserRoute = express.Router();

// validation lib
const Joi = require("@hapi/joi");

// prisma
const { PrismaClient } = require("@prisma/client");

// models
const JobUser = require("../../models/JobUser");

// helpers
const parsePdf = require("../../utils/parsePdf");
const sendPrompt = require("../../utils/sendPrompt");

// bot
const scrapeLinkedin = require("../../bot/linkedin");

const schema = Joi.object({
  first_name: Joi.string().max(255),
  last_name: Joi.string().max(255),
  resume_file: Joi.string().max(255),
  address: Joi.string().max(255),
  email: Joi.string().max(255),
  phone: Joi.string().max(255),
  years_exp: Joi.number().max(255),
  visa_sponsorship_required: Joi.boolean(),
  work_visa_held: Joi.string(),
  open_to_relocation: Joi.boolean(),
  linkedin_url: Joi.string().max(255),
  github_url: Joi.string().max(255),
  personal_website: Joi.string().max(255),
  security_clearance: Joi.string().max(255),
  country: Joi.string().max(255),
  address: Joi.string().max(255),
});

NewUserRoute.post("/", async (req, res) => {
  const prisma = new PrismaClient();

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
    const isExist = await JobUser.find({ email: req.body.email });
    console.log(isExist);
    if (isExist.length >= 1) {
      return res.status(400).json({
        message: `user already exist`,
        code: "bad",
      });
    }
  } catch (error) {
    console.log(error);
  }

  // parse resume file
  const pdfText = await parsePdf(req.body.resume_file);
  console.log(pdfText);

  // scrape user linkedin
  let linkedinDetails = "";
  if (req.body.linkedin_url)
    linkedinDetails = await scrapeLinkedin(req.body.linkedin_url);
  console.log(linkedinDetails);

  // process all details by gpt
  const allDetails = `${pdfText} \n\n ${linkedinDetails}`;
  const aiAnswer = await sendPrompt(allDetails);

  console.log(aiAnswer);

  // create user
  try {
    const aJobUser = new JobUser({ ...req.body, userSkills: aiAnswer?.titles });
    await aJobUser.save();

    // success message
    return res.status(201).json({
      message: `user created successfully`,
      code: "ok",
    });
  } catch (error) {}
});

module.exports = NewUserRoute;
