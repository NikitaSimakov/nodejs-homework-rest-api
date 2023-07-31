import multer from "multer";
import path from "path";

const tempDir = path.resolve("temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  //   Колбэк используется для переименовывания загружаемого файла, в момент сохранения файла в памяти, до сохранения в папке..
  //   filename: (req, file, cb) => {
  //     cb(null, file.originalname);
  //   },
});

export const upload = multer({ storage: multerConfig });
