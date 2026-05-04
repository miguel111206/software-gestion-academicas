# Arquitectura

El sistema usa una arquitectura cliente-servidor:

```text
React -> API REST FastAPI -> Servicios matematicos/predictivos -> MySQL
```

El frontend contiene las pantallas de estudiante y profesor. El backend concentra autenticacion, permisos, persistencia, calculos integrales y predicciones.

## Capas del backend

- `routers`: endpoints REST.
- `schemas`: validacion de entrada y salida con Pydantic.
- `models`: entidades SQLAlchemy.
- `services`: reglas de negocio, calculo integral, riesgo y regresion lineal.
- `core`: configuracion, seguridad y conexion a base de datos.
