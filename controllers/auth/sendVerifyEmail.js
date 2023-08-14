import { HttpError } from "../../helpers/HttpError.js";
import { User } from "../../models/users.js";

export const sendVerifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOneAndUpdate(
    { verificationToken },
    { verify: true, verificationToken: "" }
  );
  if (!user) throw HttpError(401, "User not found");
  res.json({
    message: "Verification successful",
  });
};
