import mongoose from "mongoose";
import dns from "node:dns";

// Some home routers/ISPs refuse the SRV lookup Atlas needs (querySrv ECONNREFUSED).
// Using public DNS servers for Node avoids that.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Connects to MongoDB Atlas. If it fails we log a friendly message but keep the
// server running, so the AI features still work while you fix the database.
export default async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      "[db] MONGODB_URI is not set. Saved Notes will not work until you add it to backend/.env"
    );
    return false;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log("[db] Connected to MongoDB");
    return true;
  } catch (error) {
    console.error(`[db] Could not connect to MongoDB: ${error.message}`);
    console.error(
      "[db] Check your username/password, and that your IP is allowed under Atlas > Network Access."
    );
    return false;
  }
}