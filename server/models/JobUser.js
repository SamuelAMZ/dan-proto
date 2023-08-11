const mongoose = require("mongoose");

const JobUsers = new mongoose.Schema(
  {
    uid: {
      type: String,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
    },
    resume_file: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    years_exp: {
      type: Number,
    },
    visa_sponsorship_required: {
      type: Boolean,
    },
    work_visa_held: {
      type: String,
    },
    open_to_relocation: {
      type: Boolean,
    },
    linkedin_url: {
      type: String,
    },
    github_url: {
      type: String,
    },
    personal_website: {
      type: String,
    },
    security_clearance: {
      type: String,
    },
    country: {
      type: String,
    },
    address: {
      type: String,
    },
    userSkills: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("jobUsers", JobUsers);
