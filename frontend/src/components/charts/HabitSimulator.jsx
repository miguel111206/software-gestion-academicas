import React, { useEffect, useMemo, useState } from 'react';
import { Activity, BookOpen, Moon, NotebookTabs, Save, Trash2 } from 'lucide-react';

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

function toForm(registro) {
  return {
    horas_estudio: registro?.horas_estudio ?? initialState.horas_estudio,
    horas_sueno: registro?.horas_sueno ?? initialState.horas_sueno,
    tareas: registro?.tareas ?? initialState.tareas,
    nota: registro?.nota ?? initialState.nota,
    fecha: registro?.fecha ?? initialState.fecha,
  };
}

export default function HabitSimulator({ registros = [], materia, onCreate, onUpdate, onDelete }) {
  const [form, setForm] = useState(initialState);
  const [selectedId, setSelectedId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const productividad = useMemo(() => calculateProductivity(form), [form]);

  const selectedRegistro = registros.find((item) => String(item.id) === String(selectedId));

  useEffect(() => {
    if (selectedRegistro) {
      setForm(toForm(selectedRegistro));
    }
  }, [selectedRegistro]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const payload = {
    materia,
    actividad: selectedRegistro?.actividad || 'Registro de habitos',
    porcentaje: selectedRegistro?.porcentaje || 0,
    es_futura: selectedRegistro?.es_futura || false,
    horas_estudio: Number(form.horas_estudio),
    horas_sueno: Number(form.horas_sueno),
    tareas: Number(form.tareas),
    nota: Number(form.nota),
    fecha: form.fecha,
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      if (selectedId) {
        await onUpdate?.(selectedId, payload);
      } else {
        await onCreate?.(payload);
      }
      setSelectedId('');
      setForm(initialState);
    } catch (err) {
      setError(err.response?.data?.detail || 'No se pudo guardar el registro.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setError('');
    setSaving(true);
    try {
      await onDelete?.(selectedId);
      setSelectedId('');
      setForm(initialState);
    } catch (err) {
      setError(err.response?.data?.detail || 'No se pudo eliminar el registro.');
    } finally {
      setSaving(false);
    }
  };

  const handleNew = () => {
    setSelectedId('');
    setForm(initialState);
    setError('');
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
      <label>
        Registro guardado
        <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
          <option value="">Nuevo registro</option>
          {registros.map((registro) => (
            <option key={registro.id} value={registro.id}>
              {registro.fecha} - {registro.actividad || 'Registro'} ({Number(registro.productividad || 0).toFixed(1)})
            </option>
          ))}
        </select>
      </label>
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
      <div className="habit-actions">
        <button className="primary-button" type="button" onClick={handleSave} disabled={saving}>
          <Save size={18} />
          {selectedId ? 'Actualizar' : 'Guardar'}
        </button>
        <button className="ghost-action" type="button" onClick={handleNew} disabled={saving}>
          Nuevo
        </button>
        <button className="danger-button" type="button" onClick={handleDelete} disabled={!selectedId || saving}>
          <Trash2 size={18} />
          Eliminar
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
