const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  choice: {
    type: Array,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    max: 255,
  },
});

module.exports = mongoose.model("Quiz", quizSchema);
