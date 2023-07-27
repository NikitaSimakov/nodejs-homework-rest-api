import { HttpError } from "../helpers/HttpError.js";
import { favoriteSchema, schemaAdd } from "../models/contact.js";
import { Contact } from "../models/contact.js";

export const getListContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { favorite, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  console.log(skip, page, limit);
  if (favorite) {
    const data = await Contact.find({ owner, favorite: true }).populate(
      "name email phone favorite"
    );
    return res.json(data);
  }
  const data = await Contact.find({ owner }, "", { skip, limit }).populate(
    "name email phone favorite"
  );
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
  console.log(req.user);
  const { _id: owner } = req.user;
  const data = await Contact.create({ ...req.body, owner });
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
  const newContact = await Contact.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!newContact) throw HttpError(404, "Not found");
  return res.json(newContact);
};

export const updateStatusContact = async (req, res, next) => {
  const id = req.params.contactId;
  console.log(req.body);
  const updateStatus = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.json(updateStatus);
};
