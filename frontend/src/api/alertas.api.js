import api from './axios.js';

export const crearAlerta = (data) => api.post('/alertas', data);
export const misAlertas = () => api.get('/alertas/mias');
