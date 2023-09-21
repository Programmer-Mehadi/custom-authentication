import User from "@/utils/models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { authorization } = req.headers;
    const token = authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }
    const result = await User.findOneAndUpdate(
      { token: token },
      {
        $set: { token: "", tokenExpire: "" },
      }
    );
    if (result) {
      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
      return;
    }
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
}
