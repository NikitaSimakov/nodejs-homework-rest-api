import fs from "fs/promises";
import Jimp from "jimp";
import path from "path";
import { User } from "../../models/users.js";

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
