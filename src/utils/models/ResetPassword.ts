import { Schema, model, models } from "mongoose";

export interface IResetPassword {
  email: string;
  token: string;
  code: string;
  validateTime: Date;
  setPasswordToken: string;
}

const forgetPasswordSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  validateTime: {
    type: Date,
    required: true,
  },
  setPasswordToken: {
    type: String,
    required: false,
  },
});

const ForgetPassword =
  models.ForgetPassword || model("ForgetPassword", forgetPasswordSchema);

export default ForgetPassword;
