import { useEffect, useState } from "react";

function AdminServicios() {
  const [usuarios, setUsuarios] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsuarios(data.usuarios))
      .catch(() => setMensaje("❌ Error cargando usuarios."));

    fetch("http://localhost:5000/api/servicios")
      .then((res) => res.json())
      .then((data) => setServicios(data.servicios))
      .catch(() => setMensaje("❌ Error cargando servicios."));
  }, []);

  const handleAsignarServicio = async (servicioId) => {
    if (!usuarioSeleccionado) {
      setMensaje("❌ Selecciona un usuario antes de asignar un servicio.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/asignar-servicio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuario_id: usuarioSeleccionado,
          servicio_id: servicioId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje("✅ Servicio asignado con éxito.");
      } else {
        setMensaje("❌ " + data.error);
      }
    } catch (error) {
      setMensaje("❌ Error de red, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-4">Asignar Servicios</h1>

      {mensaje && <p className={`mt-2 text-center ${mensaje.startsWith("✅") ? "text-green-500" : "text-red-500"}`}>{mensaje}</p>}

      <div className="flex flex-col gap-4 mt-4 max-w-xl mx-auto">
        <select onChange={(e) => setUsuarioSeleccionado(e.target.value)} className="border p-2 rounded w-full">
          <option value="">Selecciona un usuario</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombres} {usuario.apellidos}
            </option>
          ))}
        </select>

        <h3 className="text-lg font-semibold mt-4 text-center">Servicios Disponibles:</h3>
        <div className="bg-white p-4 rounded-lg shadow-inner">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="flex items-center justify-between border-b py-2 px-4">
              <span className="text-gray-900 font-medium w-3/4 text-left">{servicio.codigo} - {servicio.servicio}</span>
              <button
                onClick={() => handleAsignarServicio(servicio.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 w-1/4 text-center"
                disabled={loading}>
                {loading ? "..." : "✅"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminServicios;
