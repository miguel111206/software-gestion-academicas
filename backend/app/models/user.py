import enum

from sqlalchemy import Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class RolUsuario(str, enum.Enum):
    estudiante = "estudiante"
    profesor = "profesor"


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    correo: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    rol: Mapped[RolUsuario] = mapped_column(Enum(RolUsuario), nullable=False)
    semestre: Mapped[int | None] = mapped_column(Integer, nullable=True)

    registros = relationship("Registro", back_populates="estudiante", cascade="all, delete-orphan")
    alertas_recibidas = relationship(
        "Alerta",
        foreign_keys="Alerta.estudiante_id",
        back_populates="estudiante",
        cascade="all, delete-orphan",
    )
    alertas_enviadas = relationship(
        "Alerta",
        foreign_keys="Alerta.profesor_id",
        back_populates="profesor",
    )
