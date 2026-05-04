from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.registro import Registro
from app.models.user import Usuario
from app.routers.deps import require_estudiante
from app.schemas.registro import AnalisisRead
from app.services.stats_service import construir_analisis

router = APIRouter(prefix="/analisis", tags=["analisis"])


@router.get("/mi-rendimiento", response_model=AnalisisRead)
def mi_rendimiento(
    estudiante: Usuario = Depends(require_estudiante),
    db: Session = Depends(get_db),
):
    registros = (
        db.query(Registro)
        .filter(Registro.estudiante_id == estudiante.id)
        .order_by(Registro.fecha.asc())
        .all()
    )
    return construir_analisis(registros)
