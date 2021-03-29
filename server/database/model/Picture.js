const mongoose = require("mongoose");

const pictureSchema = new mongoose.Schema({
  clound_path: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Picture", pictureSchema);
