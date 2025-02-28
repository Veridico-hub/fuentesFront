import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

function Informe() {
  const [rut, setRut] = useState("");
  const [numeroInforme, setNumeroInforme] = useState("");
  const [fechaInforme, setFechaInforme] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [captchaValido, setCaptchaValido] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  // 📌 Validar reCAPTCHA antes de buscar el informe
  const handleCaptcha = async (token) => {
    console.log("✅ CAPTCHA validado en frontend:", token);
    setCaptchaToken(token);

    try {
      const response = await fetch("http://localhost:8082/api/verificar-captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }), // 🔥 Enviar correctamente en JSON
      });

      const data = await response.text();
      if (response.ok) {
        console.log("✔ CAPTCHA verificado en backend:", data);
        setCaptchaValido(true);
      } else {
        console.log("❌ CAPTCHA inválido en backend");
        setMensaje("❌ Verificación de seguridad fallida.");
        setCaptchaValido(false);
      }
    } catch (error) {
      console.error("❌ Error verificando CAPTCHA:", error);
      setMensaje("❌ Error en la verificación de seguridad.");
      setCaptchaValido(false);
    }
  };

  const handleBuscarInforme = async () => {
    if (!numeroInforme || !rut || !fechaInforme) {
      setMensaje("⚠️ Debes ingresar todos los criterios de búsqueda.");
      return;
    }

    if (!captchaValido) {
      setMensaje("⚠️ Verifica que eres un humano con el CAPTCHA.");
      return;
    }

    setMensaje("🔍 Validando informe...");

    const fechaFormateada = fechaInforme.replace(/-/g, ""); // 📌 Formato YYYYMMDD
    const url = `http://localhost:8082/v1/documento/buscar/${numeroInforme}/${rut}/${fechaFormateada}`;

    console.log("🔍 URL de consulta:", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("No se encontraron informes.");
      }

      // Obtener PDF en Base64
      const base64String = await response.text();
      console.log("🔍 Base64 recibido:", base64String.substring(0, 100) + "...");

      // Convertir Base64 a un archivo PDF
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Abrir PDF en una nueva pestaña
      const urlBlob = URL.createObjectURL(blob);
      window.open(urlBlob, "_blank");

      setMensaje("✅ Informe descargado correctamente.");
    } catch (error) {
      console.error("❌ Error en la consulta:", error.message);
      setMensaje("❌ No se encontraron informes.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
        Consulta de Informes
      </h1>

      {mensaje && (
        <p className="text-red-500 text-center font-semibold mb-4">{mensaje}</p>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">RUT del Cliente:</label>
        <input
          type="text"
          placeholder="Ej: 25876655-5"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Número de Informe:</label>
        <input
          type="text"
          placeholder="Ej: 1234"
          value={numeroInforme}
          onChange={(e) => setNumeroInforme(e.target.value)}
          className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Fecha del Informe:</label>
        <input
          type="date"
          value={fechaInforme}
          onChange={(e) => setFechaInforme(e.target.value)}
          className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 🔹 Google reCAPTCHA (Visible) */}
      <div className="mb-4 flex justify-center">
        <ReCAPTCHA
          sitekey="6LfMMdkqAAAAACqv1kcfyIjStfIHqv97ACd5mVii" // 🔥 Reemplázala con tu clave real de reCAPTCHA v2
          onChange={handleCaptcha}
        />
      </div>

      <button
        onClick={handleBuscarInforme}
        disabled={!captchaValido} // 🔹 Deshabilitado hasta que se valide el CAPTCHA
        className={`p-3 w-full rounded-md font-bold ${
          captchaValido ? "bg-blue-500 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
        } transition duration-200`}
      >
        Buscar Informe
      </button>
    </div>
  );
}

export default Informe;
