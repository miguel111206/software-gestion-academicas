# Modelo Predictivo

El sistema implementa prediccion basica con regresion lineal usando Scikit-learn.

## Entradas

- Secuencia historica de registros academicos.
- Nota por registro.
- Productividad calculada por registro.

## Salidas

- Prediccion de la siguiente nota.
- Prediccion de la siguiente productividad.
- Tendencia: `ascendente`, `estable` o `descendente`.
- Riesgo academico: `bajo`, `medio` o `alto`.

## Clasificacion de riesgo

El riesgo combina:

- nota promedio,
- productividad promedio,
- tendencia,
- prediccion de nota.

No usa redes neuronales ni IA avanzada; la intencion es mantener el modelo explicable y adecuado para un proyecto academico.
