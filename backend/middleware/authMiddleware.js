const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ error: "Acceso denegado. No hay token." });
    }

    try {
        const tokenParts = token.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(401).json({ error: "Formato de token inválido." });
        }

        const decoded = jwt.verify(tokenParts[1], "secreto"); // 📌 Asegúrate de usar el mismo secreto del login
        req.usuario = decoded;

        console.log("✅ Usuario autenticado:", req.usuario); // Depuración

        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido." });
    }
};

module.exports = verificarToken;
