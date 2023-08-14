import { HttpError } from "../../helpers/HttpError.js";
import { Contact } from "../../models/contact.js";

export const deleteContact = async (req, res) => {
  const id = req.params.contactId;
  const deleting = await Contact.deleteOne({ _id: id });
  if (!deleting) return HttpError(404, "Not found");
  return res.json({ message: "contact deleted" });
};
