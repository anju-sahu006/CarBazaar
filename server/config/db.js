const mongoose = require('mongoose');

let isMongoConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('MONGODB_URI not configured. Running with persistent local JSON datastore (server/data/db.json).');
    isMongoConnected = false;
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log('Connected to MongoDB successfully.');
    return true;
  } catch (err) {
    console.warn(`MongoDB unavailable (${err.message}). Falling back to persistent local JSON datastore (server/data/db.json).`);
    isMongoConnected = false;
    return false;
  }
}

function getMongoStatus() {
  return isMongoConnected && mongoose.connection.readyState === 1;
}

module.exports = { connectDB, getMongoStatus };
