from sqlmodel import SQLModel
from typing import List, Optional

class ProductoCreate(SQLModel):
    nombre: str
    descripcion: str
    precio_base: float
    imagenes_url: List[str] = []
    disponible: bool = True

class ProductoRead(SQLModel):
    id: int
    nombre: str
    descripcion: str
    precio_base: float
    imagenes_url: List[str]
    disponible: bool

class ProductoUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_base: Optional[float] = None
    imagenes_url: Optional[List[str]] = None
    disponible: Optional[bool] = None

class AsignarCategoria(SQLModel):
    categoria_id: int
