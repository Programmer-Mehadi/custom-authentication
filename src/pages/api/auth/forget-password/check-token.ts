import ForgetPassword from "@/utils/models/ResetPassword";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { token } = req.body;
    if (token) {
      const findToken = await ForgetPassword.findOne({ token: token });

      if (!findToken) {
        res.status(401).json({
          success: false,
          error: "Invalid token",
        });
      } else {
        if (findToken.validateTime < new Date()) {
          res.status(401).json({
            success: false,
            error: "Token expired",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Token is valid",
          });
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
