// src/components/StaffList.jsx
import React, { useState, useEffect } from 'react';
import { getStaff } from '../services/endpoints';   // ajusta ruta si fuera necesario

const StaffList = () => {
  const [staff,   setStaff]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  /* -------------------------------------------------------------------------- */
  /*  Carga inicial                                                             */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await getStaff();
        setStaff(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar el staff.');
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*  Estados loading / error                                                   */
  /* -------------------------------------------------------------------------- */
  if (loading) return <div className="text-center p-8">Cargando staff…</div>;
  if (error)   return <div className="text-center p-8 text-red-600">{error}</div>;

  /* -------------------------------------------------------------------------- */
  /*  Render                                                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestión de Staff</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Listado de Miembros</h2>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-md">
            Añadir Nuevo Miembro
          </button>
        </div>

        {staff.length === 0 ? (
          <p className="text-gray-600">No hay miembros de staff registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Nombre Completo</Th>
                  <Th>Rol</Th>
                  <Th>Email</Th>
                  <Th>Teléfono</Th>
                  <Th>Licencias</Th>
                  <Th>Equipos Asignados</Th>
                  <Th>Acciones</Th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map(member => (
                  <tr key={member.id}>
                    <Td>{member.nombreCompleto}</Td>
                    <Td>{member.rol}</Td>
                    <Td>{member.email}</Td>
                    <Td>{member.telefono}</Td>
                    <Td>
                      {member.licencias?.length
                        ? member.licencias.map(l => l.nombre).join(', ')
                        : 'N/A'}
                    </Td>
                    <Td>
                      {member.equiposAsignados?.length
                        ? member.equiposAsignados.join(', ')
                        : 'Ninguno'}
                    </Td>
                    <Td className="text-right">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                      <button className="text-red-600 hover:text-red-900">Eliminar</button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */
const Th = ({ children }) => (
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
  >
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{children}</td>
);

export default StaffList;
