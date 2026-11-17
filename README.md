# 🍕 Food Store - Sistema Full Stack (UTN)

Proyecto desarrollado para la **Unidad 7 (Trabajo Práctico)** de la Tecnicatura Universitaria en Programación (UTN). Consiste en una aplicación Web Full Stack orientada a la gestión integral de un comercio de alimentos, implementando un CRUD completo de productos y categorías con relaciones Muchos a Muchos (M2M).

---

## 🚀 Tecnologías Utilizadas

### Backend
* **Python 3.10+**
* **FastAPI** (Framework web moderno y asíncrono)
* **SQLModel / SQLAlchemy** (ORM para modelado de datos)
* **PostgreSQL** (Base de datos relacional)

### Frontend
* **React 19** con **Vite** y **TypeScript** (Tipado estático)
* **Tailwind CSS v4** (Diseño moderno y responsivo)
* **TanStack Query (React Query v5)** (Gestión de estado del servidor y caché)
* **React Router DOM v7** (Enrutamiento del lado del cliente SPA)

---

## 📂 Estructura del Repositorio

```text
tp-7/
├── backend/
│   ├── app/
│   │   ├── categoria/      # Modelos, esquemas y routers de categorías
│   │   ├── producto/       # Modelos, esquemas y routers de productos (con M2M)
│   │   ├── database.py     # Configuración de la conexión a la base de datos
│   │   └── main.py         # Punto de entrada de FastAPI
│   └── requirements.txt    # Dependencias de Python
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables (Navbar)
│   │   ├── pages/          # Vistas (HomePage, CategoriasPage, ProductsPage)
│   │   ├── services/       # Clientes HTTP y servicios API tipados
│   │   ├── types/          # Interfaces TypeScript (Categoria, Producto)
│   │   ├── App.tsx         # Configuración de rutas (React Router)
│   │   └── main.tsx        # Punto de entrada y providers (QueryClient)
│   └── package.json        # Dependencias de Node.js
│
└── README.md


 ⚙️ Guía de Instalación y Ejecución Local
Para poner en marcha el proyecto en tu entorno local, sigue estos pasos:

1. Clonar el repositorio
Bash
git clone <URL_DE_TU_REPOSITORIO>
cd tp-7

2. Configurar y Ejecutar el Backend
Bash
# Entrar a la carpeta del backend
cd backend

# Crear y activar un entorno virtual (opcional pero recomendado)
python -m venv .venv
# En Windows (PowerShell):
.venv\Scripts\Activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar el servidor de desarrollo FastAPI
fastapi dev app/main.py
El backend estará disponible en http://localhost:8000. Puedes ver la documentación interactiva en Swagger ejecutando http://localhost:8000/docs.

3. Configurar y Ejecutar el Frontend
Abre una nueva terminal en la raíz del proyecto y ejecuta:

Bash
# Entrar a la carpeta del frontend
cd frontend

# Instalar dependencias
pnpm install  # o npm install

# Iniciar el servidor de desarrollo Vite
npm run dev
El frontend estará disponible en http://localhost:5173.

✨ Características Principales
Arquitectura Modular: Separación limpia entre lógica de negocio en backend y componentes orientados a vistas en el frontend.

Tipado Estricto: Uso riguroso de interfaces y tipos en TypeScript sincronizados con los esquemas Pydantic/SQLModel de FastAPI.

Manejo de Errores Robusto: Cliente HTTP personalizado (fetchApi / ApiError) que captura los detalles devueltos por el servidor.

Gestión Asíncrona Eficiente: Caché, invalidación y reintentos automáticos manejados mediante TanStack Query.

Relaciones M2M: Interfaz dedicada para asignar y remover múltiples categorías a cada producto de manera dinámica.


# Link de Repositorio

## (https://github.com/Marcelo-GomezArmoa/tp-7)