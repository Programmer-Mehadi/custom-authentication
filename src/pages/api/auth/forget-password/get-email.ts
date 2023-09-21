import ForgetPassword from "@/utils/models/ResetPassword";
import User from "@/utils/models/User";
import connectMongo from "@/utils/mongodb/db.config";
import { NextApiResponse, NextApiRequest } from "next";
import { v4 as uuidv4 } from "uuid";
const nodemailer = require("nodemailer");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      connectMongo();

      const { email } = req.body;

      const findUser = await User.findOne({
        email: email,
      });

      if (findUser) {
        const currentDate = new Date();
        const twoDaysLater = new Date(currentDate);
        twoDaysLater.setDate(currentDate.getDate() + 2);
        const data = {
          email: email,
          token: uuidv4(),
          code: Math.random().toString().substring(2, 8),
          validateTime: twoDaysLater,
          setPasswordToken: "",
        };

        const result = await ForgetPassword.create(data);

        if (result) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.GMAIL_PASSWORD,
            },
          });

          const info = await transporter.sendMail({
            from: '"Muhammad Developer" <mehadi.traveler@example.com>',
            to: email,
            subject: "Reset Password",
            text: "",
            html: `<b>Hello,</b>
              <br/><b>We received a request to reset your password for your account</b>
              <br/>Click the link below to reset your password:
              <br/>
              <a href="http://localhost:3000/forget-password/set-code?token=${data.token}">Reset Password</a>
              <br/>
              <b>Your code:</b> 
              <b>${data.code}</b>
            `,
          });
          res.status(200).json({
            success: true,
            message: "Email sent successfully",
          });
        } else {
          res.status(200).json({
            success: false,
            message: "Error sending email",
          });
        }
      } else {
        res.status(200).json({ success: false, message: "User not found" });
      }
    } catch (err) {
      res.send(err);
    }
  }
}
