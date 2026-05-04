from app.models.registro import Registro
from app.schemas.registro import AnalisisRead
from app.services.math_service import promedio_integral, rendimiento_acumulado
from app.services.prediction_service import calcular_tendencia, predecir_campo
from app.services.risk_service import clasificar_riesgo


def construir_analisis(registros: list[Registro]) -> AnalisisRead:
    productividad_promedio = (
        sum(item.productividad for item in registros) / len(registros) if registros else 0.0
    )
    nota_promedio = sum(item.nota for item in registros) / len(registros) if registros else 0.0
    return AnalisisRead(
        rendimiento_acumulado=rendimiento_acumulado(registros),
        promedio_integral=promedio_integral(registros),
        productividad_promedio=round(productividad_promedio, 2),
        nota_promedio=round(nota_promedio, 2),
        prediccion_nota=predecir_campo(registros, "nota"),
        prediccion_productividad=predecir_campo(registros, "productividad"),
        tendencia=calcular_tendencia(registros),
        riesgo=clasificar_riesgo(registros),
    )
