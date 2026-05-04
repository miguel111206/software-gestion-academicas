import React from 'react';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AppShell({ title, children }) {
  const { usuario, logout } = useAuth();
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
        <button className="ghost-button" onClick={logout} type="button">
          <LogOut size={18} />
          Salir
        </button>
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
