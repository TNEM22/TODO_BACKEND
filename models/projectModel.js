const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title must be present."],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
