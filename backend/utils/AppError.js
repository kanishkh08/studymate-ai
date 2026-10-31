// A small custom error that carries an HTTP status code.
// Throw it anywhere in the backend: new AppError(400, "Notes are required.")
// The error handler in middleware/errorHandler.js turns it into a JSON response.
export default class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}
