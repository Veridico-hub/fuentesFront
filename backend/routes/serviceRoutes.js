const express = require("express");
const pool = require("../db"); 
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

/** 📌 1️⃣ Obtener todos los servicios */
router.get("/servicios", async (req, res) => {
    try {
        const servicios = await pool.query("SELECT id, codigo, servicio, descripcion FROM sgu.servicios");
        res.json({ servicios: servicios.rows });
    } catch (error) {
        console.error("❌ Error obteniendo servicios:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

/** 📌 2️⃣ Asignar múltiples servicios a un usuario */
router.post("/asignar-servicios", async (req, res) => {
    console.log("📌 Middleware Express JSON está activo");

    // 📌 Verificar si `req.body` llega vacío
    console.log("📌 Cuerpo de la solicitud recibida (crudo):", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
        console.log("🚨 req.body está vacío.");
        return res.status(400).json({ error: "El servidor no recibió datos en el cuerpo de la solicitud." });
    }

    try {
        const { usuario_id, servicios } = req.body;

        console.log("📌 usuario_id recibido:", usuario_id);
        console.log("📌 servicios recibidos:", servicios);

        if (!usuario_id || !Array.isArray(servicios) || servicios.length === 0) {
            console.log("🚨 Datos faltantes o en formato incorrecto.");
            return res.status(400).json({ error: "Faltan parámetros requeridos." });
        }

        console.log("📌 Insertando en la base de datos...");
        const valores = servicios.map(servicio_id => `(${usuario_id}, ${servicio_id}, NOW())`).join(", ");
        await pool.query(`INSERT INTO sgu.usuarios_servicios (usuario_id, servicio_id, fecha_asignacion) VALUES ${valores}`);

        console.log("✅ Servicios asignados correctamente");
        res.json({ message: "✅ Servicios asignados correctamente.", usuario_id, servicios });

    } catch (error) {
        console.error("❌ Error asignando servicios:", error.stack);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

/** 📌 2️⃣ Asignar un servicio a un usuario */
router.post("/asignar-servicio", verificarToken, async (req, res) => {
    try {
        const { usuario_id, servicio_id } = req.body;
        const admin_id = req.usuario.id;

        if (req.usuario.rol !== "admin") {
            return res.status(403).json({ error: "No tienes permisos para asignar servicios." });
        }

        const asignacion = await pool.query(
            "INSERT INTO sgu.usuarios_servicios (usuario_id, servicio_id, asignado_por) VALUES ($1, $2, $3) RETURNING *",
            [usuario_id, servicio_id, admin_id]
        );

        res.json({ message: "✅ Servicio asignado con éxito.", asignacion: asignacion.rows[0] });
    } catch (error) {
        console.error("❌ Error asignando servicio:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


/** 📌 3️⃣ Obtener los servicios asignados a un usuario */
router.get("/mis-servicios/:usuario_id", verificarToken, async (req, res) => {
    try {
        const { usuario_id } = req.params;

        const servicios = await pool.query(
            `SELECT s.id, s.codigo, s.servicio, s.descripcion, us.fecha_asignacion 
             FROM sgu.usuarios_servicios us
             INNER JOIN sgu.servicios s ON us.servicio_id = s.id
             WHERE us.usuario_id = $1`, 
            [usuario_id]
        );

        if (servicios.rows.length === 0) {
            return res.status(404).json({ message: "⚠️ Este usuario no tiene servicios asignados." });
        }

        res.json({ servicios: servicios.rows });
    } catch (error) {
        console.error("❌ Error obteniendo servicios asignados:", error.stack);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

module.exports = router;
