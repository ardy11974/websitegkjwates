const express = require("express");
const router = express.Router();

const {
  getPersyaratan,
  createPersyaratan,
  updatePersyaratan,
  deletePersyaratan,
} = require("../controllers/persyaratan.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { uploadPdf } = require("../middleware/upload.middleware");

router.use(authenticate);

router.get("/", getPersyaratan);
router.post("/", uploadPdf.single("file"), createPersyaratan);
router.put("/:id", uploadPdf.single("file"), updatePersyaratan);
router.delete("/:id", deletePersyaratan);

module.exports = router;
