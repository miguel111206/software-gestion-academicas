import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';

const initialState = {
  materia: 'Calculo integral',
  actividad: 'Parcial 1',
  horas_estudio: 2,
  horas_sueno: 8,
  tareas: 1,
  nota: 3.5,
  porcentaje: 20,
  estado_nota: 'pasada',
  fecha: new Date().toISOString().slice(0, 10),
};

export default function RegistroForm({ materias = ['Calculo integral'], onCreateSubject, onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [creatingSubject, setCreatingSubject] = useState(false);
  const [newSubject, setNewSubject] = useState('');

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
      porcentaje: Number(form.porcentaje),
      es_futura: form.estado_nota === 'futura',
    });
    setForm(initialState);
  };

  const handleCreateSubject = () => {
    const clean = newSubject.trim();
    if (!clean) return;
    onCreateSubject?.(clean);
    setForm((current) => ({ ...current, materia: clean }));
    setNewSubject('');
    setCreatingSubject(false);
  };

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Notas de la materia</p>
        <h3>Nuevo registro</h3>
      </div>
      <div className="field-group">
        <span>Materia</span>
        <div className="subject-control">
          <select name="materia" value={form.materia} onChange={handleChange}>
            {materias.map((materia) => (
              <option key={materia} value={materia}>{materia}</option>
            ))}
          </select>
          <button className="icon-button" type="button" onClick={() => setCreatingSubject((current) => !current)} aria-label="Crear materia">
            {creatingSubject ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>
        {creatingSubject && (
          <div className="subject-create">
            <input value={newSubject} onChange={(event) => setNewSubject(event.target.value)} placeholder="Nombre de la materia" />
            <button className="primary-button" type="button" onClick={handleCreateSubject}>
              Crear
            </button>
          </div>
        )}
      </div>
      <label>
        Actividad
        <input name="actividad" type="text" maxLength="120" value={form.actividad} onChange={handleChange} placeholder="Parcial, quiz, taller..." />
      </label>
      <div className="form-row">
        <label>
          Nota obtenida o esperada
          <input name="nota" type="number" min="0" max="5" step="0.1" value={form.nota} onChange={handleChange} />
        </label>
        <label>
          Porcentaje
          <input name="porcentaje" type="number" min="0" max="100" step="1" value={form.porcentaje} onChange={handleChange} />
        </label>
      </div>
      <div className="field-group">
        <span>Estado de la nota</span>
        <div className="segmented-control">
          <label>
            <input name="estado_nota" type="radio" value="pasada" checked={form.estado_nota === 'pasada'} onChange={handleChange} />
            Nota pasada
          </label>
          <label>
            <input name="estado_nota" type="radio" value="futura" checked={form.estado_nota === 'futura'} onChange={handleChange} />
            Nota futura
          </label>
        </div>
      </div>
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
