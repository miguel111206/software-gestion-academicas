import React, { useMemo, useState } from 'react';
import { Activity, BookOpen, Moon, NotebookTabs } from 'lucide-react';

const initialState = {
  horas_estudio: 2,
  horas_sueno: 8,
  tareas: 1,
  nota: 3.5,
  fecha: new Date().toISOString().slice(0, 10),
};

function calculateProductivity(form) {
  const suenoBalanceado = Math.max(0, 1 - Math.abs(Number(form.horas_sueno) - 8) / 8);
  const estudioScore = Math.min(Number(form.horas_estudio) / 6, 1.2);
  const tareasScore = Math.min(Number(form.tareas) / 5, 1);
  const notaScore = Number(form.nota) / 5;
  return Math.max(0, Math.min((estudioScore * 35) + (suenoBalanceado * 20) + (tareasScore * 20) + (notaScore * 25), 100));
}

export default function HabitSimulator() {
  const [form, setForm] = useState(initialState);
  const productividad = useMemo(() => calculateProductivity(form), [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="panel habit-panel">
      <div>
        <p className="eyebrow">Simulador</p>
        <h3>Actualiza el rendimiento</h3>
      </div>
      <div className="habit-score">
        <Activity size={24} />
        <span>Rendimiento estimado</span>
        <strong>{productividad.toFixed(1)}</strong>
      </div>
      <div className="form-grid">
        <label>
          Horas de estudio
          <input name="horas_estudio" type="number" min="0" max="24" step="0.5" value={form.horas_estudio} onChange={handleChange} />
        </label>
        <label>
          Horas de sueno
          <input name="horas_sueno" type="number" min="0" max="24" step="0.5" value={form.horas_sueno} onChange={handleChange} />
        </label>
        <label>
          Tareas
          <input name="tareas" type="number" min="0" value={form.tareas} onChange={handleChange} />
        </label>
        <label>
          Nota de referencia
          <input name="nota" type="number" min="0" max="5" step="0.1" value={form.nota} onChange={handleChange} />
        </label>
        <label>
          Fecha
          <input name="fecha" type="date" value={form.fecha} onChange={handleChange} />
        </label>
      </div>
      <div className="habit-breakdown">
        <span><BookOpen size={16} /> Estudio: hasta 35 puntos</span>
        <span><Moon size={16} /> Sueno balanceado: hasta 20 puntos</span>
        <span><NotebookTabs size={16} /> Tareas: hasta 20 puntos</span>
      </div>
    </div>
  );
}
