import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);

        setMensaje("✅ Inicio de sesión exitoso.");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setMensaje("❌ " + data.error);
      }
    } catch (error) {
      setMensaje("❌ Error en el inicio de sesión.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Login</h1>

      {mensaje && <p className="text-red-500">{mensaje}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" className="border p-2 w-full" 
          onChange={(e) => setForm({ ...form, email: e.target.value })} required />

        <input type="password" placeholder="Contraseña" className="border p-2 w-full" 
          onChange={(e) => setForm({ ...form, password: e.target.value })} required />

        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-700">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default Login;
