const mongoose = require("mongoose");

const Job = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
    },
    jobUrl: {
      type: String,
    },
    indice: {
      type: String,
    },
    terms: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("jobs", Job);
