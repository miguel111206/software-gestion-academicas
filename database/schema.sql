CREATE DATABASE IF NOT EXISTS gestionrendimiento;
USE gestionrendimiento;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('estudiante', 'profesor') NOT NULL,
    semestre INT NULL
);

CREATE TABLE IF NOT EXISTS registros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id INT NOT NULL,
    horas_estudio FLOAT NOT NULL,
    horas_sueno FLOAT NOT NULL,
    tareas INT NOT NULL,
    nota FLOAT NOT NULL,
    productividad FLOAT NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (estudiante_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS alertas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id INT NOT NULL,
    profesor_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    riesgo VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (estudiante_id) REFERENCES usuarios(id),
    FOREIGN KEY (profesor_id) REFERENCES usuarios(id)
);
