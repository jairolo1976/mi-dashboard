// src/pages/AlumnosPage.jsx
import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Filter, Download, Edit, Trash2 } from 'lucide-react';
import { getAlumnos, createAlumno, updateAlumno, deleteAlumno } from '../services/endpoints';
import ModalNuevoAlumno from '../components/ModalNuevoAlumno';
import * as XLSX from 'xlsx';

const AlumnosPage = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todas');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [alumnoToEdit, setAlumnoToEdit] = useState(null);

  // Cargar alumnos al montar el componente
  useEffect(() => {
    fetchAlumnos();
  }, []);

  const fetchAlumnos = async () => {
    try {
      setLoading(true);
      const data = await getAlumnos();
      setAlumnos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los alumnos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlumno = async (formData) => {
    try {
      await createAlumno(formData);
      fetchAlumnos(); // Recargar la lista
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error al crear alumno:', err);
      throw err;
    }
  };

  const handleEditAlumno = async (id, formData) => {
    try {
      await updateAlumno(id, formData);
      fetchAlumnos(); // Recargar la lista
      setShowEditModal(false);
      setAlumnoToEdit(null);
    } catch (err) {
      console.error('Error al actualizar alumno:', err);
      throw err;
    }
  };

  const handleDeleteAlumno = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este alumno?')) {
      try {
        await deleteAlumno(id);
        fetchAlumnos(); // Recargar la lista
      } catch (err) {
        console.error('Error al eliminar alumno:', err);
      }
    }
  };

  const openEditModal = (alumno) => {
    setAlumnoToEdit(alumno);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setAlumnoToEdit(null);
  };

  // Obtener categorías únicas
  const categorias = ['todas', ...new Set(alumnos.map(a => a.categoria))];

  // Filtrar alumnos
  const filteredAlumnos = alumnos.filter(alumno => {
    const matchesSearch = 
      alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.telefono?.includes(searchTerm);

    const matchesCategoria = 
      filterCategoria === 'todas' || alumno.categoria === filterCategoria;

    return matchesSearch && matchesCategoria;
  });

  // Función de exportación a Excel con TODOS los datos
  const exportToExcel = () => {
    const dataToExport = alumnos.map(alumno => ({
      ID: alumno.id,
      Nombre: alumno.nombre,
      Apellido: alumno.apellido || '',
      Edad: alumno.edad,
      Categoría: alumno.categoria,
      Teléfono: alumno.telefono || '',
      Email: alumno.email || '',
      Dirección: alumno.direccion || '',
      Colegio: alumno.colegio || '',
      'Talla Camiseta': alumno.tallaCamiseta || '',
      'Talla Pantalón': alumno.tallaPantalon || '',
      'Grupo Sanguíneo': alumno.grupoSanguineo || '',
      Alergias: alumno.alergias || '',
      Enfermedades: alumno.enfermedades || '',
      Medicamentos: alumno.medicamentos || '',
      'Seguro Médico': alumno.seguroMedico || '',
      'Número Seguro': alumno.numeroSeguro || '',
      'Nombre Tutor': alumno.nombreTutor || '',
      'Apellido Tutor': alumno.apellidoTutor || '',
      'Teléfono Tutor': alumno.telefonoTutor || '',
      'Email Tutor': alumno.emailTutor || '',
      'Relación Tutor': alumno.relacionTutor || '',
      'Nombre Tutor 2': alumno.nombreTutor2 || '',
      'Apellido Tutor 2': alumno.apellidoTutor2 || '',
      'Teléfono Tutor 2': alumno.telefonoTutor2 || '',
      'Email Tutor 2': alumno.emailTutor2 || '',
      'Relación Tutor 2': alumno.relacionTutor2 || '',
      Observaciones: alumno.observaciones || '',
      'Fecha Registro': new Date(alumno.createdAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Alumnos");
    XLSX.writeFile(wb, `alumnos_completo_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Estadísticas
  const stats = {
    total: alumnos.length,
    benjamin: alumnos.filter(a => a.categoria === 'Benjamín').length,
    alevin: alumnos.filter(a => a.categoria === 'Alevín').length,
    infantil: alumnos.filter(a => a.categoria === 'Infantil').length,
    cadete: alumnos.filter(a => a.categoria === 'Cadete').length,
    juvenil: alumnos.filter(a => a.categoria === 'Juvenil').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumnos</h1>
        <p className="text-gray-600">Gestiona la información de los alumnos del centro</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Benjamín</p>
          <p className="text-2xl font-bold text-blue-600">{stats.benjamin}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Alevín</p>
          <p className="text-2xl font-bold text-green-600">{stats.alevin}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Infantil</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.infantil}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Cadete</p>
          <p className="text-2xl font-bold text-purple-600">{stats.cadete}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Juvenil</p>
          <p className="text-2xl font-bold text-red-600">{stats.juvenil}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <UserPlus className="h-5 w-5" />
                Nuevo Alumno
              </button>

              <button 
                onClick={() => exportToExcel()}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tel. Tutor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alergias
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAlumnos.map((alumno) => (
                <tr key={alumno.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {alumno.foto ? (
                        <img 
                          src={alumno.foto} 
                          alt={`Foto de ${alumno.nombre}`}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="text-gray-500 text-sm">
                            {alumno.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {alumno.nombre} {alumno.apellido || ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{alumno.edad} años</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${alumno.categoria === 'Benjamín' ? 'bg-blue-100 text-blue-800' : ''}
                      ${alumno.categoria === 'Alevín' ? 'bg-green-100 text-green-800' : ''}
                      ${alumno.categoria === 'Infantil' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${alumno.categoria === 'Cadete' ? 'bg-purple-100 text-purple-800' : ''}
                      ${alumno.categoria === 'Juvenil' ? 'bg-red-100 text-red-800' : ''}
                      ${alumno.categoria === 'Senior' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {alumno.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{alumno.telefono || '-'}</div>
                    <div className="text-sm text-gray-500">{alumno.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alumno.nombreTutor || 'Sin tutor'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alumno.telefonoTutor || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {alumno.alergias || 'Ninguna'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(alumno)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar alumno"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAlumno(alumno.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar alumno"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAlumnos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron alumnos que coincidan con los criterios de búsqueda
            </div>
          )}
        </div>
      </div>

      {/* Modal de creación */}
      <ModalNuevoAlumno 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateAlumno}
      />

      {/* Modal de edición */}
      <ModalNuevoAlumno 
        isOpen={showEditModal}
        onClose={closeEditModal}
        onSave={handleEditAlumno}
        alumnoToEdit={alumnoToEdit}
      />
    </div>
  );
};

export default AlumnosPage;