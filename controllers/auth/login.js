import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { HttpError } from "../../helpers/HttpError.js";
import { User } from "../../models/users.js";

dotenv.config();
const { SECRET_KEY } = process.env;

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
