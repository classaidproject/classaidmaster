const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
    min: 6,
    max: 6,
  },
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  picture: {
    type: Object,
    default: null,
  },
  author_id: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
});

module.exports = mongoose.model("Course", courseSchema);
