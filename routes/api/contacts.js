import express from "express";
import {
  deleteContact,
  getContact,
  getListContacts,
  postNewContact,
  updateContact,
  updateStatusContact,
} from "../../controllers/contacts/index.js";
import { ctrlWrapper } from "../../decorators/ctrlWrapper.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { favoriteSchema, schemaAdd } from "../../models/contact.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { isIdValid } from "../../middlewares/IsValidId.js";
// import { isValidId } from "../../middlewares/IsValidId.js";

export const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, ctrlWrapper(getListContacts));

contactsRouter.get(
  "/:contactId",
  authenticate,
  isIdValid,
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
  isIdValid,
  ctrlWrapper(deleteContact)
);

contactsRouter.put(
  "/:contactId",
  authenticate,
  isIdValid,
  validateBody(schemaAdd),
  ctrlWrapper(updateContact)
);

contactsRouter.patch(
  "/:contactId/favorite",
  authenticate,
  isIdValid,
  validateBody(favoriteSchema),
  ctrlWrapper(updateStatusContact)
);
