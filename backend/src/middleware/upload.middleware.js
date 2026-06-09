const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Folder penyimpanan file upload: backend/uploads
const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const makeStorage = (prefix) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const unique = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, unique);
    },
  });

const imageFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File harus berupa gambar (jpg, png, webp, atau gif)"));
  }
};

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("File harus berupa PDF"));
  }
};

// Upload gambar (default export) - dipakai untuk foto kemajelisan
const upload = multer({
  storage: makeStorage("foto"),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Upload PDF - dipakai untuk file persyaratan
const uploadPdf = multer({
  storage: makeStorage("doc"),
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

module.exports = upload;
module.exports.uploadDir = uploadDir;
module.exports.uploadPdf = uploadPdf;
