import api from './apiClient';

// ========== ALUMNOS ==========
export const getAlumnos     = () => api.get('/alumnos').then(r => r.data);
export const createAlumno   = (data) => api.post('/alumnos', data).then(r => r.data);
export const updateAlumno   = (id, data) => api.patch(`/alumnos/${id}`, data).then(r => r.data);
export const deleteAlumno   = (id) => api.delete(`/alumnos/${id}`).then(r => r.data);

// ========== EVENTOS ==========
export const getEventos     = () => api.get('/eventos').then(r => r.data);
export const createEvento   = (data) => api.post('/eventos', data).then(r => r.data);

// ========== CASILLEROS ==========
export const getCasilleros  = () => api.get('/casilleros').then(r => r.data);
export const createCasillero = (data) => api.post('/casilleros', data).then(r => r.data);

// ========== MENSAJES ==========
export const getMensajes    = () => api.get('/mensajes').then(r => r.data);
export const createMensaje  = (data) => api.post('/mensajes', data).then(r => r.data);

// ========== STAFF ==========
export const getStaff       = () => api.get('/staff').then(r => r.data);
export const createStaff    = (data) => api.post('/staff', data).then(r => r.data);

// ========== ALERTAS ==========
export const getAlertas     = () => api.get('/alertas').then(r => r.data);
export const createAlerta   = (data) => api.post('/alertas', data).then(r => r.data);
export const updateAlerta   = (id, data) => api.patch(`/alertas/${id}`, data).then(r => r.data);
export const deleteAlerta   = (id) => api.delete(`/alertas/${id}`).then(r => r.data);

// ========== DASHBOARD ==========
export const getDashboard   = () => api.get('/resumen-dashboard').then(r => r.data);