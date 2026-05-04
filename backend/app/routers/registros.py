from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.registro import Registro
from app.models.user import Usuario
from app.routers.deps import require_estudiante
from app.schemas.registro import RegistroCreate, RegistroRead
from app.services.math_service import calcular_productividad

router = APIRouter(prefix="/registros", tags=["registros"])


@router.post("", response_model=RegistroRead)
def crear_registro(
    payload: RegistroCreate,
    estudiante: Usuario = Depends(require_estudiante),
    db: Session = Depends(get_db),
):
    registro = Registro(
        estudiante_id=estudiante.id,
        horas_estudio=payload.horas_estudio,
        horas_sueno=payload.horas_sueno,
        tareas=payload.tareas,
        nota=payload.nota,
        fecha=payload.fecha,
        productividad=calcular_productividad(
            payload.horas_estudio,
            payload.horas_sueno,
            payload.tareas,
            payload.nota,
        ),
    )
    db.add(registro)
    db.commit()
    db.refresh(registro)
    return registro


@router.get("/mis-registros", response_model=list[RegistroRead])
def mis_registros(
    estudiante: Usuario = Depends(require_estudiante),
    db: Session = Depends(get_db),
):
    return (
        db.query(Registro)
        .filter(Registro.estudiante_id == estudiante.id)
        .order_by(Registro.fecha.asc())
        .all()
    )
