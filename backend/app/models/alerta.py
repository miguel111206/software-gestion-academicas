from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Alerta(Base):
    __tablename__ = "alertas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    estudiante_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False, index=True)
    profesor_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False, index=True)
    mensaje: Mapped[str] = mapped_column(Text, nullable=False)
    riesgo: Mapped[str] = mapped_column(String(20), nullable=False)
    fecha: Mapped[date] = mapped_column(Date, nullable=False)

    estudiante = relationship("Usuario", foreign_keys=[estudiante_id], back_populates="alertas_recibidas")
    profesor = relationship("Usuario", foreign_keys=[profesor_id], back_populates="alertas_enviadas")
