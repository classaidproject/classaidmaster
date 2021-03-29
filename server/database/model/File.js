var mongoose = require("mongoose");

var fileSchema = new mongoose.Schema({
  clound_path: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
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
  modify_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = new mongoose.model("File", fileSchema);
