// Wraps an async route handler so that any thrown error is passed to Express'
// error middleware instead of crashing the request (works on Express 4 and 5).
export default function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
