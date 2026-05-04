from pydantic import BaseModel, EmailStr, Field

from app.models.user import RolUsuario


class UsuarioCreate(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    correo: EmailStr
    password: str = Field(min_length=6, max_length=72)
    rol: RolUsuario
    semestre: int | None = Field(default=None, ge=1, le=12)


class UsuarioRead(BaseModel):
    id: int
    nombre: str
    correo: EmailStr
    rol: RolUsuario
    semestre: int | None

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    correo: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioRead
