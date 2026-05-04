USE gestionrendimiento;

-- Password de ejemplo para todos: cambiar123
-- Estos hashes se pueden reemplazar creando usuarios desde el frontend.
INSERT INTO usuarios (nombre, correo, password, rol, semestre)
VALUES
('Profesor Demo', 'profesor@demo.com', '$2b$12$6lYkRKwLNHrBoH6hR2wyZuoNcPgJfiXVYpfn3reIq9qYoW3zqYtIu', 'profesor', NULL),
('Estudiante Demo', 'estudiante@demo.com', '$2b$12$6lYkRKwLNHrBoH6hR2wyZuoNcPgJfiXVYpfn3reIq9qYoW3zqYtIu', 'estudiante', 4);

INSERT INTO registros (estudiante_id, horas_estudio, horas_sueno, tareas, nota, productividad, fecha)
VALUES
(2, 2.0, 6.5, 2, 3.1, 55.38, '2026-04-20'),
(2, 3.5, 7.0, 3, 3.4, 68.12, '2026-04-22'),
(2, 4.0, 8.0, 4, 3.9, 82.83, '2026-04-24'),
(2, 2.5, 5.5, 1, 2.8, 50.04, '2026-04-26'),
(2, 5.0, 7.5, 5, 4.2, 91.38, '2026-04-28');
