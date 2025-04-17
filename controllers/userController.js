const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const Users = await User.find();

  res.status(200).json({
    status: "success",
    results: Users.length,
    data: Users,
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  // console.log(req.user);
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: "success",
    data: user,
  });
});
