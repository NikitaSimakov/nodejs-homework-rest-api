import express from "express";
import {
  deleteContact,
  getContact,
  getListContacts,
  postNewContact,
  updateContact,
  updateStatusContact,
} from "../../controllers/contact-controllers.js";
import { isValidId } from "../../middlewares/IsValidId.js";
import { ctrlWrapper } from "../../decorators/ctrlWrapper.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { favoriteSchema, schemaAdd } from "../../models/contact.js";
import { authenticate } from "../../middlewares/authenticate.js";

export const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, ctrlWrapper(getListContacts));

contactsRouter.get(
  "/:contactId",
  authenticate,
  isValidId,
  ctrlWrapper(getContact)
);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(schemaAdd),
  ctrlWrapper(postNewContact)
);

contactsRouter.delete(
  "/:contactId",
  authenticate,
  isValidId,
  ctrlWrapper(deleteContact)
);

contactsRouter.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemaAdd),
  ctrlWrapper(updateContact)
);

contactsRouter.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(favoriteSchema),
  ctrlWrapper(updateStatusContact)
);
