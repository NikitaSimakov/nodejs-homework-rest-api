import { isValidObjectId } from "mongoose";
import { HttpError } from "../helpers/HttpError.js";

export const isIdValid = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId))
    next(HttpError(400, `${contactId} is not valid id`));
  next();
};
