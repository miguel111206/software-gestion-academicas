from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.registro import Registro
from app.models.user import RolUsuario, Usuario
from app.routers.deps import require_profesor
from app.services.risk_service import clasificar_riesgo

router = APIRouter(prefix="/profesores", tags=["profesores"])


@router.get("/dashboard")
def dashboard_profesor(_: Usuario = Depends(require_profesor), db: Session = Depends(get_db)):
    estudiantes = db.query(Usuario).filter(Usuario.rol == RolUsuario.estudiante).all()
    registros = db.query(Registro).all()
    en_riesgo = 0
    for estudiante in estudiantes:
        historico = [registro for registro in registros if registro.estudiante_id == estudiante.id]
        if clasificar_riesgo(historico) in {"medio", "alto"}:
            en_riesgo += 1
    return {
        "total_estudiantes": len(estudiantes),
        "total_registros": len(registros),
        "estudiantes_en_riesgo": en_riesgo,
        "nota_promedio_general": round(sum(item.nota for item in registros) / len(registros), 2)
        if registros
        else 0.0,
    }
