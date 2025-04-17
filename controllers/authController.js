const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const createToken = (user, status, req, res) => {
  const token = signToken(user._id);
  console.log(process.env.COOKIE_EXPIRY);
  res.cookie("token", token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "none",
    secure: false,
  });
  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(status).json({
    status: "success",
    token: token,
    data: user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstname: req.body.firstname,
    middlename: req.body.middlename,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // User registered successfully send the token
  createToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for email and password
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // Try to get user
  const user = await User.findOne({ email: email }).select("+password");

  // Check if user exists and password is correct
  if (!user || !(await user.checkPassword(password))) {
    return next(new AppError("Invalid email and password!", 401));
  }

  // Everything is ok send the token
  createToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.body?.token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      data: "You are not authorized to access this route",
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  req.user = await User.findById(decoded.id);

  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        status: "error",
        data: "You do not have permission to access this route.",
      });
    }
    next();
  };
