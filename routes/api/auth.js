import express from "express";
import { ctrlWrapper } from "../../decorators/ctrlWrapper.js";
import { login, register, logout } from "../../controllers/auth.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { loginSchema, registerSchema } from "../../models/users.js";
import { handleMongooseError } from "../../helpers/handleMongooseError.js";
import { authenticate } from "../../middlewares/authenticate.js";

export const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  handleMongooseError,
  ctrlWrapper(register)
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
