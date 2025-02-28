import { Button } from "./ui/button";
import axios from "axios";

export default function ServiceActions({ usuarioSeleccionado, serviciosSeleccionados, setServiciosSeleccionados }) {
  const asignarServicios = async () => {
    if (!usuarioSeleccionado) {
      alert("Seleccione un usuario antes de asignar servicios.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/servicios/usuarios/${usuarioSeleccionado}/asignar`, {
        servicios: serviciosSeleccionados,
      });
      alert("Servicios asignados exitosamente.");
      console.log("Respuesta de asignación:", response.data);
      setServiciosSeleccionados([]);
    } catch (error) {
      console.error("Error al asignar servicios:", error);
      alert("Hubo un error al asignar los servicios.");
    }
  };

  return (
    <Button onClick={asignarServicios} className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white">
      Asignar Servicios
    </Button>
  );
}