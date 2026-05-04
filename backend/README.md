# Backend FastAPI

## Instalacion

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Edita `.env` con tu usuario y contrasena de MySQL.

## Ejecutar

```bash
uvicorn app.main:app --reload
```

La API queda disponible en `http://localhost:8000` y la documentacion Swagger en `http://localhost:8000/docs`.
