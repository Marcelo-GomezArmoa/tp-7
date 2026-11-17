from sqlmodel import SQLModel, Field, Column, JSON, Relationship
from typing import Optional, List

class ProductoCategoria(SQLModel, table=True):
    producto_id: Optional[int] = Field(default=None, foreign_key="producto.id", primary_key=True)
    categoria_id: Optional[int] = Field(default=None, foreign_key="categoria.id", primary_key=True)

class ProductoBase(SQLModel):
    nombre: str = Field(index=True)
    descripcion: str
    precio_base: float = Field(ge=0)
    imagenes_url: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    disponible: bool = Field(default=True)

class Producto(ProductoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    categorias: List["Categoria"] = Relationship(back_populates="productos", link_model=ProductoCategoria)