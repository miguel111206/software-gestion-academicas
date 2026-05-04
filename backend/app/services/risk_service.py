from app.models.registro import Registro
from app.services.prediction_service import calcular_tendencia, predecir_campo
from app.utils.constants import (
    NOTA_MINIMA_APROBACION,
    PRODUCTIVIDAD_RIESGO_ALTO,
    PRODUCTIVIDAD_RIESGO_MEDIO,
)


def clasificar_riesgo(registros: list[Registro]) -> str:
    if not registros:
        return "medio"
    nota_promedio = sum(item.nota for item in registros) / len(registros)
    productividad_promedio = sum(item.productividad for item in registros) / len(registros)
    prediccion_nota = predecir_campo(registros, "nota")
    tendencia = calcular_tendencia(registros)

    if (
        nota_promedio < NOTA_MINIMA_APROBACION
        or productividad_promedio < PRODUCTIVIDAD_RIESGO_ALTO
        or (prediccion_nota is not None and prediccion_nota < NOTA_MINIMA_APROBACION)
    ):
        return "alto"
    if productividad_promedio < PRODUCTIVIDAD_RIESGO_MEDIO or tendencia == "descendente":
        return "medio"
    return "bajo"
