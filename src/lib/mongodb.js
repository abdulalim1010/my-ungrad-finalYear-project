import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "departmentDB";

const isServerRuntime = typeof window === "undefined" && process.env.NODE_ENV !== "production";

if (!MONGODB_URI && isServerRuntime) {
  console.warn("Warning: MONGODB_URI environment variable is not set");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents creating too many connections during
 * development and causing issues.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/**
 * MongoDB client for native MongoDB operations
 * Used by gallery page and other places requiring native driver
 */
let mongoClientPromise = null;

async function getClient() {
  if (!MONGODB_URI) {
    return null;
  }

  if (typeof window !== "undefined") {
    throw new Error("Please use the server-side version of this function");
  }

  // Create a new client each time to avoid caching issues
  const client = new MongoClient(MONGODB_URI);
  return client.connect();
}

const clientPromise = MONGODB_URI ? getClient() : null;

// Export Payment model
const PaymentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export { dbConnect, clientPromise, Payment };
export default dbConnect;

