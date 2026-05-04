import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="center-screen">
      <h1>Pagina no encontrada</h1>
      <Link to="/login">Volver al inicio</Link>
    </main>
  );
}
