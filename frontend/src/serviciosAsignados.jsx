import { useState, useEffect } from "react";

function ConsultaServiciosAsignados({ usuarioId }) {
  const [serviciosAsignados, setServiciosAsignados] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!usuarioId) {
      setServiciosAsignados([]);
      setMensaje("⚠️ Selecciona un usuario para ver los servicios asignados.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No hay token disponible. El usuario no está autenticado.");
      setMensaje("❌ No tienes permisos para ver estos servicios.");
      return;
    }

    console.log("📌 Cargando servicios para usuario:", usuarioId);

    fetch(`http://localhost:5000/api/mis-servicios/${usuarioId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("📌 Respuesta de la API:", res);
        if (!res.ok) throw new Error(`Error ${res.status}: No se pudieron obtener los servicios`);
        return res.json();
      })
      .then((data) => {
        console.log("📌 Servicios obtenidos:", data);
        
        if (data && Array.isArray(data.servicios)) {
          setServiciosAsignados(data.servicios); // ✅ Asegurar que se asigna correctamente
          setMensaje(data.servicios.length ? "" : "⚠️ Este usuario no tiene servicios asignados.");
        } else {
          console.error("⚠️ Formato inesperado en la API de servicios asignados:", data);
          setMensaje("❌ Error al obtener servicios.");
        }
      })
      .catch((error) => {
        console.error("❌ Error obteniendo servicios asignados:", error.message);
        setMensaje("❌ No tienes permisos para ver estos servicios.");
      });
  }, [usuarioId]);

  return (
    <div>
      {mensaje && <p className="text-red-500 font-semibold">{mensaje}</p>}
      {serviciosAsignados.length > 0 ? (
        <ul className="list-disc ml-5">
          {serviciosAsignados.map((servicio) => (
            <li key={servicio.id} className="text-gray-800">
              <strong>{servicio.servicio}</strong>: {servicio.descripcion}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">⚠️ No hay servicios asignados a este usuario.</p>
      )}
    </div>
  );
}

export default ConsultaServiciosAsignados;
