import { HttpError } from "../../helpers/HttpError.js";
import { User } from "../../models/users.js";

export const logout = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, { token: null });
  if (!user) throw HttpError(401);
  res.status(204).end();
};
