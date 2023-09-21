import User from "@/utils/models/User";
import connectMongo from "@/utils/mongodb/db.config";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      connectMongo();
      const result = await User.create(req.body);
      res.status(200).json({
        success: true,
        data: result,
        message: "User created successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err,
        message: "Something went wrong",
      });
    }
  }
}
