import React, { useEffect, useState } from 'react';
import { LogOut, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AppShell({ title, children }) {
  const { usuario, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return (
    <div className="app-shell">
      <motion.aside className="sidebar" initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
        <div>
          <p className="eyebrow">Calculo integral</p>
          <h1>Sistema Academico Inteligente</h1>
        </div>
        <div className="user-box">
          <strong>{usuario?.nombre}</strong>
          <span>{usuario?.rol}</span>
        </div>
        <div className="sidebar-actions">
          <button className="ghost-button" onClick={toggleTheme} type="button">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          </button>
          <button className="ghost-button" onClick={logout} type="button">
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </motion.aside>
      <motion.main className="content" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.08 }}>
        <header className="page-header">
          <h2>{title}</h2>
        </header>
        {children}
      </motion.main>
    </div>
  );
}
