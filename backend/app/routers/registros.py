from fastapi import APIRouter, Depends, HTTPException, status
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
        porcentaje=payload.porcentaje,
        actividad=payload.actividad.strip() or "Nota",
        materia=payload.materia.strip() or "Calculo integral",
        es_futura=payload.es_futura,
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


@router.put("/{registro_id}", response_model=RegistroRead)
def actualizar_registro(
    registro_id: int,
    payload: RegistroCreate,
    estudiante: Usuario = Depends(require_estudiante),
    db: Session = Depends(get_db),
):
    registro = (
        db.query(Registro)
        .filter(Registro.id == registro_id, Registro.estudiante_id == estudiante.id)
        .first()
    )
    if registro is None:
        raise HTTPException(status_code=404, detail="Registro no encontrado")

    registro.horas_estudio = payload.horas_estudio
    registro.horas_sueno = payload.horas_sueno
    registro.tareas = payload.tareas
    registro.nota = payload.nota
    registro.porcentaje = payload.porcentaje
    registro.actividad = payload.actividad.strip() or "Nota"
    registro.materia = payload.materia.strip() or "Calculo integral"
    registro.es_futura = payload.es_futura
    registro.fecha = payload.fecha
    registro.productividad = calcular_productividad(
        payload.horas_estudio,
        payload.horas_sueno,
        payload.tareas,
        payload.nota,
    )
    db.commit()
    db.refresh(registro)
    return registro


@router.delete("/{registro_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_registro(
    registro_id: int,
    estudiante: Usuario = Depends(require_estudiante),
    db: Session = Depends(get_db),
):
    registro = (
        db.query(Registro)
        .filter(Registro.id == registro_id, Registro.estudiante_id == estudiante.id)
        .first()
    )
    if registro is None:
        raise HTTPException(status_code=404, detail="Registro no encontrado")

    db.delete(registro)
    db.commit()
