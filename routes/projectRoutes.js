const express = require("express");
const projectController = require("../controllers/projectController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(projectController.getProjects)
  .post(projectController.createProject)
  .delete(projectController.deleteProject);

router.get("/:id/task", projectController.getTasks);
router
  .route("/task")
  .post(projectController.createTask)
  .delete(projectController.deleteTask)
  .patch(projectController.changeTaskStatus);

module.exports = router;
