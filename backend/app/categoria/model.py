from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class CategoriaBase(SQLModel):
    nombre: str = Field(index=True, unique=True)
    descripcion: str

class Categoria(CategoriaBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    productos: List["Producto"] = Relationship(back_populates="categorias", link_model=None)