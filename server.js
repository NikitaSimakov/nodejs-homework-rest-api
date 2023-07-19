import { app } from "./app.js";
import mongoose from "mongoose";

// const DB_HOST =
//   "mongodb+srv://simakov:hJ56BT8zt7chUBeV@cluster0.zmwfuhu.mongodb.net/Contacts_reader?retryWrites=true&w=majority";

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(app.listen(PORT, () => console.log("Database connection successful")))
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000");
// });
