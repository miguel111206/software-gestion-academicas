import React, { useEffect, useMemo, useState } from 'react';
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
  const [error, setError] = useState('');
  const [materias, setMaterias] = useState(() => {
    const saved = localStorage.getItem('materias');
    return saved ? JSON.parse(saved) : ['Calculo integral'];
  });
  const [materiaActiva, setMateriaActiva] = useState(() => localStorage.getItem('materiaActiva') || 'Calculo integral');

  const loadData = async () => {
    try {
      setError('');
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
    } catch (err) {
      const detail = err.response?.data?.detail || 'No se pudo cargar la informacion. Verifica que el backend este activo.';
      setError(detail);
    }
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
    setMateriaActiva(clean);
    localStorage.setItem('materiaActiva', clean);
  };

  const handleSubjectChange = (materia) => {
    setMateriaActiva(materia);
    localStorage.setItem('materiaActiva', materia);
  };

  const materiaSeleccionada = materias.includes(materiaActiva) ? materiaActiva : materias[0] || 'Calculo integral';
  const registrosMateria = useMemo(
    () => registros.filter((item) => (item.materia || 'Calculo integral') === materiaSeleccionada),
    [materiaSeleccionada, registros],
  );
  const analisisMateria = useMemo(() => {
    const notasPasadas = registrosMateria.filter((item) => !item.es_futura && item.fecha <= new Date().toISOString().slice(0, 10));
    const peso = notasPasadas.reduce((total, item) => total + Number(item.porcentaje || 0), 0);
    const acumulado = notasPasadas.reduce((total, item) => total + Number(item.nota || 0) * (Number(item.porcentaje || 0) / 100), 0);
    const promedio = peso > 0 ? (acumulado / peso) * 100 : 0;

    return {
      acumulado: acumulado.toFixed(2),
      promedio: promedio.toFixed(2),
      porcentaje: `${peso}%`,
      registros: registrosMateria.length,
    };
  }, [registrosMateria]);

  return (
    <AppShell title="Dashboard estudiante">
      {error && <section className="error-banner">{error}</section>}
      <section className="metrics-grid">
        <MetricCard label="Llevas en la materia" value={analisisMateria.acumulado} />
        <MetricCard label="Promedio segun evaluado" value={analisisMateria.promedio} />
        <MetricCard label="Porcentaje evaluado" value={analisisMateria.porcentaje} />
        <MetricCard label="Registros de materia" value={analisisMateria.registros} />
      </section>
      <section className="two-columns">
        <RegistroForm materias={materias} materiaActiva={materiaSeleccionada} onMateriaChange={handleSubjectChange} onCreateSubject={handleCreateSubject} onSubmit={handleCreate} />
        <ProductivityChart data={registrosMateria} />
      </section>
      <GradesSummary registros={registrosMateria} materias={materias} materiaActiva={materiaSeleccionada} onMateriaChange={handleSubjectChange} />
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
