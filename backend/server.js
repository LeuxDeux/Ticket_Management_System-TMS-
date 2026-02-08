const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const { prisma, testConnection } = require("./src/config/database");
const routes = require("./src/routes");

//Inicializo express
const app = express();
//Creamos el server HTTP antes que Socket.io
const server = http.createServer(app);
//Declaramos el puerto
const PORT = process.env.PORT || 5000;

//Configuración de Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

//Middlewares globales
app.use(cors());
app.use(express.json());

//Middleware de Socket.io
app.use((req, res, next) => {
  req.io = io;
  req.prisma = prisma;
  next();
});

//Rutas
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/db-health", async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.status(isConnected ? 200 : 503).json({
      status: isConnected ? "Connected" : "Disconnected",
      database: "MySQL - Prisma",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: "Error",
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Importar rutas de la aplicación
app.use("/api", routes);

//Manejo de errores
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    timestamp: new Date().toISOString(),
  });
});

//Iniciar servidor
const startServer = async () => {
  try {
    // Test de conexión a BD
    const isDbConnected = await testConnection();

    if (!isDbConnected) {
      console.error("Advertencia: No se pudo conectar a la base de datos");
    }

    server.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`DB Health: http://localhost:${PORT}/api/db-health`);
    });
  } catch (err) {
    console.error("Error al iniciar el servidor:", err);
    process.exit(1);
  }
};

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nApagando servidor...");
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

module.exports = { app, server };
