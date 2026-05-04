from datetime import date

from pydantic import BaseModel, Field


class RegistroCreate(BaseModel):
    horas_estudio: float = Field(ge=0, le=24)
    horas_sueno: float = Field(ge=0, le=24)
    tareas: int = Field(ge=0)
    nota: float = Field(ge=0, le=5)
    fecha: date


class RegistroRead(RegistroCreate):
    id: int
    estudiante_id: int
    productividad: float

    model_config = {"from_attributes": True}


class AnalisisRead(BaseModel):
    rendimiento_acumulado: float
    promedio_integral: float
    productividad_promedio: float
    nota_promedio: float
    prediccion_nota: float | None
    prediccion_productividad: float | None
    tendencia: str
    riesgo: str
