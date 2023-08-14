import { Contact } from "../../models/contact.js";

export const getListContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { favorite, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
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
