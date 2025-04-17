const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const catchAsync = require("../utils/catchAsync");

exports.getProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find({ userId: req.user._id });

  res.status(200).json({
    status: "success",
    data: projects,
  });
});

exports.createProject = catchAsync(async (req, res, next) => {
  const newProject = await Project.create({
    title: req.body.title,
    userId: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: newProject,
  });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const deletedProject = await Project.findByIdAndDelete(req.body.id);
  if (!deletedProject) {
    res.status(404).json({
      status: "error",
    });
  } else {
    res.status(204).json({
      status: "success",
    });
  }
});

exports.getTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ projectId: req.params.id });

  res.status(200).json({
    status: "success",
    data: tasks,
  });
});

exports.createTask = catchAsync(async (req, res, next) => {
  const newTask = await Task.create({
    projectId: req.body.projectId,
    userId: req.user._id,
    title: req.body.title,
    note: req.body.note,
    milestones: req.body.milestones,
    completedMilestones: req.body.completedMilestones,
    assignedDate: req.body.assignedDate,
    comments: req.body.comments,
    pinned: req.body.pinned,
    collaborators: req.body.collaborators,
    status: req.body.status,
  });

  res.status(201).json({
    status: "success",
    data: newTask,
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const deletedTask = await Task.findByIdAndDelete(req.body.id);
  if (!deletedTask) {
    res.status(404).json({
      status: "error",
    });
  } else {
    res.status(204).json({
      status: "sucess",
    });
  }
});

exports.changeTaskStatus = catchAsync(async (req, res, next) => {
  await Task.findByIdAndUpdate(req.body.id, { status: req.body.status });

  res.status(200).json({
    status: "success",
  });
});
