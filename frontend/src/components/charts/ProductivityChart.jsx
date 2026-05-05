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
  return (
    <div className="panel chart-panel">
      <div>
        <p className="eyebrow">Rendimiento historico</p>
        <h3>Productividad en el tiempo</h3>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="productividad" name="Productividad" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        <span><b className="dot dot-blue" />Productividad</span>
      </div>
    </div>
  );
}
