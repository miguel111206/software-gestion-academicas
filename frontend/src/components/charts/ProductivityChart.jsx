import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function ProductivityChart({ data }) {
  const chartData = data.map((item) => ({
    ...item,
    estudio: Math.min((Number(item.horas_estudio) / 6) * 100, 120),
    sueno: Math.max(0, (1 - Math.abs(Number(item.horas_sueno) - 8) / 8) * 100),
    tareas: Math.min((Number(item.tareas) / 5) * 100, 100),
    nota_pct: (Number(item.nota) / 5) * 100,
  }));

  return (
    <div className="panel chart-panel">
      <div>
        <p className="eyebrow">Habitos academicos</p>
        <h3>Grafico de estudio, sueno y tareas</h3>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="productividad" stroke="#2563eb" strokeWidth={3} />
          <Line type="monotone" dataKey="estudio" name="Estudio" stroke="#0f766e" strokeWidth={2} />
          <Line type="monotone" dataKey="sueno" name="Sueno balanceado" stroke="#7c3aed" strokeWidth={2} />
          <Line type="monotone" dataKey="tareas" name="Tareas" stroke="#f97316" strokeWidth={2} />
          <Line type="monotone" dataKey="nota_pct" name="Nota" stroke="#16a34a" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        <span><b className="dot dot-blue" />Productividad</span>
        <span><b className="dot dot-teal" />Estudio</span>
        <span><b className="dot dot-purple" />Sueno</span>
        <span><b className="dot dot-orange" />Tareas</span>
      </div>
    </div>
  );
}
