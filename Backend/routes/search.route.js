const express = require("express");
const mongoose = require("mongoose");
const SearchModel = require("../Models/search.model");

const searchRouter = express.Router();

searchRouter.get("/get-allQuestions", async (req, res) => {
  try {
    const { title } = req.query;

    const query = title ? { title: { $regex: title, $options: "i" } } : {};

    const questions = await SearchModel.find(query);

    res.status(200).json({
      message: title
        ? "Filtered questions retrieved successfully"
        : "All questions retrieved",
      questions,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving questions",
      error: error.message,
    });
  }
});
module.exports=searchRouter;