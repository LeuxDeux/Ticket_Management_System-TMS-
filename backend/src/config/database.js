const prisma = require("./prisma");

// Test database connection
async function testConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✓ Conectado correctamente a la base de datos con Prisma.");
    return true;
  } catch (err) {
    console.error("✗ Error al conectar a la base de datos:", err.message);
    return false;
  }
}

module.exports = {
  prisma,
  testConnection,
};
