import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({ correo: '', password: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const usuario = await login(form);
      navigate(`/${usuario.rol}`);
    } catch (error) {
      const detail = error.response?.data?.detail || 'Correo o contrasena incorrectos';
      console.warn('No se pudo iniciar sesion:', detail);
      setError(detail);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Rendimiento academico</p>
        <h1>Iniciar sesion</h1>
        <label>
          Correo
          <input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required />
        </label>
        <label>
          Contrasena
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="primary-button" type="submit">
          <LogIn size={18} />
          Entrar
        </button>
        <Link to="/registro">Crear cuenta</Link>
      </form>
    </main>
  );
}
