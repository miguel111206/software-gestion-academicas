import numpy as np
from sklearn.linear_model import LinearRegression

from app.models.registro import Registro


def predecir_campo(registros: list[Registro], campo: str) -> float | None:
    ordenados = sorted(registros, key=lambda item: item.fecha)
    if len(ordenados) < 2:
        return None
    x = np.arange(len(ordenados)).reshape(-1, 1)
    y = np.array([getattr(registro, campo) for registro in ordenados], dtype=float)
    model = LinearRegression()
    model.fit(x, y)
    prediccion = model.predict(np.array([[len(ordenados)]]))[0]
    return round(float(prediccion), 2)


def calcular_tendencia(registros: list[Registro]) -> str:
    ordenados = sorted(registros, key=lambda item: item.fecha)
    if len(ordenados) < 2:
        return "estable"
    x = np.arange(len(ordenados)).reshape(-1, 1)
    y = np.array([registro.productividad for registro in ordenados], dtype=float)
    model = LinearRegression()
    model.fit(x, y)
    pendiente = float(model.coef_[0])
    if pendiente > 1:
        return "ascendente"
    if pendiente < -1:
        return "descendente"
    return "estable"
