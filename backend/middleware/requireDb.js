import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

// Notes routes need MongoDB. If the database is down we answer with a clear
// 503 instead of letting the request hang. (AI routes still work without it.)
export default function requireDb(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return next(
      new AppError(
        503,
        "The database is not connected right now. Check MONGODB_URI in backend/.env and your Atlas network access settings."
      )
    );
  }
  next();
}
