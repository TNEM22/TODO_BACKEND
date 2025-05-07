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
    columns: [{ title: "To Do" }, { title: "In Progress" }, { title: "Done" }],
  });

  res.status(201).json({
    status: "success",
    data: newProject,
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const projectId = req.body.id;
  const newColumns = req.body.columns;

  // Fetch the current project
  const existingProject = await Project.findById(projectId);
  if (!existingProject) {
    return res.status(404).json({
      status: "error",
      message: "Project not found",
    });
  }

  // Identify removed columns
  const oldColumns = existingProject.columns;

  const newIds = newColumns.map((col) => col._id.toString());
  const oldIds = oldColumns.map((col) => col._id.toString());

  const removedIds = oldIds.filter((item) => !newIds.includes(item.toString()));
  // console.log("Old columns:", oldColumns);
  // console.log("Removed Ids:", removedIds);

  // Delete tasks that had status in removed columns if any
  if (removedIds.length > 0) {
    await Task.deleteMany({
      projectId,
      status: { $in: removedIds },
    });
  }

  // Update the project with new columns
  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      title: req.body.title,
      // columns: req.body.columns,
      columns: newColumns,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedProject,
  });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const deletedProject = await Project.findByIdAndDelete(req.body.id);
  if (!deletedProject) {
    res.status(404).json({
      status: "error",
    });
  } else {
    // Delete all tasks related to project
    await Task.deleteMany({ projectId: req.body.id });

    res.status(204).json({
      status: "success",
    });
  }
});

exports.getTasks = catchAsync(async (req, res, next) => {
  if (!req.params.id || req.params.id === "undefined") {
    return res.status(400).json({
      status: "error",
      message: "Project ID is required",
    });
  }

  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({
      status: "error",
      message: "Project not found",
    });
  }

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

exports.updateTask = catchAsync(async (req, res, next) => {
  const updatedTask = await Task.findByIdAndUpdate(req.body.id, {
    title: req.body.title,
    note: req.body.note,
    milestones: req.body.milestones,
    completedMilestones: req.body.completedMilestones,
    assignedDate: req.body.assignedDate,
  });

  res.status(200).json({
    status: "success",
    data: updatedTask,
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
  const { id, status, statusTitle } = req.body;
  const query = {
    status: status,
  };

  if (statusTitle === "done") {
    const task = await Task.findById(id);
    query.completedMilestones = task.milestones;
  }

  await Task.findByIdAndUpdate(id, query);

  res.status(200).json({
    status: "success",
  });
});
