import { HttpError } from "../../helpers/HttpError.js";
import { Contact } from "../../models/contact.js";

export const getContact = async (req, res) => {
  const id = req.params.contactId;
  const data = await Contact.findById(id);
  if (!data) {
    throw HttpError(404, `Contact with Id: ${id} not found`);
  }
  res.json(data);
};
