import api from './axios.js';

export const crearRegistro = (data) => api.post('/registros', data);
export const actualizarRegistro = (id, data) => api.put(`/registros/${id}`, data);
export const eliminarRegistro = (id) => api.delete(`/registros/${id}`);
export const misRegistros = () => api.get('/registros/mis-registros');
export const miAnalisis = () => api.get('/analisis/mi-rendimiento');
export const estudiantesResumen = () => api.get('/estudiantes');
export const dashboardProfesor = () => api.get('/profesores/dashboard');
export const registrosEstudiante = (id) => api.get(`/estudiantes/${id}/registros`);
export const analisisEstudiante = (id) => api.get(`/estudiantes/${id}/analisis`);
