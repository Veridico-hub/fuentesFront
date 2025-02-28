import { useState, useEffect } from "react";

function AsignarServicios() {
  const [usuarios, setUsuarios] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    // Cargar usuarios
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsuarios(data.usuarios || []))
      .catch(() => setMensaje("❌ No se pudieron cargar los usuarios."));

    // Cargar servicios
    fetch("http://localhost:5000/api/servicios")
      .then((res) => res.json())
      .then((data) => setServicios(data.servicios || []))
      .catch(() => setMensaje("❌ No se pudieron cargar los servicios."));
  }, []);

  const handleUsuarioChange = (e) => {
    setUsuarioSeleccionado(e.target.value);
    setServiciosSeleccionados([]); // Reinicia la selección al cambiar de usuario
  };

  const handleServicioChange = (servicioId) => {
    setServiciosSeleccionados((prevSeleccion) =>
      prevSeleccion.includes(servicioId)
        ? prevSeleccion.filter((id) => id !== servicioId)
        : [...prevSeleccion, servicioId]
    );
  };

  const handleAsignarServicios = async () => {
    if (!usuarioSeleccionado || serviciosSeleccionados.length === 0) {
      setMensaje("⚠️ Selecciona un usuario y al menos un servicio.");
      return;
    }

    const asignacion = {
      usuarioId: parseInt(usuarioSeleccionado, 10),
      servicios: serviciosSeleccionados,
    };

    try {
      const response = await fetch("http://localhost:5000/api/asignar-servicios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(asignacion),
      });

      const data = await response.json();
      setMensaje(response.ok ? `✔ ${data.message}` : `❌ ${data.error}`);
    } catch (error) {
      console.error("❌ Error asignando servicios:", error.message);
      setMensaje("❌ Error inesperado al asignar servicios.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
        Asignación de Servicios a Usuarios
      </h1>

      {mensaje && (
        <p
          className={`text-center font-semibold mb-4 ${
            mensaje.startsWith("✔") ? "text-green-500" : "text-red-500"
          }`}
        >
          {mensaje}
        </p>
      )}

      {/* Selección de usuario */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <label className="font-semibold mb-2 md:mb-0">Selecciona un usuario:</label>
        <select
          onChange={handleUsuarioChange}
          className="border p-2 rounded-md w-full md:w-1/2"
          defaultValue=""
        >
          <option value="">-- Selecciona --</option>
          {usuarios.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nombres} {user.apellidos} - {user.email}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de servicios con checkboxes */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-3">Selecciona los servicios:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicios.map((servicio) => (
            <label
              key={servicio.id}
              className="flex items-center space-x-2 border p-3 rounded-lg shadow-sm"
            >
              <input
                type="checkbox"
                checked={serviciosSeleccionados.includes(servicio.id)}
                onChange={() => handleServicioChange(servicio.id)}
              />
              <span>{servicio.servicio}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleAsignarServicios}
        className="w-full p-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-md"
      >
        Asignar Servicios
      </button>
    </div>
  );
}

export default AsignarServicios;
