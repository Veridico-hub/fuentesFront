const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Conexión a PostgreSQL

const authRoutes = require("./routes/authRoutes"); // Rutas de autenticación
const userRoutes = require("./routes/userRoutes"); // ✅ Rutas de usuarios
const serviceRoutes = require("./routes/serviceRoutes"); // ✅ Rutas de servicios

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Permitir JSON en las peticiones

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes); // ✅ Asegurar que las rutas están registradas
app.use("/api", serviceRoutes); // ✅ Registrar rutas de servicios

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
