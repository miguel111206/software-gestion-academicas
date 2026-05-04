import React, { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell.jsx';
import MetricCard from '../components/ui/MetricCard.jsx';
import RegistroForm from '../components/forms/RegistroForm.jsx';
import ProductivityChart from '../components/charts/ProductivityChart.jsx';
import { crearRegistro, miAnalisis, misRegistros } from '../api/registros.api.js';
import { misAlertas } from '../api/alertas.api.js';

export default function StudentDashboard() {
  const [registros, setRegistros] = useState([]);
  const [analisis, setAnalisis] = useState(null);
  const [alertas, setAlertas] = useState([]);

  const loadData = async () => {
    const [registrosRes, analisisRes, alertasRes] = await Promise.all([
      misRegistros(),
      miAnalisis(),
      misAlertas(),
    ]);
    setRegistros(registrosRes.data);
    setAnalisis(analisisRes.data);
    setAlertas(alertasRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (payload) => {
    await crearRegistro(payload);
    await loadData();
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
        <RegistroForm onSubmit={handleCreate} />
        <ProductivityChart data={registros} />
      </section>
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
