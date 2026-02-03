import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

// Skip connection if no URI (prevents build errors)
if (!uri) {
  console.warn("MONGODB_URI not defined - using mock connection for build");
  clientPromise = Promise.resolve({
    db: () => ({
      collection: () => ({ countDocuments: () => 0 }),
    }),
  });
} else if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to preserve client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, just create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
