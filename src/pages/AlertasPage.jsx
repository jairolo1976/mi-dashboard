// src/pages/AlertasPage.jsx
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { getAlertas, createAlerta, updateAlerta, deleteAlerta } from '../services/endpoints';

const AlertasPage = () => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAlerta, setEditingAlerta] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'info',
    activo: true
  });

  const tiposAlerta = [
    { value: 'info', label: 'Información', color: 'bg-blue-100 text-blue-800' },
    { value: 'warning', label: 'Advertencia', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'error', label: 'Error', color: 'bg-red-100 text-red-800' },
    { value: 'success', label: 'Éxito', color: 'bg-green-100 text-green-800' }
  ];

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    try {
      setLoading(true);
      const data = await getAlertas();
      setAlertas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las alertas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }

    try {
      if (editingAlerta) {
        await updateAlerta(editingAlerta.id, formData);
      } else {
        await createAlerta(formData);
      }
      
      fetchAlertas();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error('Error al guardar alerta:', err);
      alert('Error al guardar la alerta');
    }
  };

  const handleEdit = (alerta) => {
    setEditingAlerta(alerta);
    setFormData({
      titulo: alerta.titulo,
      descripcion: alerta.descripcion || '',
      tipo: alerta.tipo,
      activo: alerta.activo
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta alerta?')) {
      try {
        await deleteAlerta(id);
        fetchAlertas();
      } catch (err) {
        console.error('Error al eliminar alerta:', err);
        alert('Error al eliminar la alerta');
      }
    }
  };

  const toggleActive = async (alerta) => {
    try {
      await updateAlerta(alerta.id, { ...alerta, activo: !alerta.activo });
      fetchAlertas();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al cambiar el estado de la alerta');
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      tipo: 'info',
      activo: true
    });
    setEditingAlerta(null);
  };

  const filteredAlertas = alertas.filter(alerta =>
    alerta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alerta.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTipoColor = (tipo) => {
    const tipoInfo = tiposAlerta.find(t => t.value === tipo);
    return tipoInfo ? tipoInfo.color : 'bg-gray-100 text-gray-800';
  };

  const getTipoLabel = (tipo) => {
    const tipoInfo = tiposAlerta.find(t => t.value === tipo);
    return tipoInfo ? tipoInfo.label : tipo;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Alertas</h1>
        <p className="text-gray-600">Administra las alertas importantes del sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Alertas</p>
          <p className="text-2xl font-bold text-gray-900">{alertas.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Activas</p>
          <p className="text-2xl font-bold text-green-600">
            {alertas.filter(a => a.activo).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Inactivas</p>
          <p className="text-2xl font-bold text-gray-600">
            {alertas.filter(a => !a.activo).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Críticas</p>
          <p className="text-2xl font-bold text-red-600">
            {alertas.filter(a => a.tipo === 'error' && a.activo).length}
          </p>
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
                  placeholder="Buscar alertas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nueva Alerta
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alerta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAlertas.map((alerta) => (
                <tr key={alerta.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        {alerta.titulo}
                      </div>
                      {alerta.descripcion && (
                        <div className="text-sm text-gray-500 mt-1">
                          {alerta.descripcion}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoColor(alerta.tipo)}`}>
                      {getTipoLabel(alerta.tipo)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      alerta.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {alerta.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(alerta.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(alerta)}
                        className={`${alerta.activo ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'}`}
                        title={alerta.activo ? 'Desactivar' : 'Activar'}
                      >
                        {alerta.activo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(alerta)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(alerta.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAlertas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron alertas
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingAlerta ? 'Editar Alerta' : 'Nueva Alerta'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción opcional de la alerta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {tiposAlerta.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="activo" className="text-sm font-medium">
                  Alerta activa
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingAlerta ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertasPage;