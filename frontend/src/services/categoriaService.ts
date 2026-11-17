/**
 * Servicio para consumir los endpoints de Categorías del backend
 * Proporciona funciones tipadas para operaciones CRUD
 */

import { http } from "./api";
import type { Categoria } from "@/types/categoria";

const ENDPOINT = "/categorias";

/**
 * Obtiene la lista de todas las categorías
 * @returns Promise<Categoria[]> - Array de categorías
 * @throws ApiError - Si hay error en la petición
 */
export async function getCategorias(): Promise<Categoria[]> {
  try {
    const data = await http.get<Categoria[]>(ENDPOINT);
    return data || [];
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw error;
  }
}

/**
 * Obtiene una categoría específica por su ID
 * @param categoriaId - ID de la categoría
 * @returns Promise<Categoria> - La categoría solicitada
 * @throws ApiError - Si la categoría no existe o hay error
 */
export async function getCategoria(categoriaId: number): Promise<Categoria> {
  try {
    const data = await http.get<Categoria>(`${ENDPOINT}/${categoriaId}`);
    if (!data) {
      throw new Error(`No se recibieron datos para la categoría ${categoriaId}`);
    }
    return data;
  } catch (error) {
    console.error(`Error al obtener categoría ${categoriaId}:`, error);
    throw error;
  }
}

/**
 * Crea una nueva categoría
 * @param datos - Objeto con nombre y descripción de la categoría
 * @returns Promise<Categoria> - La categoría creada con su ID
 * @throws ApiError - Si hay error en la validación o creación
 */
export async function createCategoria(datos: {
  nombre: string;
  descripcion: string;
}): Promise<Categoria> {
  try {
    const data = await http.post<Categoria>(ENDPOINT, datos);
    if (!data) {
      throw new Error("No se recibieron datos de la categoría creada");
    }
    return data;
  } catch (error) {
    console.error("Error al crear categoría:", error);
    throw error;
  }
}

/**
 * Actualiza una categoría existente
 * @param categoriaId - ID de la categoría a actualizar
 * @param datos - Objeto con los campos a actualizar (pueden ser parciales)
 * @returns Promise<Categoria> - La categoría actualizada
 * @throws ApiError - Si la categoría no existe o hay error
 */
export async function updateCategoria(
  categoriaId: number,
  datos: Partial<{ nombre: string; descripcion: string }>
): Promise<Categoria> {
  try {
    const data = await http.put<Categoria>(`${ENDPOINT}/${categoriaId}`, datos);
    if (!data) {
      throw new Error(`No se recibieron datos de la categoría actualizada`);
    }
    return data;
  } catch (error) {
    console.error(`Error al actualizar categoría ${categoriaId}:`, error);
    throw error;
  }
}

/**
 * Elimina una categoría existente
 * @param categoriaId - ID de la categoría a eliminar
 * @returns Promise<void>
 * @throws ApiError - Si la categoría no existe o hay error
 */
export async function deleteCategoria(categoriaId: number): Promise<void> {
  try {
    await http.delete(`${ENDPOINT}/${categoriaId}`);
  } catch (error) {
    console.error(`Error al eliminar categoría ${categoriaId}:`, error);
    throw error;
  }
}
