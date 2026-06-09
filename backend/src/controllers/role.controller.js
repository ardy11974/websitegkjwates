const prisma = require("../config/prisma");

const getRoles = async (req, res) => {
  try {
    const roles = await prisma.roles.findMany({
      orderBy: { id_role: "asc" },
    });
    res.json(roles);
  } catch (error) {
    console.error("getRoles error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getRoles };
