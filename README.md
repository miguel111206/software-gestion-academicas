# Sistema Inteligente de Analisis y Prediccion del Rendimiento Academico

Proyecto final de Calculo 2. La plataforma permite registrar datos academicos, calcular rendimiento acumulado mediante integracion numerica y predecir tendencias basicas con regresion lineal.

## Tecnologias

- Frontend: React, Vite, Recharts, Framer Motion, Lucide.
- Backend: Python, FastAPI, SQLAlchemy, JWT.
- Base de datos: MySQL.
- Matematicas y prediccion: NumPy y Scikit-learn.

## Estructura

```text
backend/    API REST, modelos, servicios matematicos y prediccion
frontend/   Aplicacion React para estudiantes y profesores
database/   SQL de esquema y datos demo
docs/       Documentacion academica y tecnica
```

## Ejecucion rapida

### Con Docker

Requisitos:

- Docker Desktop o Docker Engine con Docker Compose.

Levantar todo el entorno:

```bash
docker compose up --build
```

Servicios disponibles:

- Frontend: http://localhost:5723
- Backend: http://localhost:8002
- Healthcheck API: http://localhost:8002/api/health
- MySQL: disponible solo dentro de Docker como `db:3306`

Credenciales demo:

- Profesor: profesor@demo.com
- Estudiante: estudiante@demo.com
- Password: cambiar123

Para detener los contenedores:

```bash
docker compose down
```

Para borrar tambien la base de datos local del contenedor y reiniciar los datos demo:

```bash
docker compose down -v
```

### Sin Docker

1. Crear base de datos:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p gestionrendimiento < database/seed.sql
```

2. Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

3. Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Funcionalidades

- Login y registro con roles.
- Dashboard de estudiante.
- Dashboard de profesor.
- Registro de horas de estudio, horas de sueno, tareas y notas.
- Calculo automatico de productividad.
- Rendimiento acumulado como area bajo la curva.
- Promedio integral.
- Prediccion basica con regresion lineal.
- Deteccion de riesgo academico.
- Alertas y recomendaciones del profesor.
