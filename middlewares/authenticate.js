import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { HttpError } from "../helpers/HttpError.js";
import { User } from "../models/users.js";

dotenv.config();
const { SECRET_KEY } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") next(HttpError(401));
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user) next(HttpError(401));
    next();
  } catch {
    next(HttpError(401));
  }
};
