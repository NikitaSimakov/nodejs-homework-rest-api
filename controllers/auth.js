import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import fs from "fs/promises";
import gravatar from "gravatar";
import path from "path";
import Jimp from "jimp";
import { HttpError } from "../helpers/HttpError.js";
import { User } from "../models/users.js";
import { nanoid } from "nanoid";
import { sendVerificationEmail } from "../helpers/sendVerificationEmail.js";

dotenv.config();
const { SECRET_KEY, BASE_URL } = process.env;

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

export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  // const code = await User.findOne({ verificationToken });
  const user = await User.findOneAndUpdate(
    { verificationToken },
    { verify: true, verificationToken: "" }
  );
  if (!user) throw HttpError(401, "User not found");
  res.json({
    message: "Verification successful",
  });
};

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

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, "invalid email or password");
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) throw HttpError(401, "invalid email or password");
  const payload = {
    id: user._id,
  };
  if (!user.verify) throw HttpError(401, "Email not verify");
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
  await User.findOneAndUpdate({ _id: user._id }, { token });
  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

export const logout = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, { token: null });
  if (!user) throw HttpError(401);
  res.status(204).end();
};

export const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

export const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const user = await User.findByIdAndUpdate(_id, { subscription });
  res.json({ message: `Status was updated to ${subscription}` });
};

export const updateAvatar = async (req, res) => {
  const avatarsDir = path.resolve("public", "avatars");
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsDir, filename);
  const avatarURL = path.join("avatars", filename);
  (await Jimp.read(oldPath)).resize(250, 250).write(newPath);
  fs.unlink(oldPath);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};
