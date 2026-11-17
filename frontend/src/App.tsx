/**
 * Componente App Principal
 * Configura el enrutamiento y estructura general de la aplicación
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { HomePage } from "@/pages/HomePage";
import { CategoriasPage } from "@/pages/CategoriasPage";
import { ProductsPage } from "@/pages/ProductsPage";
import "./App.css";

// Crear instancia de QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos (antes era cacheTime)
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* Navbar */}
          <Navbar />

          {/* Contenido Principal */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categorias" element={<CategoriasPage />} />
              <Route path="/productos" element={<ProductsPage />} />
              {/* Ruta 404 */}
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900">404</h1>
                      <p className="text-gray-600 mt-2">
                        Página no encontrada
                      </p>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-6 mt-12">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <p>
                🍕 Food Store UTN • Unidad 7 • Full Stack Development (FastAPI +
                React)
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
