// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/utils/models/User";
import connectMongo from "@/utils/mongodb/db.config";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    connectMongo();

    const result = await User.find();
    res.status(200).json({ success: true, data: result });
  }
  if (req.method === "DELETE") {
    const { id } = req.query;
    const result = await User.deleteOne({ _id: id });
    res.status(200).json({
      success: true,
      data: result,
    });
  }
}
