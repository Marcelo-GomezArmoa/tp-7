from sqlmodel import SQLModel
from typing import Optional

class CategoriaCreate(SQLModel):
    nombre: str
    descripcion: str

class CategoriaRead(SQLModel):
    id: int
    nombre: str
    descripcion: str

class CategoriaUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
