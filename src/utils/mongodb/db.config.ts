import mongoose from "mongoose";

const userName = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const mongodbStr = `mongodb+srv://${userName}:${password}@cluster0.8nrjrgb.mongodb.net/custom-authentication?retryWrites=true&w=majority`;

const connectMongo = async () => {
  mongoose.connect(mongodbStr);
};

export default connectMongo;
