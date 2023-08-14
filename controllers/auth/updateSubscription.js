import { User } from "../../models/users.js";

export const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const user = await User.findByIdAndUpdate(_id, { subscription });
  res.json({ message: `Status was updated to ${subscription}` });
};
