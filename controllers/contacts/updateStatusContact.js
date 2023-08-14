import { Contact } from "../../models/contact.js";

export const updateStatusContact = async (req, res) => {
  const id = req.params.contactId;
  const updateStatus = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.json(updateStatus);
};
