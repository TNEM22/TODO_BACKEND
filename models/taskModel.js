const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: [true, "Task cannot be created without project."],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Task cannot be created without user."],
  },
  title: {
    type: String,
    required: [true, "Title must be set."],
    trim: true,
  },
  note: {
    type: String,
    required: [true, "Note must be set."],
    trim: true,
  },
  milestones: [String],
  completedMilestones: [String],
  assignedDate: Date,
  comments: [String],
  pinned: [String],
  collaborators: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  status: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
