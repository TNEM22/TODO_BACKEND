const globalErrorHandler = async (err, req, res, next) => {
  console.log(err);
  if (err.code === 11000) {
    res.status(400).json({
      status: "error",
      message: "Already registered.",
      data: err.keyValue,
    });
  } else if (err.errors) {
    const errors = async (err, req, res, next) => {
      const result = Object.fromEntries(
        Object.entries(err).map(([key, value]) => [
          key,
          { message: value.message },
        ])
      );
      res.status(400).json({
        status: "error",
        message: result,
      });
    };
    await errors(err.errors, req, res, next);
  } else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    res.status(401).json({
      status: "error",
      message: "Not able to verify the token, please login again.",
    });
  } else if (err.statusCode) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.msg,
    });
  } else {
    // console.log(err);
    console.log(Object.keys(err));
    console.log("error propagated here...");
    res.status(500).json({
      status: "error",
      message: "Some error occurred at server side.",
    });
  }
};

module.exports = globalErrorHandler;
