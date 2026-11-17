/**
 * Cliente HTTP base para comunicación con el backend FastAPI
 * Proporciona tipado fuerte, manejo de errores y soporte para respuestas vacías (204)
 */

const API_BASE_URL = "http://localhost:8000";

/**
 * Opciones extendidas para las peticiones HTTP
 */
interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Estructura de error retornada por el backend
 */
interface ApiErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

/**
 * Clase personalizada para errores de API
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
    message?: string
  ) {
    super(message || detail);
    this.name = "ApiError";
  }
}

/**
 * Cliente HTTP genérico con soporte para tipos
 * @template T - Tipo de dato esperado en la respuesta
 * @param endpoint - Ruta del endpoint (ej: "/categorias")
 * @param options - Opciones de RequestInit + params
 * @returns Promise<T> - Respuesta parseada o undefined para 204
 * @throws ApiError - Si la respuesta no es 2xx
 */
export async function fetchApi<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T | undefined> {
  const { params, ...fetchOptions } = options;

  // Construir URL con parámetros de query si existen
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString();
    url += `?${queryString}`;
  }

  // Headers por defecto
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Manejar respuesta 204 (No Content)
    if (response.status === 204) {
      return undefined;
    }

    // Intentar parsear el JSON de respuesta
    let data: unknown;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Si la respuesta no es exitosa (2xx), lanzar error
    if (!response.ok) {
      const errorResponse = data as ApiErrorResponse;
      const errorDetail =
        errorResponse?.detail ||
        errorResponse?.message ||
        `Error ${response.status}: ${response.statusText}`;

      throw new ApiError(response.status, errorDetail);
    }

    return data as T;
  } catch (error) {
    // Si ya es un ApiError, re-lanzarlo
    if (error instanceof ApiError) {
      throw error;
    }

    // Si es un error de red o de parsing
    if (error instanceof TypeError) {
      throw new ApiError(
        0,
        "Error de conexión",
        `No se pudo conectar al servidor: ${error.message}`
      );
    }

    // Cualquier otro error
    throw new ApiError(500, "Error desconocido", String(error));
  }
}

/**
 * Helpers para métodos HTTP comunes
 */

export const http = {
  /**
   * Realiza una petición GET
   */
  get<T = unknown>(endpoint: string, options: FetchOptions = {}): Promise<T | undefined> {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "GET",
    });
  },

  /**
   * Realiza una petición POST
   */
  post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options: FetchOptions = {}
  ): Promise<T | undefined> {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * Realiza una petición PUT
   */
  put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options: FetchOptions = {}
  ): Promise<T | undefined> {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * Realiza una petición DELETE
   */
  delete<T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T | undefined> {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  },
};
