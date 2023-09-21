import { Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  token: string;
  tokenExpire: Date;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  tokenExpire: {
    type: Date,
  },
});

const User = models.User || model("User", userSchema);

export default User;
