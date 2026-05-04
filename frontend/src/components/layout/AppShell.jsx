import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AppShell({ title, children }) {
  const { usuario, logout } = useAuth();
  return (
    <div className="app-shell">
      <aside className="sidebar">
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
      </aside>
      <main className="content">
        <header className="page-header">
          <h2>{title}</h2>
        </header>
        {children}
      </main>
    </div>
  );
}
