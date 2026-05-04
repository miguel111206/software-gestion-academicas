from datetime import date

import numpy as np

from app.models.registro import Registro


def calcular_productividad(horas_estudio: float, horas_sueno: float, tareas: int, nota: float) -> float:
    sueno_balanceado = max(0.0, 1 - abs(horas_sueno - 8) / 8)
    estudio_score = min(horas_estudio / 6, 1.2)
    tareas_score = min(tareas / 5, 1.0)
    nota_score = nota / 5
    productividad = (estudio_score * 35) + (sueno_balanceado * 20) + (tareas_score * 20) + (nota_score * 25)
    return round(max(0.0, min(productividad, 100.0)), 2)


def _dias_relativos(registros: list[Registro]) -> np.ndarray:
    if not registros:
        return np.array([])
    fechas: list[date] = [registro.fecha for registro in registros]
    inicio = min(fechas)
    return np.array([(fecha - inicio).days for fecha in fechas], dtype=float)


def rendimiento_acumulado(registros: list[Registro]) -> float:
    ordenados = sorted(registros, key=lambda item: item.fecha)
    if len(ordenados) == 0:
        return 0.0
    if len(ordenados) == 1:
        return round(ordenados[0].productividad, 2)
    x = _dias_relativos(ordenados)
    y = np.array([registro.productividad for registro in ordenados], dtype=float)
    return round(float(np.trapezoid(y, x)), 2)


def promedio_integral(registros: list[Registro]) -> float:
    ordenados = sorted(registros, key=lambda item: item.fecha)
    if len(ordenados) == 0:
        return 0.0
    if len(ordenados) == 1:
        return round(ordenados[0].productividad, 2)
    x = _dias_relativos(ordenados)
    intervalo = max(float(x[-1] - x[0]), 1.0)
    return round(rendimiento_acumulado(ordenados) / intervalo, 2)
