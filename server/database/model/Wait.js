const mongoose = require("mongoose");

const waitSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Wait", waitSchema);
