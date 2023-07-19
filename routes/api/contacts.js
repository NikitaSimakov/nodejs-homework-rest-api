import express from "express";
import {
  deleteContact,
  getContact,
  getListContacts,
  postNewContact,
  putContact,
  updateStatusContact,
} from "../../controllers/controllers.js";

export const contactsRouter = express.Router();

contactsRouter.get("/", getListContacts);

contactsRouter.get("/:contactId", getContact);

contactsRouter.post("/", postNewContact);

contactsRouter.delete("/:contactId", deleteContact);

contactsRouter.put("/:contactId", putContact);

contactsRouter.patch("/:contactId/favorite", updateStatusContact);

// simakov hJ56BT8zt7chUBeV
