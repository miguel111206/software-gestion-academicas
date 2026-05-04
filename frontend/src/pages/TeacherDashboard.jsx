import { useEffect, useState } from 'react';
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
      mensaje,
      riesgo: analisis?.riesgo || seleccionado.riesgo,
    });
    setMensaje('');
  };

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
          <h3>Estudiantes</h3>
          <div className="list">
            {estudiantes.map((estudiante) => (
              <button key={estudiante.id} className="student-row" onClick={() => seleccionar(estudiante)} type="button">
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
          <ProductivityChart data={registros} />
          {seleccionado && (
            <form className="panel form-grid" onSubmit={enviarAlerta}>
              <h3>Alerta para {seleccionado.nombre}</h3>
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
