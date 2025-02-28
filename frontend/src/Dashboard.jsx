import { useState, useEffect } from "react";
import ServiciosAsignados from "./ServiciosAsignados";

function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => {
        if (!res.ok) throw new Error(`Error al cargar usuarios: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setUsuarios(data.usuarios || []);
        setMensaje(data.usuarios?.length ? "" : "❌ No hay usuarios disponibles.");
      })
      .catch((error) => {
        console.error("❌ Error cargando usuarios:", error.message);
        setMensaje("❌ No se pudieron cargar los usuarios.");
      });
  }, []);

  const handleSeleccionUsuario = (e) => {
    const userId = e.target.value;
    const usuario = usuarios.find((u) => u.id.toString() === userId);

    console.log("📌 Usuario seleccionado en Dashboard:", usuario); // 👀 Verificar en consola

    setUsuarioSeleccionado(usuario || null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-4">
        Consultar Servicios Asignados
      </h1>

      {mensaje && (
        <p className="text-center text-red-500 font-semibold mb-4">{mensaje}</p>
      )}

      <select
        onChange={handleSeleccionUsuario}
        className="border p-2 w-full rounded-md mb-6"
        defaultValue=""
      >
        <option value="">Selecciona un usuario</option>
        {usuarios.map((user) => (
          <option key={user.id} value={user.id}>
            {user.nombres} {user.apellidos} - {user.email}
          </option>
        ))}
      </select>

      {usuarioSeleccionado ? (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-green-600 text-center mb-4">
            Servicios de {usuarioSeleccionado.nombres} {usuarioSeleccionado.apellidos}
          </h2>
          <ServiciosAsignados usuarioId={usuarioSeleccionado.id} />
        </div>
      ) : (
        <p className="text-center text-gray-500">⚠️ Selecciona un usuario para ver los servicios asignados.</p>
      )}
    </div>
  );
}

export default Dashboard;
