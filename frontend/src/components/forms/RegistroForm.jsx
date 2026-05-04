import { useState } from 'react';
import { Save } from 'lucide-react';

const initialState = {
  horas_estudio: 2,
  horas_sueno: 8,
  tareas: 1,
  nota: 3.5,
  fecha: new Date().toISOString().slice(0, 10),
};

export default function RegistroForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      ...form,
      horas_estudio: Number(form.horas_estudio),
      horas_sueno: Number(form.horas_sueno),
      tareas: Number(form.tareas),
      nota: Number(form.nota),
    });
    setForm(initialState);
  };

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <h3>Nuevo registro</h3>
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
        Nota
        <input name="nota" type="number" min="0" max="5" step="0.1" value={form.nota} onChange={handleChange} />
      </label>
      <label>
        Fecha
        <input name="fecha" type="date" value={form.fecha} onChange={handleChange} />
      </label>
      <button className="primary-button" type="submit">
        <Save size={18} />
        Guardar
      </button>
    </form>
  );
}
