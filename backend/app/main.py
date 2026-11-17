"""FastAPI application entry point."""
from fastapi import FastAPI
from app.core.database import create_db_and_tables
from app.categoria.router import router as categoria_router
from app.producto.router import router as producto_router

# Crear tablas al iniciar
create_db_and_tables()

app = FastAPI(
    title="FastAPI Productos",
    description="API REST para gestionar productos y categorías",
    version="1.0.0"
)

# Incluir routers
app.include_router(categoria_router)
app.include_router(producto_router)


@app.get("/")
async def root():
    return {"message": "Bienvenido a FastAPI Productos API"}

