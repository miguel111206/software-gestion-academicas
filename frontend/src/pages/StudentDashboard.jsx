import React, { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell.jsx';
import MetricCard from '../components/ui/MetricCard.jsx';
import RegistroForm from '../components/forms/RegistroForm.jsx';
import ProductivityChart from '../components/charts/ProductivityChart.jsx';
import GradesSummary from '../components/grades/GradesSummary.jsx';
import { crearRegistro, miAnalisis, misRegistros } from '../api/registros.api.js';
import { misAlertas } from '../api/alertas.api.js';

export default function StudentDashboard() {
  const [registros, setRegistros] = useState([]);
  const [analisis, setAnalisis] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [materias, setMaterias] = useState(() => {
    const saved = localStorage.getItem('materias');
    return saved ? JSON.parse(saved) : ['Calculo integral'];
  });

  const loadData = async () => {
    const [registrosRes, analisisRes, alertasRes] = await Promise.all([
      misRegistros(),
      miAnalisis(),
      misAlertas(),
    ]);
    setRegistros(registrosRes.data);
    setAnalisis(analisisRes.data);
    setAlertas(alertasRes.data);
    setMaterias((current) => {
      const fromRegistros = registrosRes.data.map((item) => item.materia || 'Calculo integral');
      const merged = [...new Set([...current, ...fromRegistros])].sort((a, b) => a.localeCompare(b));
      localStorage.setItem('materias', JSON.stringify(merged));
      return merged;
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (payload) => {
    await crearRegistro(payload);
    await loadData();
  };

  const handleCreateSubject = (materia) => {
    const clean = materia.trim();
    if (!clean) return;
    setMaterias((current) => {
      const merged = [...new Set([...current, clean])].sort((a, b) => a.localeCompare(b));
      localStorage.setItem('materias', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AppShell title="Dashboard estudiante">
      <section className="metrics-grid">
        <MetricCard label="Rendimiento acumulado" value={analisis?.rendimiento_acumulado ?? 0} />
        <MetricCard label="Promedio integral" value={analisis?.promedio_integral ?? 0} />
        <MetricCard label="Prediccion nota" value={analisis?.prediccion_nota ?? 'Sin datos'} />
        <MetricCard label="Riesgo" value={analisis?.riesgo ?? 'medio'} />
      </section>
      <section className="two-columns">
        <RegistroForm materias={materias} onCreateSubject={handleCreateSubject} onSubmit={handleCreate} />
        <ProductivityChart data={registros} />
      </section>
      <GradesSummary registros={registros} materias={materias} />
      <section className="panel">
        <h3>Alertas y recomendaciones</h3>
        <div className="list">
          {alertas.map((alerta) => (
            <article key={alerta.id} className={`risk risk-${alerta.riesgo}`}>
              <strong>{alerta.riesgo}</strong>
              <span>{alerta.mensaje}</span>
            </article>
          ))}
          {alertas.length === 0 && <p>No tienes alertas pendientes.</p>}
        </div>
      </section>
    </AppShell>
  );
}
