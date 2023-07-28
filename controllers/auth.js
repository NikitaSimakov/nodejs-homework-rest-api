import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { HttpError } from "../helpers/HttpError.js";
import { User } from "../models/users.js";
import dotenv from "dotenv";

dotenv.config();
const { SECRET_KEY } = process.env;

export const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) throw HttpError(409, "email already in use");
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({
    email: newUser.email,
    id: newUser._id,
    subscription: newUser.subscription,
  });
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
