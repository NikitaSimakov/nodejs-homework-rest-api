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

userSchema.post("save", handleMongooseError);

export const User = model("user", userSchema);
