import { HttpError } from "../helpers/HttpError.js";
import { favoriteSchema, schemaAdd } from "../models/contact.js";
import { Contact } from "../models/contact.js";

export const getListContacts = async (req, res, next) => {
  const data = await Contact.find();
  res.json(data);
};

export const getContact = async (req, res, next) => {
  const id = req.params.contactId;
  const data = await Contact.findById(id);
  if (!data) {
    throw HttpError(404, `Contact with Id: ${id} not found`);
  }
  res.json(data);
};

export const postNewContact = async (req, res, next) => {
  // const { error } = schemaAdd.validate(req.body);
  // if (error) throw HttpError(400, error.message);
  const data = await Contact.create(req.body);
  console.log(data);
  res.status(201).json(data);
};

export const deleteContact = async (req, res, next) => {
  const id = req.params.contactId;
  const deleting = await Contact.deleteOne({ _id: id });
  if (!deleting) return HttpError(404, "Not found");
  return res.json({ message: "contact deleted" });
};

export const updateContact = async (req, res, next) => {
  const id = req.params.contactId;

  // const { error } = schemaAdd.validate(req.body);
  // if (error) throw HttpError(400, "missing fields");

  const newContact = await Contact.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!newContact) throw HttpError(404, "Not found");
  return res.json(newContact);
};

export const updateStatusContact = async (req, res, next) => {
  const id = req.params.contactId;
  console.log(req.body);

  // const { error } = favoriteSchema.validate(req.body);
  // if (error) throw HttpError(400, "missing field favorite");
  const updateStatus = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.json(updateStatus);
};
