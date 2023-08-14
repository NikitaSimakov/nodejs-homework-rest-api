import express from "express";
import { ctrlWrapper } from "../../decorators/ctrlWrapper.js";
import {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
  updateAvatar,
  sendVerifyEmail,
  resendVerifyEmail,
} from "../../controllers/auth/index.js";
import { validateBody } from "../../middlewares/validateBody.js";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  subscriptionSchema,
} from "../../models/users.js";
import { handleMongooseError } from "../../helpers/handleMongooseError.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { upload } from "../../middlewares/upload.js";

export const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  handleMongooseError,
  ctrlWrapper(register)
);
authRouter.get("/verify/:verificationToken", ctrlWrapper(sendVerifyEmail));
authRouter.post(
  "/verify",
  validateBody(emailSchema),
  ctrlWrapper(resendVerifyEmail)
);
authRouter.post(
  "/login",
  validateBody(loginSchema),
  handleMongooseError,
  ctrlWrapper(login)
);

authRouter.post(
  "/logout",
  authenticate,
  handleMongooseError,
  ctrlWrapper(logout)
);

authRouter.get(
  "/current",
  handleMongooseError,
  authenticate,
  ctrlWrapper(getCurrent)
);

authRouter.patch(
  "/",
  validateBody(subscriptionSchema),
  authenticate,
  handleMongooseError,
  ctrlWrapper(updateSubscription)
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrlWrapper(updateAvatar)
);
