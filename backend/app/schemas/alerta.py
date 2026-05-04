from datetime import date

from pydantic import BaseModel, Field


class AlertaCreate(BaseModel):
    estudiante_id: int
    mensaje: str = Field(min_length=5)
    riesgo: str = Field(pattern="^(bajo|medio|alto)$")


class AlertaRead(BaseModel):
    id: int
    estudiante_id: int
    profesor_id: int
    mensaje: str
    riesgo: str
    fecha: date

    model_config = {"from_attributes": True}
