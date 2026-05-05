import React from 'react';
import { FunctionSquare, Sigma, TrendingUp } from 'lucide-react';

const today = new Date().toISOString().slice(0, 10);

function getIntegralStats(registros) {
  const sorted = [...registros].filter((item) => !item.es_futura && item.fecha <= today).sort((a, b) => a.fecha.localeCompare(b.fecha));
  if (sorted.length === 0) {
    return { area: 0, promedio: 0, tramos: 0 };
  }
  if (sorted.length === 1) {
    return { area: Number(sorted[0].productividad || 0), promedio: Number(sorted[0].productividad || 0), tramos: 1 };
  }

  const start = new Date(`${sorted[0].fecha}T00:00:00`);
  let area = 0;
  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];
    const previousDay = (new Date(`${previous.fecha}T00:00:00`) - start) / 86400000;
    const currentDay = (new Date(`${current.fecha}T00:00:00`) - start) / 86400000;
    const width = Math.max(currentDay - previousDay, 1);
    area += ((Number(previous.productividad || 0) + Number(current.productividad || 0)) / 2) * width;
  }

  const days = Math.max((new Date(`${sorted.at(-1).fecha}T00:00:00`) - start) / 86400000, 1);
  return { area, promedio: area / days, tramos: sorted.length - 1 };
}

export default function IntegralSection({ registros, materia }) {
  const stats = getIntegralStats(registros);

  return (
    <section className="panel integral-panel">
      <div>
        <p className="eyebrow">Calculo integral aplicado</p>
        <h3>Rendimiento como area bajo la curva</h3>
      </div>
      <div className="integral-grid">
        <article>
          <Sigma size={22} />
          <span>Area acumulada</span>
          <strong>{stats.area.toFixed(2)}</strong>
        </article>
        <article>
          <FunctionSquare size={22} />
          <span>Promedio integral</span>
          <strong>{stats.promedio.toFixed(2)}</strong>
        </article>
        <article>
          <TrendingUp size={22} />
          <span>Tramos evaluados</span>
          <strong>{stats.tramos}</strong>
        </article>
      </div>
      <div className="integral-copy">
        <p>En {materia}, cada registro crea un punto de productividad p(t). La app une esos puntos y aproxima el area con trapecios.</p>
        <p>Las tareas suben la productividad porque cuentan como evidencia de practica: entre mas tareas completadas, mayor aporte tiene ese registro, hasta un maximo razonable.</p>
      </div>
    </section>
  );
}
