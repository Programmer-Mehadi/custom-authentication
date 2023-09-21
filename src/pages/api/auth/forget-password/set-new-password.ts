import ForgetPassword from "@/utils/models/ResetPassword";
import User from "@/utils/models/User";
import connectMongo from "@/utils/mongodb/db.config";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  connectMongo();
  if (req.method === "POST") {
    const { token, setPasswordToken, password } = req.body;

    if (token && setPasswordToken) {
      const findToken = await ForgetPassword.findOne({
        token: token,
        setPasswordToken: setPasswordToken,
      });

      if (!findToken) {
        res.status(401).json({
          success: false,
          error: "Invalid token",
        });
        return;
      } else {
        if (findToken.validateTime < new Date()) {
          res.status(401).json({
            success: false,
            error: "Token expired",
          });
          return;
        } else {
          const updateStatus = await User.findOneAndUpdate(
            { email: findToken.email },
            { $set: { password: password } }
          );
          res.status(200).json({
            success: true,
            message: "Password updated successfully",
          });
          return;
        }
      }
    } else {
      res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }
  }
}
