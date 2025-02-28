const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db'); // Importar la conexión a la base de datos

const router = express.Router();

const verifyToken = require('../middleware/authMiddleware'); // Middleware para proteger rutas

router.post('/register', async (req, res) => {
    try {
        const { nombres, apellidos, rut, documento, email, password, rol_id } = req.body;

        // Verificar si el rol existe en la base de datos
        const rol = await pool.query("SELECT id FROM sgu.roles WHERE id = $1", [rol_id]);
        if (rol.rows.length === 0) {
            return res.status(400).json({ error: "El rol seleccionado no es válido" });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await pool.query("SELECT * FROM sgu.tblsguser WHERE email = $1", [email]);
        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({ error: "El usuario ya está registrado" });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar usuario en la base de datos con el rol seleccionado
        const newUser = await pool.query(
            "INSERT INTO sgu.tblsguser (nombres, apellidos, rut, documento, email, password, rol_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [nombres, apellidos, rut, documento, email, hashedPassword, rol_id]
        );

        res.status(201).json({ message: "Usuario registrado con éxito", usuario: newUser.rows[0] });
    } catch (error) {
        console.error("❌ Error en el registro:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await pool.query(`
            SELECT u.id, u.nombres, u.apellidos, u.email, u.password, r.nombre AS rol
            FROM sgu.tblsguser u
            INNER JOIN sgu.roles r ON u.rol_id = r.id
            WHERE u.email = $1
        `, [email]);

        if (usuario.rows.length === 0) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        const storedPassword = usuario.rows[0].password;

        if (!storedPassword) {
            return res.status(500).json({ error: "Error en la base de datos: la contraseña es nula." });
        }

        const validPassword = await bcrypt.compare(password, storedPassword);
        if (!validPassword) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // Generar token con el nombre del rol
        const token = jwt.sign(
            {
                id: usuario.rows[0].id,
                email: usuario.rows[0].email,
                rol: usuario.rows[0].rol // ✅ Guardamos el nombre del rol, no el ID
            },
            "secreto",
            { expiresIn: "1h" }
        );

        console.log("Usuario logueado:", { email, rol: usuario.rows[0].rol }); // ✅ Depuración en consola

        res.json({ message: "Inicio de sesión exitoso", token, rol: usuario.rows[0].rol });
    } catch (error) {
        console.error("❌ Error en login:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});





// ✅ Ruta protegida con JWT para obtener perfil del usuario
router.get('/perfil', verifyToken, async (req, res) => {
    try {
        const usuario = await pool.query("SELECT id, nombres, apellidos, email FROM sgu.tblsguser WHERE id = $1", [req.user.id]);

        if (usuario.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(usuario.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el perfil" });
    }

router.get('/dashboard', verifyToken, async (req, res) => {
res.json({ message: "Bienvenido al dashboard, usuario autenticado!", user: req.user });
    });
    
});

const verifyAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ error: "Acceso denegado. Solo administradores pueden acceder." });
    }
    next();
};
router.get('/admin', verifyToken, verifyAdmin, (req, res) => {
    res.json({ message: "Bienvenido, administrador!" });
});

router.get('/roles', async (req, res) => {
    try {
        const roles = await pool.query("SELECT * FROM sgu.roles");
        res.json({ roles: roles.rows });
    } catch (error) {
        console.error("❌ Error obteniendo roles:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router; // ✅ Exportar correctamente como CommonJS
