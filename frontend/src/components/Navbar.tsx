/**
 * Componente Navbar
 * Barra de navegación superior con enlaces a las principales secciones
 */

import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Título */}
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-bold text-xl hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">🍕</span>
            <span>Food Store UTN</span>
          </Link>

          {/* Enlaces de Navegación */}
          <div className="flex gap-6">
            <Link
              to="/"
              className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Inicio
            </Link>
            <Link
              to="/categorias"
              className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Categorías
            </Link>
            <Link
              to="/productos"
              className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Productos
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
