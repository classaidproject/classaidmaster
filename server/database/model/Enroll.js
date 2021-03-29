const mongoose = require("mongoose");

const enrollSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    max: 255,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    max: 255,
  },
  score: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Enroll", enrollSchema);
