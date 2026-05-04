import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, rol }) {
  const { usuario, loading } = useAuth();
  if (loading) return <main className="center-screen">Cargando...</main>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (rol && usuario.rol !== rol) return <Navigate to={`/${usuario.rol}`} replace />;
  return children;
}
