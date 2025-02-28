import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Si no hay token, redirigir a login
    } else {
      fetch("http://localhost:5000/api/auth/perfil", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setUsuario(data))
      .catch(() => navigate("/login")); // Si hay error, redirigir a login
    }
  }, [navigate]);

  return usuario ? (
    <div>
      <h1>Perfil de Usuario</h1>
      <p><strong>Nombre:</strong> {usuario.nombres} {usuario.apellidos}</p>
      <p><strong>Email:</strong> {usuario.email}</p>
      <button onClick={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }}>Cerrar Sesión</button>
    </div>
  ) : (
    <p>Cargando...</p>
  );
}

export default Perfil;
