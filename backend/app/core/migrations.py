from sqlalchemy import inspect, text

from app.core.database import engine


def ensure_registros_grade_columns():
    inspector = inspect(engine)
    if "registros" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("registros")}
    statements = []

    if "porcentaje" not in columns:
        statements.append("ALTER TABLE registros ADD COLUMN porcentaje FLOAT NOT NULL DEFAULT 0")
    if "actividad" not in columns:
        statements.append("ALTER TABLE registros ADD COLUMN actividad VARCHAR(120) NOT NULL DEFAULT 'Nota'")
    if "es_futura" not in columns:
        statements.append("ALTER TABLE registros ADD COLUMN es_futura BOOLEAN NOT NULL DEFAULT FALSE")

    if not statements:
        return

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
