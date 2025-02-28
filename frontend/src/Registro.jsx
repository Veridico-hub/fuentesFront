import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Registro() {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    rut: "",
    documento: "",
    email: "",
    password: "",
    rol_id: "", // Guardamos el ID del rol
  });

  const [roles, setRoles] = useState([]); // Lista de roles disponibles
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // ✅ Cargar roles desde el backend al iniciar el componente
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data.roles))
      .catch((err) => console.error("Error cargando roles:", err));
  }, []);

  // ✅ Manejar cambios en los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que se ha seleccionado un rol
    if (!form.rol_id) {
      setMensaje("❌ Debes seleccionar un rol.");
      return;
    }

    console.log("Datos enviados:", form); // ✅ Depuración en consola

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Registro exitoso.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMensaje("❌ " + data.error);
      }
    } catch (error) {
      console.error("❌ Error en el registro:", error);
      setMensaje("❌ Error en el registro.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Registro de Usuario
        </h1>

        {mensaje && (
          <p
            className={`text-center mb-4 ${
              mensaje.includes("❌") ? "text-red-500" : "text-green-500"
            }`}
          >
            {mensaje}
          </p>
        )}

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            className="border p-2 rounded focus:ring focus:ring-blue-200"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            className="border p-2 rounded focus:ring focus:ring-blue-200"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="rut"
            placeholder="RUT"
            className="border p-2 rounded focus:ring focus:ring-blue-200"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="documento"
            placeholder="Documento"
            className="border p-2 rounded focus:ring focus:ring-blue-200"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="border p-2 rounded focus:ring focus:ring-blue-200"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="border p-2 rounded focus:ring focus:ring-blue-200"
            onChange={handleChange}
            required
          />

          {/* ✅ Selección de perfil dinámico */}
          <select
            name="rol_id"
            className="border p-2 rounded focus:ring focus:ring-blue-200"
            onChange={handleChange}
            value={form.rol_id}
            required
          >
            <option value="">Selecciona un rol</option>
            {roles.length > 0 ? (
              roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))
            ) : (
              <option disabled>Cargando roles...</option>
            )}
          </select>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Registrarse
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-500 hover:underline block text-center"
        >
          🔙 Volver al Inicio
        </button>
      </div>
    </div>
  );
}

export default Registro;
