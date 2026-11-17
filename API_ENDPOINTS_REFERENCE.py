"""API Endpoints Reference - Productos y Categorías"""

# ============================================================================
# ENDPOINTS DE CATEGORÍAS
# ============================================================================

"""
1. GET /categorias
   - Obtiene todas las categorías
   - Response: 200 OK - Lista de categorías
   
2. GET /categorias/{categoria_id}
   - Obtiene una categoría específica
   - Response: 200 OK | 404 NOT FOUND
   
3. POST /categorias
   - Crea una nueva categoría
   - Body: {"nombre": "string", "descripcion": "string"}
   - Response: 201 CREATED | 400 BAD REQUEST
   
4. PUT /categorias/{categoria_id}
   - Actualiza una categoría
   - Body: {"nombre": "string?", "descripcion": "string?"}
   - Response: 200 OK | 404 NOT FOUND | 400 BAD REQUEST
   
5. DELETE /categorias/{categoria_id}
   - Elimina una categoría
   - Response: 204 NO CONTENT | 404 NOT FOUND
"""

# ============================================================================
# ENDPOINTS DE PRODUCTOS
# ============================================================================

"""
1. GET /productos
   - Obtiene todos los productos
   - Response: 200 OK - Lista de productos
   
2. GET /productos/{producto_id}
   - Obtiene un producto específico
   - Response: 200 OK | 404 NOT FOUND
   
3. POST /productos
   - Crea un nuevo producto
   - Body: {
       "nombre": "string",
       "descripcion": "string",
       "precio_base": number (>= 0),
       "imagenes_url": ["string"],
       "disponible": boolean
     }
   - Response: 201 CREATED | 400 BAD REQUEST
   
4. PUT /productos/{producto_id}
   - Actualiza un producto
   - Body: {
       "nombre": "string?",
       "descripcion": "string?",
       "precio_base": number?,
       "imagenes_url": ["string"]?,
       "disponible": boolean?
     }
   - Response: 200 OK | 404 NOT FOUND | 400 BAD REQUEST
   
5. DELETE /productos/{producto_id}
   - Elimina un producto
   - Response: 204 NO CONTENT | 404 NOT FOUND
"""

# ============================================================================
# ENDPOINTS DE RELACIONES (Producto-Categoría - Muchos a Muchos)
# ============================================================================

"""
1. POST /productos/{producto_id}/categorias
   - Asigna una categoría a un producto
   - Body: {"categoria_id": int}
   - Response: 201 CREATED - {"mensaje": "...", "producto_id": int, "categoria_id": int}
   - Errors: 404 NOT FOUND | 400 BAD REQUEST (duplicado o error)
   
2. GET /productos/{producto_id}/categorias
   - Obtiene todas las categorías de un producto
   - Response: 200 OK - Lista de categorías
   - Errors: 404 NOT FOUND
   
3. DELETE /productos/{producto_id}/categorias/{categoria_id}
   - Desvincula una categoría de un producto
   - Response: 200 OK - {"mensaje": "...", "producto_id": int, "categoria_id": int}
   - Errors: 404 NOT FOUND (producto, categoría o relación no existe)
"""

# ============================================================================
# MODELOS DE DATOS (Schemas)
# ============================================================================

"""
CategoriaCreate / CategoriaRead / CategoriaUpdate:
{
  "id": int (read-only),
  "nombre": string (unique, indexed),
  "descripcion": string
}

ProductoCreate / ProductoRead / ProductoUpdate:
{
  "id": int (read-only),
  "nombre": string (indexed),
  "descripcion": string,
  "precio_base": float (>= 0),
  "imagenes_url": string[],
  "disponible": boolean
}

AsignarCategoria:
{
  "categoria_id": int
}

ProductoCategoria (tabla intermedia):
{
  "producto_id": int (FK, PK),
  "categoria_id": int (FK, PK)
}
"""

# ============================================================================
# CARACTERÍSTICAS ESPECIALES
# ============================================================================

"""
✓ Status Codes HTTP correctos:
  - 200: Operación exitosa con respuesta
  - 201: Recurso creado exitosamente
  - 204: Recurso eliminado (sin contenido)
  - 400: Error de validación o regla de negocio
  - 404: Recurso no encontrado

✓ Validaciones implementadas:
  - Categorías: Nombre único
  - Productos: Precio >= 0
  - Relaciones M2M: Evita duplicados
  - Verificación de existencia antes de operaciones

✓ Manejo de errores:
  - IntegrityError para conflictos de datos
  - SQLAlchemyError para errores de BD
  - HTTPException con status codes apropiados

✓ Funcionalidades:
  - CRUD completo para Categorías y Productos
  - Relación muchos a muchos (Producto-Categoría)
  - Sesiones de BD inyectadas con Depends
  - Tipado fuerte con Python 3.10+
  - Docstrings completos en todas las funciones
"""
