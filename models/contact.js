import { Schema, model } from "mongoose";
import Joi from "joi";

const contactSchema = new Schema({
  name: { type: String, required: [true, "Set name for contact"] },
  email: { type: String },
  phone: { type: String },
  favorite: { type: Boolean, default: false },
});

export const schemaAdd = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

export const schemaUpdate = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
}).min(1);

export const favoriteSchema = Joi.object({
  favorite: Joi.bool(),
});

export const Contact = model("Contact", contactSchema);
