import logging
import sys

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import Base, engine
from app.core.migrations import ensure_registros_grade_columns
from app.models import Alerta, Registro, Usuario
from app.routers import alertas, analisis, auth, estudiantes, profesores, registros

settings = get_settings()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)

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
    logger.info("Inicializando base de datos")
    Base.metadata.create_all(bind=engine)
    ensure_registros_grade_columns()
    logger.info("Base de datos lista")


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Error no controlado en %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Error interno del servidor"},
    )


@app.get("/api/health")
def health():
    return {"status": "ok", "app": settings.app_name}


app.include_router(auth.router, prefix="/api")
app.include_router(registros.router, prefix="/api")
app.include_router(analisis.router, prefix="/api")
app.include_router(estudiantes.router, prefix="/api")
app.include_router(profesores.router, prefix="/api")
app.include_router(alertas.router, prefix="/api")
