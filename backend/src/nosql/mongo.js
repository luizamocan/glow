const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/glow_nosql";

const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 3000,
  });

  return mongoose.connection;
};

const isMongoConnected = () => mongoose.connection.readyState === 1;

module.exports = { connectMongo, isMongoConnected, mongoUri };
