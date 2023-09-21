import User from "@/utils/models/User";
import connectMongo from "@/utils/mongodb/db.config";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  connectMongo();
  if (req.method === "POST") {
    const { token } = req.body;
    const findUser = await User.findOne({ token: token });
    if (!findUser?.tokenExpire) {
      res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    } else {
      if (findUser?.tokenExpire < new Date()) {
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
  }
}
