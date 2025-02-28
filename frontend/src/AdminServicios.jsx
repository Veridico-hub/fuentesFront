import { useEffect, useState } from "react";

function AdminServicios() {
  const [usuarios, setUsuarios] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [servicioSeleccionado, setServicioSeleccionado] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/users") // 🔹 Obtener usuarios
      .then((res) => res.json())
      .then((data) => setUsuarios(data.usuarios));

    fetch("http://localhost:5000/api/servicios") // 🔹 Obtener servicios
      .then((res) => res.json())
      .then((data) => setServicios(data.servicios));
  }, []);

  const handleAsignarServicio = async () => {
    if (!usuarioSeleccionado || !servicioSeleccionado) {
      setMensaje("❌ Selecciona un usuario y un servicio.");
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/asignar-servicio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        usuario_id: usuarioSeleccionado,
        servicio_id: servicioSeleccionado,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setMensaje("✅ Servicio asignado con éxito.");
    } else {
      setMensaje("❌ " + data.error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600">Asignar Servicios</h1>

      {mensaje && <p className="text-red-500 mt-2">{mensaje}</p>}

      <div className="flex flex-col gap-4 mt-4">
        <select onChange={(e) => setUsuarioSeleccionado(e.target.value)} className="border p-2 rounded">
          <option value="">Selecciona un usuario</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombres} {usuario.apellidos}
            </option>
          ))}
        </select>

        <select onChange={(e) => setServicioSeleccionado(e.target.value)} className="border p-2 rounded">
          <option value="">Selecciona un servicio</option>
          {servicios.map((servicio) => (
            <option key={servicio.id} value={servicio.id}>
              {servicio.codigo} - {servicio.servicio}
            </option>
          ))}
        </select>

        <button onClick={handleAsignarServicio} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
          Asignar Servicio
        </button>
      </div>
    </div>
  );
}

export default AdminServicios;
