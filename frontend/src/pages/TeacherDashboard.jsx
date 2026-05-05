import React, { useEffect, useMemo, useState } from 'react';
import { Send } from 'lucide-react';
import AppShell from '../components/layout/AppShell.jsx';
import MetricCard from '../components/ui/MetricCard.jsx';
import ProductivityChart from '../components/charts/ProductivityChart.jsx';
import {
  analisisEstudiante,
  dashboardProfesor,
  estudiantesResumen,
  registrosEstudiante,
} from '../api/registros.api.js';
import { crearAlerta } from '../api/alertas.api.js';

export default function TeacherDashboard() {
  const [dashboard, setDashboard] = useState({});
  const [estudiantes, setEstudiantes] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [analisis, setAnalisis] = useState(null);
  const [materiaActiva, setMateriaActiva] = useState('');
  const [mensaje, setMensaje] = useState('');

  const loadBase = async () => {
    const [dashRes, estudiantesRes] = await Promise.all([dashboardProfesor(), estudiantesResumen()]);
    setDashboard(dashRes.data);
    setEstudiantes(estudiantesRes.data);
  };

  useEffect(() => {
    loadBase();
  }, []);

  const seleccionar = async (estudiante) => {
    setSeleccionado(estudiante);
    setMateriaActiva('');
    const [registrosRes, analisisRes] = await Promise.all([
      registrosEstudiante(estudiante.id),
      analisisEstudiante(estudiante.id),
    ]);
    setRegistros(registrosRes.data);
    setAnalisis(analisisRes.data);
  };

  const enviarAlerta = async (event) => {
    event.preventDefault();
    if (!seleccionado || !mensaje.trim()) return;
    await crearAlerta({
      estudiante_id: seleccionado.id,
      mensaje: `[${materiaSeleccionada || 'Materia sin filtro'}] ${mensaje}`,
      riesgo: riesgoMateria,
    });
    setMensaje('');
  };

  const materias = useMemo(() => {
    const names = registros.map((item) => item.materia || 'Calculo integral');
    return [...new Set(names)].sort((a, b) => a.localeCompare(b));
  }, [registros]);

  const materiaSeleccionada = materiaActiva || materias[0] || '';
  const registrosMateria = useMemo(
    () => registros.filter((item) => (item.materia || 'Calculo integral') === materiaSeleccionada),
    [materiaSeleccionada, registros],
  );

  const riesgoMateria = useMemo(() => {
    if (!registrosMateria.length) return 'medio';
    const notaPromedio = registrosMateria.reduce((total, item) => total + Number(item.nota || 0), 0) / registrosMateria.length;
    const productividadPromedio = registrosMateria.reduce((total, item) => total + Number(item.productividad || 0), 0) / registrosMateria.length;
    const ordenados = [...registrosMateria].sort((a, b) => a.fecha.localeCompare(b.fecha));
    const tendenciaBaja = ordenados.length > 1 && Number(ordenados.at(-1).productividad || 0) < Number(ordenados[0].productividad || 0);

    if (notaPromedio < 3 || productividadPromedio < 45) return 'alto';
    if (productividadPromedio < 65 || tendenciaBaja) return 'medio';
    return 'bajo';
  }, [registrosMateria]);

  const resumenMateria = useMemo(() => {
    if (!registrosMateria.length) {
      return { nota: 0, productividad: 0, registros: 0 };
    }
    const nota = registrosMateria.reduce((total, item) => total + Number(item.nota || 0), 0) / registrosMateria.length;
    const productividad = registrosMateria.reduce((total, item) => total + Number(item.productividad || 0), 0) / registrosMateria.length;
    return {
      nota: nota.toFixed(2),
      productividad: productividad.toFixed(1),
      registros: registrosMateria.length,
    };
  }, [registrosMateria]);

  return (
    <AppShell title="Dashboard profesor">
      <section className="metrics-grid">
        <MetricCard label="Estudiantes" value={dashboard.total_estudiantes ?? 0} />
        <MetricCard label="Registros" value={dashboard.total_registros ?? 0} />
        <MetricCard label="En riesgo" value={dashboard.estudiantes_en_riesgo ?? 0} />
        <MetricCard label="Nota general" value={dashboard.nota_promedio_general ?? 0} />
      </section>
      <section className="two-columns">
        <div className="panel">
          <div className="section-heading compact-heading">
            <h3>Estudiantes</h3>
          </div>
          <div className="list">
            {estudiantes.map((estudiante) => (
              <button key={estudiante.id} className={`student-row ${seleccionado?.id === estudiante.id ? 'selected' : ''}`} onClick={() => seleccionar(estudiante)} type="button">
                <span>
                  <strong>{estudiante.nombre}</strong>
                  <small>{estudiante.correo}</small>
                </span>
                <b className={`badge risk-${estudiante.riesgo}`}>{estudiante.riesgo}</b>
              </button>
            ))}
          </div>
        </div>
        <div className="stack">
          {seleccionado && (
            <section className="panel form-grid">
              <div>
                <p className="eyebrow">Filtro academico</p>
                <h3>{seleccionado.nombre}</h3>
              </div>
              <div className="form-row">
                <label>
                  Materia
                  <select value={materiaSeleccionada} onChange={(event) => setMateriaActiva(event.target.value)}>
                    {materias.map((materia) => (
                      <option key={materia} value={materia}>{materia}</option>
                    ))}
                    {materias.length === 0 && <option>Sin materias registradas</option>}
                  </select>
                </label>
                <div className={`subject-risk risk-${riesgoMateria}`}>
                  <span>Riesgo en materia</span>
                  <strong>{riesgoMateria}</strong>
                </div>
              </div>
              <div className="teacher-subject-metrics">
                <span>Nota materia: <b>{resumenMateria.nota}</b></span>
                <span>Productividad: <b>{resumenMateria.productividad}</b></span>
                <span>Registros: <b>{resumenMateria.registros}</b></span>
              </div>
            </section>
          )}
          <ProductivityChart data={seleccionado ? registrosMateria : []} />
          {seleccionado && (
            <form className="panel form-grid" onSubmit={enviarAlerta}>
              <h3>Alerta para {seleccionado.nombre} en {materiaSeleccionada || 'la materia'}</h3>
              <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Escribe una recomendacion academica" />
              <button className="primary-button" type="submit">
                <Send size={18} />
                Enviar alerta
              </button>
            </form>
          )}
        </div>
      </section>
    </AppShell>
  );
}
