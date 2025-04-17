const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");
const projectRouter = require("./routes/projectRoutes");

const globalErrorHandler = require("./utils/globalErrorHandler");

const app = express();

app.use(morgan("dev"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Working...");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);

app.use(globalErrorHandler);

module.exports = app;
