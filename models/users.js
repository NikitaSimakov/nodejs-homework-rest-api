import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

const emailRegexp =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const subscriptionStatusList = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptionStatusList,
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: { type: String, required: [true, "Set avatar for user"] },
    verify: { type: Boolean, default: false },
    verificationToken: { type: String, default: "" },
  },
  { versionKey: false }
);

export const registerSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().required().pattern(emailRegexp),
  subscription: Joi.string()
    .default("starter")
    .validate(...subscriptionStatusList),
  token: Joi.string().default(null),
});

export const loginSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegexp),
  password: Joi.string().min(6).required(),
});

export const subscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionStatusList)
    .required(),
});

export const emailSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegexp),
});

userSchema.post("save", handleMongooseError);

export const User = model("user", userSchema);
