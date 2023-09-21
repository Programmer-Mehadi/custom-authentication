import User from "@/utils/models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (email && password) {
      const findUser = await User.findOne({
        email: email,
        password: password,
      });
      if (findUser) {
        const token = uuidv4() + "-" + uuidv4();
        const currentDate = new Date();
        const twoDaysLater = new Date(currentDate);
        twoDaysLater.setDate(currentDate.getDate() + 14);
        const result = await User.findOneAndUpdate(
          { email: email },
          { $set: { token: token, tokenExpire: twoDaysLater } }
        );

        res
          .status(200)
          .json({ success: true, message: "Login successful", token: token });
        return;
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  }
}
