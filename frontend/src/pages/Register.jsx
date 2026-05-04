import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'estudiante',
    semestre: 1,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register({
        ...form,
        semestre: form.rol === 'estudiante' ? Number(form.semestre) : null,
      });
      navigate('/login');
    } catch (requestError) {
      const detail = requestError.response?.data?.detail || 'No se pudo crear la cuenta';
      console.warn('No se pudo registrar usuario:', detail);
      setError(Array.isArray(detail) ? detail.map((item) => item.msg).join('. ') : detail);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Nueva cuenta</p>
        <h1>Registro</h1>
        <label>
          Nombre
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
        </label>
        <label>
          Correo
          <input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required />
        </label>
        <label>
          Contrasena
          <input type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <label>
          Rol
          <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
            <option value="estudiante">Estudiante</option>
            <option value="profesor">Profesor</option>
          </select>
        </label>
        {form.rol === 'estudiante' && (
          <label>
            Semestre
            <input type="number" min="1" max="12" value={form.semestre} onChange={(e) => setForm({ ...form, semestre: e.target.value })} />
          </label>
        )}
        <button className="primary-button" type="submit">
          <UserPlus size={18} />
          Crear cuenta
        </button>
        {error && <p className="error">{error}</p>}
        <Link to="/login">Ya tengo cuenta</Link>
      </form>
    </main>
  );
}
