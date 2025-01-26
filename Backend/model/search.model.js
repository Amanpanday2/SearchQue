const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  {
    timestamps: false,
  }
);

const SearchModel = mongoose.model("search", searchSchema);

module.exports = SearchModel;
