import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, meRequest, registerRequest } from '../api/auth.api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    meRequest()
      .then(({ data }) => setUsuario(data))
      .catch((error) => {
        console.warn('No se pudo restaurar la sesion guardada:', error.response?.data?.detail || error.message);
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      usuario,
      loading,
      async login(payload) {
        const { data } = await loginRequest(payload);
        localStorage.setItem('token', data.access_token);
        setUsuario(data.usuario);
        return data.usuario;
      },
      async register(payload) {
        return registerRequest(payload);
      },
      logout() {
        localStorage.removeItem('token');
        setUsuario(null);
      },
    }),
    [usuario, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
