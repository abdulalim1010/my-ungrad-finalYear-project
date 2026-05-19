import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "departmentDB";

const isServerRuntime = typeof window === "undefined" && process.env.NODE_ENV !== "production";

if (!MONGODB_URI && isServerRuntime) {
  console.warn("Warning: MONGODB_URI environment variable is not set");
}

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

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB Atlas');
        return mongoose;
      })
      .catch((err) => {
        console.warn('Failed to connect to MongoDB Atlas:', err.message);
        console.warn('Falling back to local MongoDB...');
        const localUri = 'mongodb://localhost:27017/departmentDB';
        return mongoose.connect(localUri, opts)
          .then((mongoose) => {
            console.log('Connected to local MongoDB');
            return mongoose;
          })
          .catch((localErr) => {
            console.warn('Failed to connect to local MongoDB:', localErr.message);
            console.warn('Creating mock database connection for development...');
            const mockMongoose = {
              connection: {
                readyState: 1,
                db: {
                  name: 'mockDB',
                  collection: () => ({
                    find: () => ({
                      toArray: () => Promise.resolve([]),
                      sort: () => ({
                        toArray: () => Promise.resolve([]),
                        lean: () => ({ exec: () => Promise.resolve([]) })
                      }),
                      lean: () => ({ exec: () => Promise.resolve([]) })
                    }),
                    insertOne: () => Promise.resolve({ insertedId: 'mock-id' }),
                    updateOne: () => Promise.resolve({ modifiedCount: 1 }),
                    deleteOne: () => Promise.resolve({ deletedCount: 1 })
                  })
                }
              },
              models: {},
              model: (name, schema) => {
                const mockModel = {
                  find: () => ({
                    lean: () => ({ exec: () => Promise.resolve([]) }),
                    sort: () => ({
                      lean: () => ({ exec: () => Promise.resolve([]) }),
                      toArray: () => Promise.resolve([]),
                      exec: () => Promise.resolve([])
                    }),
                    exec: () => Promise.resolve([]),
                    toArray: () => Promise.resolve([])
                  }),
                  findById: () => ({
                    lean: () => ({ exec: () => Promise.resolve(null) })
                  }),
                  findOne: () => ({
                    lean: () => ({ exec: () => Promise.resolve(null) })
                  }),
                  create: (data) => Promise.resolve({ ...data, _id: 'mock-id' }),
                  findByIdAndUpdate: () => Promise.resolve({}),
                  findByIdAndDelete: () => Promise.resolve({}),
                  save: () => Promise.resolve({})
                };
                return mockModel;
              }
            };
            return mockMongoose;
          });
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

let mongoClientPromise = null;

async function getClient() {
  if (!MONGODB_URI) {
    return null;
  }

  if (typeof window !== "undefined") {
    throw new Error("Please use the server-side version of this function");
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB Atlas (native client)');
    return client;
  } catch (err) {
    console.warn('Failed to connect to MongoDB Atlas (native client):', err.message);
    console.warn('Falling back to local MongoDB (native client)...');
    try {
      const localUri = 'mongodb://localhost:27017/departmentDB';
      const localClient = new MongoClient(localUri);
      await localClient.connect();
      console.log('Connected to local MongoDB (native client)');
      return localClient;
    } catch (localErr) {
      console.warn('Failed to connect to local MongoDB (native client):', localErr.message);
      console.warn('Creating mock MongoDB client for development...');
      const mockClient = {
        db: () => ({
          collection: () => ({
            findOne: () => Promise.resolve(null),
            find: () => ({
              toArray: () => Promise.resolve([]),
              sort: () => ({ toArray: () => Promise.resolve([]) }),
              limit: () => ({ toArray: () => Promise.resolve([]) })
            }),
            insertOne: () => Promise.resolve({ insertedId: 'mock-id' }),
            updateOne: () => Promise.resolve({ matchedCount: 1, modifiedCount: 1 }),
            deleteOne: () => Promise.resolve({ deletedCount: 1 }),
            countDocuments: () => Promise.resolve(0)
          })
        }),
        close: () => Promise.resolve()
      };
      return mockClient;
    }
  }
}

const clientPromise = MONGODB_URI ? getClient() : null;

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

const mockSettings = {
  find: () => ({
    sort: () => Promise.resolve([]),
    lean: () => ({ exec: () => Promise.resolve([]), then: Promise.resolve([]).then }),
    exec: () => Promise.resolve([]),
    toArray: () => Promise.resolve([]),
    then: Promise.resolve([]).then
  }),
  findOne: () => ({
    lean: () => ({ exec: () => Promise.resolve(null), then: Promise.resolve(null).then })
  }),
  create: (data) => Promise.resolve({ ...data, _id: 'mock-id' }),
  findByIdAndUpdate: () => Promise.resolve({}),
};

const Settings = process.env.NODE_ENV === "production" 
  ? require("@/models/Settings").default 
  : mockSettings;

export { dbConnect, clientPromise, Payment, Settings };
export default dbConnect;