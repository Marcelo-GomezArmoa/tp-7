/**
 * Página de Categorías
 * Lista y gestión de categorías con modal para crear nuevas
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategorias,
  createCategoria,
  deleteCategoria,
} from "@/services/categoriaService";
import { ApiError } from "@/services/api";
import type { Categoria } from "@/types/categoria";

export function CategoriasPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [error, setError] = useState<string | null>(null);

  // Obtener categorías
  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  // Crear categoría
  const createMutation = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setFormData({ nombre: "", descripcion: "" });
      setIsModalOpen(false);
      setError(null);
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else {
        setError("Error al crear la categoría");
      }
    },
  });

  // Eliminar categoría
  const deleteMutation = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        alert(`Error al eliminar: ${err.detail}`);
      }
    },
  });

  const handleCreateCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.descripcion) {
      setError("Por favor completa todos los campos");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleDeleteCategoria = (categoriaId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      deleteMutation.mutate(categoriaId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">📂 Categorías</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            + Nueva Categoría
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando categorías...</p>
          </div>
        )}

        {/* Grid de Categorías */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No hay categorías. ¡Crea una nueva!
                </p>
              </div>
            ) : (
              categorias.map((categoria: Categoria) => (
                <div
                  key={categoria.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900">
                        {categoria.nombre}
                      </h2>
                      <p className="text-gray-600 mt-2">
                        {categoria.descripcion}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ID: {categoria.id}
                    </span>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDeleteCategoria(categoria.id)}
                      disabled={deleteMutation.isPending}
                      className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                    >
                      {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal para Crear Categoría */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Nueva Categoría
              </h2>

              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateCategoria} className="space-y-4">
                {/* Campo Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Bebidas"
                  />
                </div>

                {/* Campo Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Ej: Bebidas varias"
                    rows={4}
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setError(null);
                      setFormData({ nombre: "", descripcion: "" });
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                  >
                    {createMutation.isPending ? "Creando..." : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
