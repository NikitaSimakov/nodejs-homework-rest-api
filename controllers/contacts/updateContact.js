import { HttpError } from "../../helpers/HttpError.js";
import { Contact } from "../../models/contact.js";

export const updateContact = async (req, res) => {
  const id = req.params.contactId;
  const newContact = await Contact.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!newContact) throw HttpError(404, "Not found");
  return res.json(newContact);
};
