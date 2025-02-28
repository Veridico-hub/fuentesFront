import React from "react";

export default function UserSelector({ usuarioSeleccionado, setUsuarioSeleccionado, usuarios }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Usuario:</label>
      {usuarios.length === 0 ? (
        <p className="text-red-500">⚠️ No hay usuarios disponibles</p>
      ) : (
        <select
          className="w-full p-2 border rounded-lg"
          value={usuarioSeleccionado || ""}
          onChange={(e) => setUsuarioSeleccionado(e.target.value)} // ✅ Ahora pasamos solo el valor
        >
          <option value="">Seleccione un usuario</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombres} {usuario.apellidos} - {usuario.email}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}


