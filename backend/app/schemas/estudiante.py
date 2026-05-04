from pydantic import BaseModel, EmailStr


class EstudianteResumen(BaseModel):
    id: int
    nombre: str
    correo: EmailStr
    semestre: int | None
    nota_promedio: float
    productividad_promedio: float
    riesgo: str
