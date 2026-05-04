import React from 'react';
import { CalendarClock, CheckCircle2 } from 'lucide-react';

const today = new Date().toISOString().slice(0, 10);

const toNumber = (value) => Number(value) || 0;

function getGradeStats(registros) {
  const past = registros.filter((item) => !item.es_futura && item.fecha <= today);
  const future = registros.filter((item) => item.es_futura || item.fecha > today);
  const pastWeight = past.reduce((total, item) => total + toNumber(item.porcentaje), 0);
  const futureWeight = future.reduce((total, item) => total + toNumber(item.porcentaje), 0);
  const earned = past.reduce((total, item) => total + toNumber(item.nota) * (toNumber(item.porcentaje) / 100), 0);
  const projected = [...past, ...future].reduce((total, item) => total + toNumber(item.nota) * (toNumber(item.porcentaje) / 100), 0);

  return {
    past,
    future,
    pastWeight,
    futureWeight,
    earned,
    projected,
    weightedAverage: pastWeight > 0 ? (earned / pastWeight) * 100 : 0,
  };
}

function GradeTable({ title, icon, items, emptyText }) {
  return (
    <div className="grade-list">
      <h4>{icon}{title}</h4>
      {items.length === 0 ? (
        <p className="muted">{emptyText}</p>
      ) : (
        <div className="grade-table">
          {items.map((item) => (
            <article key={item.id} className="grade-row">
              <span>
                <strong>{item.actividad || 'Nota'}</strong>
                <small>{item.fecha}</small>
              </span>
              <b>{Number(item.nota).toFixed(1)}</b>
              <em>{Number(item.porcentaje || 0)}%</em>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GradesSummary({ registros }) {
  const stats = getGradeStats(registros);

  return (
    <section className="panel grades-panel">
      <div className="grades-header">
        <div>
          <p className="eyebrow">Promedio ponderado</p>
          <h3>Notas de la materia</h3>
        </div>
        <strong>{stats.weightedAverage.toFixed(2)}</strong>
      </div>
      <div className="grade-progress">
        <span style={{ width: `${Math.min(stats.pastWeight, 100)}%` }} />
      </div>
      <div className="grade-stats">
        <span>Ya cuenta: <b>{stats.pastWeight}%</b></span>
        <span>Falta: <b>{Math.max(100 - stats.pastWeight, 0)}%</b></span>
        <span>Proyeccion: <b>{stats.projected.toFixed(2)}</b></span>
      </div>
      <div className="grades-columns">
        <GradeTable title="Notas registradas" icon={<CheckCircle2 size={18} />} items={stats.past} emptyText="Aun no hay notas que ya hayan pasado." />
        <GradeTable title="Notas futuras" icon={<CalendarClock size={18} />} items={stats.future} emptyText="Aun no hay notas futuras registradas." />
      </div>
    </section>
  );
}
