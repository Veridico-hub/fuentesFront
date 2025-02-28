import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthGuard({ children, roleRequired }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("rol");

    console.log("🔍 Token:", token);
    console.log("🔍 Rol del usuario:", userRole);
    console.log("🔍 Rol requerido:", roleRequired);

    if (!token) {
      console.log("🚨 No hay token, redirigiendo a login...");
      navigate("/login");
    } else if (roleRequired && userRole !== roleRequired) {
      console.log("🚨 Usuario sin permisos, redirigiendo a dashboard...");
      navigate("/dashboard");
    }
  }, [navigate, roleRequired]);

  return children; // ✅ Si el usuario tiene acceso, mostrar la página
}

export default AuthGuard;
