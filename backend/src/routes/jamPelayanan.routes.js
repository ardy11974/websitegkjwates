const express = require("express");
const router = express.Router();

const {
  getIbadah,
  getIbadahById,
  createIbadah,
  updateIbadah,
  deleteIbadah,
  createJadwal,
  updateJadwal,
  deleteJadwal,
} = require("../controllers/jamPelayanan.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.use(authenticate);

// Ibadah (wadah)
router.get("/ibadah", getIbadah);
router.get("/ibadah/:id", getIbadahById);
router.post("/ibadah", createIbadah);
router.put("/ibadah/:id", updateIbadah);
router.delete("/ibadah/:id", deleteIbadah);

// Jadwal di dalam ibadah
router.post("/jadwal", createJadwal);
router.put("/jadwal/:id", updateJadwal);
router.delete("/jadwal/:id", deleteJadwal);

module.exports = router;
