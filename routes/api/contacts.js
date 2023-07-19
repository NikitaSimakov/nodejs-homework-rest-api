import express from "express";
import {
  deleteContact,
  getContact,
  getListContacts,
  postNewContact,
  updateContact,
  updateStatusContact,
} from "../../controllers/controllers.js";
import { isValidId } from "../../middlewares/IsValidId.js";
import { ctrlWrapper } from "../../decorators/ctrlWrapper.js";

export const contactsRouter = express.Router();

contactsRouter.get("/", ctrlWrapper(getListContacts));

contactsRouter.get("/:contactId", isValidId, ctrlWrapper(getContact));

contactsRouter.post("/", ctrlWrapper(postNewContact));

contactsRouter.delete("/:contactId", isValidId, ctrlWrapper(deleteContact));

contactsRouter.put("/:contactId", isValidId, ctrlWrapper(updateContact));

contactsRouter.patch(
  "/:contactId/favorite",
  isValidId,
  ctrlWrapper(updateStatusContact)
);
