import { HttpError } from "../helpers/HttpError.js";
import { schemaAdd } from "../helpers/schema.js";
import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
} from "../models/contacts.js";
import { Contact } from "../models/contact.js";
import { Query } from "mongoose";

export const getListContacts = async (req, res, next) => {
  try {
    const data = await Contact.find();
    console.log(data);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    // const data = await getContactById(id);
    const data = await Contact.findById(id);
    if (!data) {
      throw HttpError(404, `Contact with Id: ${id} not found`);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const postNewContact = async (req, res, next) => {
  try {
    const { error } = schemaAdd.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    // const data = await addContact(req.body);
    const data = await Contact.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const id = req.params.contactId;
  try {
    // const deleting = await removeContact(id);
    const deleting = await Contact.deleteOne({ _id: id });
    if (!deleting) return HttpError(404, "Not found");
    return res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

export const putContact = async (req, res, next) => {
  const id = req.params.contactId;
  try {
    const { error } = schemaAdd.validate(req.body);
    if (error) throw HttpError(400, "missing fields");
    // const newContact = await updateContact(id, req.body);

    const newContact = await Contact.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!newContact) throw HttpError(404, "Not found");
    console.log(newContact);
    return res.json(newContact);
  } catch (error) {
    next(error);
  }
};
