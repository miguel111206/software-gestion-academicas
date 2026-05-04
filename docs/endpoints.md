# Endpoints

Base URL:

```text
http://localhost:8000/api
```

## Autenticacion

- `POST /auth/register`: crea usuario estudiante o profesor.
- `POST /auth/login`: devuelve JWT.
- `GET /auth/me`: devuelve usuario autenticado.

## Estudiante

- `POST /registros`: crea registro academico.
- `GET /registros/mis-registros`: lista registros propios.
- `GET /analisis/mi-rendimiento`: calcula rendimiento, promedio integral, prediccion y riesgo.
- `GET /alertas/mias`: lista alertas recibidas.

## Profesor

- `GET /profesores/dashboard`: estadisticas generales.
- `GET /estudiantes`: resumen de estudiantes.
- `GET /estudiantes/{id}/registros`: registros de un estudiante.
- `GET /estudiantes/{id}/analisis`: analisis de un estudiante.
- `POST /alertas`: crea alerta o recomendacion para un estudiante.
