<<<<<<< Updated upstream
function Dashboard() {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-4">Inicio</h2>
        <p className="text-gray-600 mb-6">Bienvenido al panel de CALYSM</p>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-6 border-t-4 border-blue-400">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Alumnos registrados</h3>
            <p className="text-3xl font-bold text-blue-500">35</p>
          </div>
  
          <div className="bg-white shadow rounded-xl p-6 border-t-4 border-green-400">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Eventos próximos</h3>
            <p className="text-3xl font-bold text-green-500">4</p>
          </div>
  
          <div className="bg-white shadow rounded-xl p-6 border-t-4 border-pink-400">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Mensajes nuevos</h3>
            <p className="text-3xl font-bold text-pink-500">2</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default Dashboard;
  
=======
import { useState, useEffect } from 'react';
import {
  getAlumnos,
  getCasilleros,
  getEventos,
  getMensajes,
  getStaff
} from '../services/endpoints';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log('🟡  Dashboard → comienza carga');
    const load = async () => {
      try {
        const [al, ca, ev, me, st] = await Promise.all([
          getAlumnos(),
          getCasilleros(),
          getEventos(),
          getMensajes(),
          getStaff()
        ]);
        // setters...
        console.log('✅ Datos cargados:', { al, ca, ev, me, st });
      } catch (e) {
        setError('Error al cargar datos');
        console.error('🔴  Dashboard error', e);
      } finally {
        setLoading(false);
        console.log('✅  Dashboard → termina carga');
      }
    };
    load();
  }, []);
  
  if (loading) return <p className="p-6">Cargando dashboard…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Contenido del dashboard aquí...</p>
    </div>
  );
}
>>>>>>> Stashed changes
