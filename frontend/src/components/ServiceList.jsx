import React from "react";

export default function ServiceList({ servicios, serviciosSeleccionados = [], manejarSeleccionServicio }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold mb-3">Lista de Servicios:</h3>
      <div className="space-y-2">
        {Array.isArray(servicios) && servicios.length > 0 ? (
          servicios.map((servicio) => (
            <div key={servicio.id} className="flex items-center">
              <input
                type="checkbox"
                id={`servicio-${servicio.id}`}
                checked={Array.isArray(serviciosSeleccionados) && serviciosSeleccionados.includes(servicio.id)}
                onChange={() => manejarSeleccionServicio(servicio.id)}
                className="mr-2"
              />
              <label htmlFor={`servicio-${servicio.id}`} className="text-gray-800">
                {servicio.servicio}
              </label>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay servicios disponibles.</p>
        )}
      </div>
    </div>
  );
}
