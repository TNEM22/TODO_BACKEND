const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title must be present."],
    trim: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  columns: [columnSchema],
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
