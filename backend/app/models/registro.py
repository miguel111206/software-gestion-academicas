from datetime import date

from sqlalchemy import Boolean, Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Registro(Base):
    __tablename__ = "registros"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    estudiante_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False, index=True)
    horas_estudio: Mapped[float] = mapped_column(Float, nullable=False)
    horas_sueno: Mapped[float] = mapped_column(Float, nullable=False)
    tareas: Mapped[int] = mapped_column(Integer, nullable=False)
    nota: Mapped[float] = mapped_column(Float, nullable=False)
    porcentaje: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    actividad: Mapped[str] = mapped_column(String(120), nullable=False, default="Nota")
    materia: Mapped[str] = mapped_column(String(120), nullable=False, default="Calculo integral")
    es_futura: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    productividad: Mapped[float] = mapped_column(Float, nullable=False)
    fecha: Mapped[date] = mapped_column(Date, nullable=False, index=True)

    estudiante = relationship("Usuario", back_populates="registros")
