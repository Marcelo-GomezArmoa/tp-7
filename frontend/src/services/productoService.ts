/**
 * Servicio para consumir los endpoints de Productos del backend
 * Proporciona funciones tipadas para operaciones CRUD y relación con Categorías
 */

import { http } from "./api";
import type { Producto } from "@/types/producto";
import type { Categoria } from "@/types/categoria";

const ENDPOINT = "/productos";

// ============================================================================
// FUNCIONES CRUD BÁSICO PARA PRODUCTOS
// ============================================================================

/**
 * Obtiene la lista de todos los productos
 * @returns Promise<Producto[]> - Array de productos
 * @throws ApiError - Si hay error en la petición
 */
export async function getProductos(): Promise<Producto[]> {
  try {
    const data = await http.get<Producto[]>(ENDPOINT);
    return data || [];
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
}

/**
 * Obtiene un producto específico por su ID
 * @param productoId - ID del producto
 * @returns Promise<Producto> - El producto solicitado
 * @throws ApiError - Si el producto no existe o hay error
 */
export async function getProductoById(productoId: number): Promise<Producto> {
  try {
    const data = await http.get<Producto>(`${ENDPOINT}/${productoId}`);
    if (!data) {
      throw new Error(`No se recibieron datos para el producto ${productoId}`);
    }
    return data;
  } catch (error) {
    console.error(`Error al obtener producto ${productoId}:`, error);
    throw error;
  }
}

/**
 * Crea un nuevo producto
 * @param data - Objeto con los datos del producto (sin ID)
 * @returns Promise<Producto> - El producto creado con su ID
 * @throws ApiError - Si hay error en la validación o creación
 */
export async function createProducto(
  data: Omit<Producto, "id">
): Promise<Producto> {
  try {
    const response = await http.post<Producto>(ENDPOINT, data);
    if (!response) {
      throw new Error("No se recibieron datos del producto creado");
    }
    return response;
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
}

/**
 * Actualiza un producto existente
 * @param productoId - ID del producto a actualizar
 * @param data - Objeto con los campos a actualizar (pueden ser parciales)
 * @returns Promise<Producto> - El producto actualizado
 * @throws ApiError - Si el producto no existe o hay error
 */
export async function updateProducto(
  productoId: number,
  data: Partial<Omit<Producto, "id">>
): Promise<Producto> {
  try {
    const response = await http.put<Producto>(`${ENDPOINT}/${productoId}`, data);
    if (!response) {
      throw new Error("No se recibieron datos del producto actualizado");
    }
    return response;
  } catch (error) {
    console.error(`Error al actualizar producto ${productoId}:`, error);
    throw error;
  }
}

/**
 * Elimina un producto existente
 * @param productoId - ID del producto a eliminar
 * @returns Promise<void>
 * @throws ApiError - Si el producto no existe o hay error
 */
export async function deleteProducto(productoId: number): Promise<void> {
  try {
    await http.delete(`${ENDPOINT}/${productoId}`);
  } catch (error) {
    console.error(`Error al eliminar producto ${productoId}:`, error);
    throw error;
  }
}

// ============================================================================
// FUNCIONES PARA LA RELACIÓN MUCHOS A MUCHOS (Producto-Categoría)
// ============================================================================

/**
 * Respuesta del backend al asignar categoría
 */
interface AsignarCategoriaResponse {
  mensaje: string;
  producto_id: number;
  categoria_id: number;
}

/**
 * Asigna una categoría a un producto
 * @param productoId - ID del producto
 * @param categoriaId - ID de la categoría a asignar
 * @returns Promise<AsignarCategoriaResponse> - Confirmación de la asignación
 * @throws ApiError - Si producto, categoría no existen o relación ya existe
 */
export async function asignarCategoriaAProducto(
  productoId: number,
  categoriaId: number
): Promise<AsignarCategoriaResponse> {
  try {
    const response = await http.post<AsignarCategoriaResponse>(
      `${ENDPOINT}/${productoId}/categorias`,
      { categoria_id: categoriaId }
    );
    if (!response) {
      throw new Error("No se recibieron datos de la asignación");
    }
    return response;
  } catch (error) {
    console.error(
      `Error al asignar categoría ${categoriaId} a producto ${productoId}:`,
      error
    );
    throw error;
  }
}

/**
 * Obtiene todas las categorías asociadas a un producto
 * @param productoId - ID del producto
 * @returns Promise<Categoria[]> - Lista de categorías del producto
 * @throws ApiError - Si el producto no existe o hay error
 */
export async function getCategoriasDeProducto(
  productoId: number
): Promise<Categoria[]> {
  try {
    const data = await http.get<Categoria[]>(
      `${ENDPOINT}/${productoId}/categorias`
    );
    return data || [];
  } catch (error) {
    console.error(
      `Error al obtener categorías del producto ${productoId}:`,
      error
    );
    throw error;
  }
}

/**
 * Respuesta del backend al quitar categoría
 */
interface QuitarCategoriaResponse {
  mensaje: string;
  producto_id: number;
  categoria_id: number;
}

/**
 * Desvincula una categoría de un producto
 * @param productoId - ID del producto
 * @param categoriaId - ID de la categoría a desvincular
 * @returns Promise<QuitarCategoriaResponse> - Confirmación de la operación
 * @throws ApiError - Si producto, categoría o relación no existen
 */
export async function quitarCategoriaDeProducto(
  productoId: number,
  categoriaId: number
): Promise<QuitarCategoriaResponse> {
  try {
    const response = await http.delete<QuitarCategoriaResponse>(
      `${ENDPOINT}/${productoId}/categorias/${categoriaId}`
    );
    if (!response) {
      throw new Error("No se recibieron datos de la operación");
    }
    return response;
  } catch (error) {
    console.error(
      `Error al quitar categoría ${categoriaId} del producto ${productoId}:`,
      error
    );
    throw error;
  }
}
