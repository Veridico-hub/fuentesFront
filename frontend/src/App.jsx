import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Login from "./Login";
import Registro from "./Registro";
import Perfil from "./Perfil";
import Dashboard from "./Dashboard";
import AdminServicios from "./AdminServicios";
import AuthGuard from "./components/AuthGuard"; // ✅ Importamos AuthGuard
import Informe from "./Informe"; // ✅ Importamos la nueva página


function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRol, setUserRol] = useState("");

  useEffect(() => {
    setUserRol(localStorage.getItem("rol"));
  }, []);

  return (
    <Router>
      {/* ✅ Barra de navegación */}
      <nav className="bg-blue-600 p-4 text-white fixed w-full top-0 shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mi App</h1>

          {/* Menú hamburguesa en móviles */}
          <button className="text-white md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
          </button>

          {/* Menú en pantallas grandes */}
          <ul className="hidden md:flex space-x-6">
            <li><Link to="/registro" className="hover:underline">Registro</Link></li>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
            <li><Link to="/informe" className="hover:underline">Informe</Link></li>
            {userRol === "admin" && ( // ✅ Solo visible para admin
              <li><Link to="/admin-servicios" className="hover:underline">Admin Servicios</Link></li>
            )}
          </ul>
        </div>

        {/* ✅ Menú desplegable en móviles */}
        {menuOpen && (
          <ul className="md:hidden bg-blue-700 text-center p-4">
            <li className="py-2"><Link to="/registro" onClick={() => setMenuOpen(false)}>Registro</Link></li>
            <li className="py-2"><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
            <li className="py-2"><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
            {userRol === "admin" && (
              <li className="py-2"><Link to="/admin-servicios" onClick={() => setMenuOpen(false)}>Admin Servicios</Link></li>
            )}
          </ul>
        )}
      </nav>

      {/* ✅ Contenido de la aplicación */}
      <div className="mt-16 p-6">
        <Routes>
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />

          {/* ✅ Protegemos rutas privadas con AuthGuard */}
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/perfil" element={<AuthGuard><Perfil /></AuthGuard>} />
          <Route path="/admin-servicios" element={<AuthGuard roleRequired="admin"><AdminServicios /></AuthGuard>} />
          <Route path="/informe" element={<Informe />} />
          <Route path="/" element={<div className="text-center text-gray-500">Bienvenido, elige una opción del menú.</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
