/**
 * Página de Productos
 * Lista y gestión de productos con relaciones de categorías
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductos,
  createProducto,
  deleteProducto,
  getCategoriasDeProducto,
  asignarCategoriaAProducto,
  quitarCategoriaDeProducto,
} from "@/services/productoService";
import { getCategorias } from "@/services/categoriaService";
import { ApiError } from "@/services/api";
import type { Producto } from "@/types/producto";

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [selectedProductoId, setSelectedProductoId] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio_base: "",
    imagenes_url: "",
    disponible: true,
  });
  const [error, setError] = useState<string | null>(null);

  // Obtener productos
  const { data: productos = [], isLoading } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });

  // Obtener categorías disponibles
  const { data: categoriasDisponibles = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  // Obtener categorías del producto seleccionado
  const { data: productoCategorias = [] } = useQuery({
    queryKey: ["producto-categorias", selectedProductoId],
    queryFn: () =>
      selectedProductoId
        ? getCategoriasDeProducto(selectedProductoId)
        : Promise.resolve([]),
    enabled: !!selectedProductoId && isCategoriesModalOpen,
  });

  // Crear producto
  const createMutation = useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setFormData({
        nombre: "",
        descripcion: "",
        precio_base: "",
        imagenes_url: "",
        disponible: true,
      });
      setIsModalOpen(false);
      setError(null);
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else {
        setError("Error al crear el producto");
      }
    },
  });

  // Eliminar producto
  const deleteMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        alert(`Error al eliminar: ${err.detail}`);
      }
    },
  });

  // Asignar categoría
  const asignarMutation = useMutation({
    mutationFn: ({
      productoId,
      categoriaId,
    }: {
      productoId: number;
      categoriaId: number;
    }) => asignarCategoriaAProducto(productoId, categoriaId),
    onSuccess: () => {
      if (selectedProductoId) {
        queryClient.invalidateQueries({
          queryKey: ["producto-categorias", selectedProductoId],
        });
      }
      setError(null);
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        setError(err.detail);
      }
    },
  });

  // Quitar categoría
  const quitarMutation = useMutation({
    mutationFn: ({
      productoId,
      categoriaId,
    }: {
      productoId: number;
      categoriaId: number;
    }) => quitarCategoriaDeProducto(productoId, categoriaId),
    onSuccess: () => {
      if (selectedProductoId) {
        queryClient.invalidateQueries({
          queryKey: ["producto-categorias", selectedProductoId],
        });
      }
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        alert(`Error al quitar: ${err.detail}`);
      }
    },
  });

  const handleCreateProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.nombre ||
      !formData.descripcion ||
      !formData.precio_base
    ) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    const imagenes = formData.imagenes_url
      ? formData.imagenes_url.split(",").map((url) => url.trim())
      : [];

    createMutation.mutate({
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio_base: parseFloat(formData.precio_base),
      imagenes_url: imagenes,
      disponible: formData.disponible,
    });
  };

  const handleDeleteProducto = (productoId: number) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este producto?")
    ) {
      deleteMutation.mutate(productoId);
    }
  };

  const handleAsignarCategoria = (categoriaId: number) => {
    if (!selectedProductoId) return;
    asignarMutation.mutate({ productoId: selectedProductoId, categoriaId });
  };

  const handleQuitarCategoria = (categoriaId: number) => {
    if (!selectedProductoId) return;
    quitarMutation.mutate({ productoId: selectedProductoId, categoriaId });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">🍽️ Productos</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            + Nuevo Producto
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        )}

        {/* Grid de Productos */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No hay productos. ¡Crea uno nuevo!
                </p>
              </div>
            ) : (
              productos.map((producto: Producto) => (
                <div
                  key={producto.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                >
                  {/* Imagen del Producto */}
                  {producto.imagenes_url.length > 0 && (
                    <div className="w-full h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={producto.imagenes_url[0]}
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ENo imagen%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold text-gray-900 flex-1">
                        {producto.nombre}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          producto.disponible
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {producto.disponible ? "Disponible" : "No disponible"}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      {producto.descripcion}
                    </p>

                    <div className="bg-purple-50 p-3 rounded-lg mb-4">
                      <p className="text-purple-900 font-bold">
                        ${producto.precio_base.toFixed(2)}
                      </p>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProductoId(producto.id);
                          setIsCategoriesModalOpen(true);
                        }}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 text-sm"
                      >
                        Categorías
                      </button>
                      <button
                        onClick={() => handleDeleteProducto(producto.id)}
                        disabled={deleteMutation.isPending}
                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors duration-200 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal para Crear Producto */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 my-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Nuevo Producto
              </h2>

              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateProducto} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ej: Pizza Margherita"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Ej: Pizza clásica italiana"
                    rows={3}
                  />
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Base *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio_base}
                    onChange={(e) =>
                      setFormData({ ...formData, precio_base: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="250.50"
                  />
                </div>

                {/* URLs de Imágenes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URLs de Imágenes (separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={formData.imagenes_url}
                    onChange={(e) =>
                      setFormData({ ...formData, imagenes_url: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://ejemplo.com/imagen1.jpg"
                  />
                </div>

                {/* Disponible */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="disponible"
                    checked={formData.disponible}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        disponible: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <label htmlFor="disponible" className="text-sm font-medium text-gray-700">
                    Disponible
                  </label>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setError(null);
                      setFormData({
                        nombre: "",
                        descripcion: "",
                        precio_base: "",
                        imagenes_url: "",
                        disponible: true,
                      });
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                  >
                    {createMutation.isPending ? "Creando..." : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Categorías */}
        {isCategoriesModalOpen && selectedProductoId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 my-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Gestionar Categorías
              </h2>

              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Categorías Disponibles */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Agregar Categoría
                  </h3>
                  <div className="space-y-2">
                    {categoriasDisponibles.map((categoria: any) => (
                      <button
                        key={categoria.id}
                        onClick={() => handleAsignarCategoria(categoria.id)}
                        disabled={
                          asignarMutation.isPending ||
                          productoCategorias.some((pc) => pc.id === categoria.id)
                        }
                        className={`w-full text-left px-4 py-2 rounded border-2 transition-colors ${
                          productoCategorias.some((pc) => pc.id === categoria.id)
                            ? "bg-green-100 border-green-500"
                            : "border-gray-300 hover:border-blue-500"
                        }`}
                      >
                        {categoria.nombre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categorías Asignadas */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Categorías Asignadas
                  </h3>
                  {productoCategorias.length === 0 ? (
                    <p className="text-gray-600 text-sm">
                      Ninguna categoría asignada
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {productoCategorias.map((categoria: any) => (
                        <div
                          key={categoria.id}
                          className="flex justify-between items-center bg-gray-100 p-3 rounded"
                        >
                          <span className="font-medium text-gray-900">
                            {categoria.nombre}
                          </span>
                          <button
                            onClick={() => handleQuitarCategoria(categoria.id)}
                            disabled={quitarMutation.isPending}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Quitar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botón Cerrar */}
                <button
                  onClick={() => {
                    setIsCategoriesModalOpen(false);
                    setSelectedProductoId(null);
                    setError(null);
                  }}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
