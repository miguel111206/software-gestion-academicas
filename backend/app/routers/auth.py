from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import RolUsuario, Usuario
from app.routers.deps import get_current_user
from app.schemas.auth import LoginRequest, Token, UsuarioCreate, UsuarioRead

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED)
def register(payload: UsuarioCreate, db: Session = Depends(get_db)):
    existe = db.query(Usuario).filter(Usuario.correo == payload.correo).first()
    if existe:
        raise HTTPException(status_code=400, detail="El correo ya esta registrado")
    if payload.rol == RolUsuario.profesor and payload.semestre is not None:
        payload.semestre = None
    usuario = Usuario(
        nombre=payload.nombre,
        correo=payload.correo,
        password=get_password_hash(payload.password),
        rol=payload.rol,
        semestre=payload.semestre,
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.correo == payload.correo).first()
    if usuario is None or not verify_password(payload.password, usuario.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales invalidas")
    return Token(access_token=create_access_token(usuario.id), usuario=usuario)


@router.get("/me", response_model=UsuarioRead)
def me(usuario: Usuario = Depends(get_current_user)):
    return usuario
