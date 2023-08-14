import gravatar from "gravatar";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { User } from "../../models/users.js";
import { HttpError } from "../../helpers/HttpError.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) throw HttpError(409, "email already in use");
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Registration succesfull. Please, verify your email",
    html: `<p>Hi! Your registration was successful.</p> <p>Please follow the link below to verify your email and complete your registration: </p>
            <a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">Verification link</a>`,
  };

  await sendVerificationEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    id: newUser._id,
    subscription: newUser.subscription,
  });
};
