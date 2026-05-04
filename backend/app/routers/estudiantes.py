from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.registro import Registro
from app.models.user import RolUsuario, Usuario
from app.routers.deps import require_profesor
from app.schemas.estudiante import EstudianteResumen
from app.schemas.registro import AnalisisRead, RegistroRead
from app.services.risk_service import clasificar_riesgo
from app.services.stats_service import construir_analisis

router = APIRouter(prefix="/estudiantes", tags=["estudiantes"])


@router.get("", response_model=list[EstudianteResumen])
def listar_estudiantes(_: Usuario = Depends(require_profesor), db: Session = Depends(get_db)):
    estudiantes = db.query(Usuario).filter(Usuario.rol == RolUsuario.estudiante).all()
    resumenes: list[EstudianteResumen] = []
    for estudiante in estudiantes:
        registros = db.query(Registro).filter(Registro.estudiante_id == estudiante.id).all()
        nota_promedio = sum(item.nota for item in registros) / len(registros) if registros else 0.0
        productividad_promedio = (
            sum(item.productividad for item in registros) / len(registros) if registros else 0.0
        )
        resumenes.append(
            EstudianteResumen(
                id=estudiante.id,
                nombre=estudiante.nombre,
                correo=estudiante.correo,
                semestre=estudiante.semestre,
                nota_promedio=round(nota_promedio, 2),
                productividad_promedio=round(productividad_promedio, 2),
                riesgo=clasificar_riesgo(registros),
            )
        )
    return resumenes


@router.get("/{estudiante_id}/registros", response_model=list[RegistroRead])
def registros_estudiante(
    estudiante_id: int,
    _: Usuario = Depends(require_profesor),
    db: Session = Depends(get_db),
):
    return (
        db.query(Registro)
        .filter(Registro.estudiante_id == estudiante_id)
        .order_by(Registro.fecha.asc())
        .all()
    )


@router.get("/{estudiante_id}/analisis", response_model=AnalisisRead)
def analisis_estudiante(
    estudiante_id: int,
    _: Usuario = Depends(require_profesor),
    db: Session = Depends(get_db),
):
    estudiante = db.get(Usuario, estudiante_id)
    if estudiante is None or estudiante.rol != RolUsuario.estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    registros = (
        db.query(Registro)
        .filter(Registro.estudiante_id == estudiante_id)
        .order_by(Registro.fecha.asc())
        .all()
    )
    return construir_analisis(registros)
