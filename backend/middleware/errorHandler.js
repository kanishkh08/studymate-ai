import AppError from "../utils/AppError.js";

// Runs when no route matched the request.
export function notFound(req, res, next) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Central error handler: every error ends up here and becomes a JSON response
// like { "error": "message" }. Stack traces and secrets are never sent to the client.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let status = 500;
  let message = "Something went wrong on the server. Please try again.";

  if (err instanceof AppError) {
    status = err.statusCode;
    message = err.message;
  } else if (err.type === "entity.too.large") {
    // Thrown by express.json() when the body is bigger than the configured limit.
    status = 413;
    message = "Your request is too large. Please shorten your notes.";
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Invalid JSON in request body.";
  } else if (err.name === "ValidationError") {
    // Mongoose schema validation error.
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(" ");
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID format.";
  } else {
    // Unknown error: log it for the developer, hide the details from the user.
    console.error("Unexpected error:", err);
  }

  res.status(status).json({ error: message });
}
