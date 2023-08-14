import dotenv from "dotenv";
import { HttpError } from "../../helpers/HttpError.js";
import { User } from "../../models/users.js";

dotenv.config();
const { BASE_URL } = process.env;

export const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) throw HttpError(400, "missing required field email");
  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, "User not found");
  if (user.verify) throw HttpError(401, "Verification has already been passed");
  const verifyEmail = {
    to: email,
    subject: "Registration succesfull. Please, verify your email",
    html: `<p>Hi! Your registration was successful.</p> <p>Please follow the link below to verify your email and complete your registration: </p>
            <a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blank">Verification link</a>`,
  };
  await sendVerificationEmail(verifyEmail);
  res.json({ message: "Verification email sent" });
};
