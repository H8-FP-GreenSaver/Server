module.exports = function errorHandler(error, req, res, next) {
  let status = error.status || 500;
  let message = error.message || "Internal Server Error";

  switch (error.name) {
    case "InvalidInput":
      status = 400;
      message = "Email / Password is required";
      break;
    case "SequelizeValidationError":
      status = 400;
      message = error.errors[0].message;
      break;
    case "InvalidUser":
      status = 401;
      message = "Invalid Email / Password";
      break;
    case "Invalid Token":
    case "JsonWebTokenError":
      status = 401;
      message = "Unauthenticated";
      break;
    case "Forbidden":
      status = 403;
      message = "You are not authorized";
      break;
    case "NotFound":
      status = 404;
      message = "Data not found";
      break;
  }
  res.status(status).json({ message });
};
