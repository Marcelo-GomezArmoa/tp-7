from sqlmodel import create_engine, SQLModel, Session
from sqlalchemy.pool import StaticPool

DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)


def create_db_and_tables():
    """Crea todas las tablas en la base de datos."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Proporciona una sesión de base de datos como dependencia."""
    with Session(engine) as session:
        yield session