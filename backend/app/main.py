from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import Base, engine
from app.models import Alerta, Registro, Usuario
from app.routers import alertas, analisis, auth, estudiantes, profesores, registros

settings = get_settings()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def health():
    return {"status": "ok", "app": settings.app_name}


app.include_router(auth.router, prefix="/api")
app.include_router(registros.router, prefix="/api")
app.include_router(analisis.router, prefix="/api")
app.include_router(estudiantes.router, prefix="/api")
app.include_router(profesores.router, prefix="/api")
app.include_router(alertas.router, prefix="/api")
