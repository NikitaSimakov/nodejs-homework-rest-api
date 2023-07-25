// import { HttpError } from "../helpers/HttpError";
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
  console.log(req.body);
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
  //   const comparePassword = await bcrypt.compare(password, user.password);
  const comparePassword = bcrypt.compare(password, user.password);
  if (!comparePassword) throw HttpError(401, "invalid email or password");
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
  console.log(token);
  res.json({ token });
};
