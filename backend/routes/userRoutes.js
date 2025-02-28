const express = require("express");
const router = express.Router();
const pool = require("../db"); // Ajusta la ruta según tu estructura
const authMiddleware = require("../middleware/authMiddleware"); // Middleware de autenticación si es necesario

// ✅ Obtener lista de usuarios
router.get("/users", async (req, res) => {
  try {
    const usuarios = await pool.query("SELECT id, nombres, apellidos, email FROM sgu.tblsguser");
    res.json({ usuarios: usuarios.rows });
  } catch (error) {
    console.error("❌ Error obteniendo usuarios:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ✅ Obtener lista de servicios
router.get("/servicios", async (req, res) => {
  try {
    const servicios = await pool.query("SELECT id, servicio FROM sgu.servicios");
    res.json({ servicios: servicios.rows });
  } catch (error) {
    console.error("❌ Error obteniendo servicios:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ✅ Asignar servicio a usuario
router.post("/asignar-servicios", async (req, res) => {
  const { usuarioId, servicios } = req.body;

  if (!usuarioId || !Array.isArray(servicios) || servicios.length === 0) {
    return res.status(400).json({ error: "Faltan parámetros requeridos." });
  }

  try {
    const values = servicios.map((servicioId) => `(${usuarioId}, ${servicioId}, NOW())`).join(", ");

    await pool.query(
      `INSERT INTO sgu.usuarios_servicios (usuario_id, servicio_id, fecha_asignacion) VALUES ${values}`
    );

    res.status(200).json({ message: "Servicios asignados correctamente." });
  } catch (error) {
    console.error("❌ Error asignando servicios:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});



// ✅ Obtener servicios asignados a un usuario
router.get("/usuarios/:usuarioId/servicios", async (req, res) => {
    const { usuarioId } = req.params;
  
    try {
      const serviciosAsignados = await pool.query(
        `SELECT s.id, s.servicio, s.descripcion, us.fecha_asignacion
         FROM sgu.usuarios_servicios us
         JOIN sgu.servicios s ON us.servicio_id = s.id
         WHERE us.usuario_id = $1`,
        [usuarioId]
      );
  
      if (serviciosAsignados.rows.length === 0) {
        return res.status(404).json({ message: "No se encontraron servicios asignados." });
      }
  
      res.json({ servicios: serviciosAsignados.rows });
    } catch (error) {
      console.error("❌ Error obteniendo servicios asignados:", error.message);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });
  

module.exports = router;
