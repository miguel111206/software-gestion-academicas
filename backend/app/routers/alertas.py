from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.alerta import Alerta
from app.models.user import Usuario
from app.routers.deps import get_current_user, require_profesor
from app.schemas.alerta import AlertaCreate, AlertaRead

router = APIRouter(prefix="/alertas", tags=["alertas"])


@router.post("", response_model=AlertaRead)
def crear_alerta(
    payload: AlertaCreate,
    profesor: Usuario = Depends(require_profesor),
    db: Session = Depends(get_db),
):
    alerta = Alerta(
        estudiante_id=payload.estudiante_id,
        profesor_id=profesor.id,
        mensaje=payload.mensaje,
        riesgo=payload.riesgo,
        fecha=date.today(),
    )
    db.add(alerta)
    db.commit()
    db.refresh(alerta)
    return alerta


@router.get("/mias", response_model=list[AlertaRead])
def mis_alertas(usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Alerta)
        .filter(Alerta.estudiante_id == usuario.id)
        .order_by(Alerta.fecha.desc())
        .all()
    )
