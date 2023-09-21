import ForgetPassword from "@/utils/models/ResetPassword";
import { v4 as uuidv4 } from "uuid";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { token, code } = req.body;
    if (token) {
      const findToken = await ForgetPassword.findOne({
        token: token,
        code: code,
      });

      if (!findToken) {
        res.status(401).json({
          success: false,
          message: "Invalid code",
        });
      } else {
        if (findToken.validateTime < new Date()) {
          res.status(401).json({
            success: false,
            message: "Token expired",
          });
        } else {
          const result = await ForgetPassword.findOneAndUpdate(
            { token: token, code: code },
            {
              $set: { setPasswordToken: uuidv4() },
            }
          );
          const find = await ForgetPassword.findOne({
            token: token,
            code: code,
          });

          if (find) {
            res.status(200).json({
              success: true,
              message: "Token and code is valid",
              passwordToken: find.setPasswordToken,
            });
          } else {
            res.status(401).json({
              success: false,
              message: "Invalid token or code",
            });
          }
        }
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid token or code",
      });
    }
  }
}
