// src/components/ModalNuevoAlumno.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ModalNuevoAlumno({ isOpen, onClose, onSave, alumnoToEdit = null }) {
  const [formData, setFormData] = useState({
    // Datos Personales
    nombre: '',
    apellido: '',
    edad: '',
    fechaNacimiento: '',
    categoria: '',
    telefono: '',
    email: '',
    direccion: '',
    colegio: '',
    tallaCamiseta: '',
    tallaPantalon: '',
    foto: '',
    // Información Médica
    grupoSanguineo: '',
    alergias: '',
    enfermedades: '',
    medicamentos: '',
    seguroMedico: '',
    numeroSeguro: '',
    // Datos del Tutor 1
    nombreTutor: '',
    apellidoTutor: '',
    telefonoTutor: '',
    emailTutor: '',
    relacionTutor: '',
    // Datos del Tutor 2
    nombreTutor2: '',
    apellidoTutor2: '',
    telefonoTutor2: '',
    emailTutor2: '',
    relacionTutor2: '',
    // Otros
    observaciones: ''
  });

  // Determinar si es modo edición
  const isEditMode = alumnoToEdit !== null;

  // Cargar datos del alumno cuando sea modo edición
  useEffect(() => {
    if (isEditMode && alumnoToEdit) {
      // Formatear fecha si existe
      const fechaFormateada = alumnoToEdit.fechaNacimiento 
        ? new Date(alumnoToEdit.fechaNacimiento).toISOString().split('T')[0]
        : '';

      setFormData({
        nombre: alumnoToEdit.nombre || '',
        apellido: alumnoToEdit.apellido || '',
        edad: alumnoToEdit.edad?.toString() || '',
        fechaNacimiento: fechaFormateada,
        categoria: alumnoToEdit.categoria || '',
        telefono: alumnoToEdit.telefono || '',
        email: alumnoToEdit.email || '',
        direccion: alumnoToEdit.direccion || '',
        colegio: alumnoToEdit.colegio || '',
        tallaCamiseta: alumnoToEdit.tallaCamiseta || '',
        tallaPantalon: alumnoToEdit.tallaPantalon || '',
        foto: alumnoToEdit.foto || '',
        grupoSanguineo: alumnoToEdit.grupoSanguineo || '',
        alergias: alumnoToEdit.alergias || '',
        enfermedades: alumnoToEdit.enfermedades || '',
        medicamentos: alumnoToEdit.medicamentos || '',
        seguroMedico: alumnoToEdit.seguroMedico || '',
        numeroSeguro: alumnoToEdit.numeroSeguro || '',
        nombreTutor: alumnoToEdit.nombreTutor || '',
        apellidoTutor: alumnoToEdit.apellidoTutor || '',
        telefonoTutor: alumnoToEdit.telefonoTutor || '',
        emailTutor: alumnoToEdit.emailTutor || '',
        relacionTutor: alumnoToEdit.relacionTutor || '',
        nombreTutor2: alumnoToEdit.nombreTutor2 || '',
        apellidoTutor2: alumnoToEdit.apellidoTutor2 || '',
        telefonoTutor2: alumnoToEdit.telefonoTutor2 || '',
        emailTutor2: alumnoToEdit.emailTutor2 || '',
        relacionTutor2: alumnoToEdit.relacionTutor2 || '',
        observaciones: alumnoToEdit.observaciones || ''
      });
    } else {
      // Resetear formulario para modo creación
      resetForm();
    }
  }, [isEditMode, alumnoToEdit]);

  const categorias = ['Prebenjamín', 'Benjamín', 'Alevín', 'Infantil', 'Cadete', 'Juvenil', 'Senior'];
  const gruposSanguineos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const relacionesTutor = ['Padre', 'Madre', 'Abuelo', 'Abuela', 'Tutor Legal', 'Otro'];
  const tallasCamiseta = ['6', '8', '10', '12', '14', '16', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const tallasPantalon = ['6', '8', '10', '12', '14', '16', '28', '30', '32', '34', '36', '38', '40', '42'];

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      edad: '',
      fechaNacimiento: '',
      categoria: '',
      telefono: '',
      email: '',
      direccion: '',
      colegio: '',
      tallaCamiseta: '',
      tallaPantalon: '',
      foto: '',
      grupoSanguineo: '',
      alergias: '',
      enfermedades: '',
      medicamentos: '',
      seguroMedico: '',
      numeroSeguro: '',
      nombreTutor: '',
      apellidoTutor: '',
      telefonoTutor: '',
      emailTutor: '',
      relacionTutor: '',
      nombreTutor2: '',
      apellidoTutor2: '',
      telefonoTutor2: '',
      emailTutor2: '',
      relacionTutor2: '',
      observaciones: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5242880) { // 5MB
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('La imagen debe ser menor a 5MB');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.edad || !formData.categoria) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        edad: parseInt(formData.edad)
      };

      if (isEditMode) {
        // Modo edición: pasar ID del alumno
        await onSave(alumnoToEdit.id, dataToSend);
      } else {
        // Modo creación
        await onSave(dataToSend);
      }
      
      // Resetear formulario solo si no es modo edición
      if (!isEditMode) {
        resetForm();
      }
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al ${isEditMode ? 'actualizar' : 'crear'} el alumno`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b bg-blue-600 text-white">
          <h2 className="text-2xl font-bold">
            {isEditMode ? 'Editar Alumno' : 'Nuevo Alumno'} - Formulario Completo
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Columna 1: Datos Personales */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b pb-2">📋 Datos Personales</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Edad *</label>
                      <input
                        type="number"
                        name="edad"
                        value={formData.edad}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="5"
                        max="50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Fecha Nac.</label>
                      <input
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Categoría *</label>
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Colegio</label>
                    <input
                      type="text"
                      name="colegio"
                      value={formData.colegio}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nombre del colegio"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="600123456"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="alumno@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Calle, número, ciudad"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Talla Camiseta</label>
                      <select
                        name="tallaCamiseta"
                        value={formData.tallaCamiseta}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar...</option>
                        {tallasCamiseta.map(talla => (
                          <option key={talla} value={talla}>{talla}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Talla Pantalón</label>
                      <select
                        name="tallaPantalon"
                        value={formData.tallaPantalon}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar...</option>
                        {tallasPantalon.map(talla => (
                          <option key={talla} value={talla}>{talla}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Foto del Alumno</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {formData.foto && (
                      <img src={formData.foto} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-lg" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Columna 2: Información Médica y Observaciones */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-600 border-b pb-2">🏥 Información Médica</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Grupo Sanguíneo</label>
                    <select
                      name="grupoSanguineo"
                      value={formData.grupoSanguineo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Seleccionar...</option>
                      {gruposSanguineos.map(grupo => (
                        <option key={grupo} value={grupo}>{grupo}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Alergias</label>
                    <textarea
                      name="alergias"
                      value={formData.alergias}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="Polen, frutos secos, medicamentos..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Enfermedades</label>
                    <textarea
                      name="enfermedades"
                      value={formData.enfermedades}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="Asma, diabetes, epilepsia..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Medicamentos</label>
                    <textarea
                      name="medicamentos"
                      value={formData.medicamentos}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="Ventolín, insulina..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Seguro Médico</label>
                    <input
                      type="text"
                      name="seguroMedico"
                      value={formData.seguroMedico}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="Adeslas, Sanitas, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Número de Seguro</label>
                    <input
                      type="text"
                      name="numeroSeguro"
                      value={formData.numeroSeguro}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="Número de póliza"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-purple-600 border-b pb-2">📝 Observaciones</h3>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Información adicional sobre el alumno..."
                />
              </div>
            </div>

            {/* Columna 3: Tutores */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600 border-b pb-2">👨‍👩‍👧 Tutor Principal</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del Tutor</label>
                    <input
                      type="text"
                      name="nombreTutor"
                      value={formData.nombreTutor}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Apellido del Tutor</label>
                    <input
                      type="text"
                      name="apellidoTutor"
                      value={formData.apellidoTutor}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono del Tutor</label>
                    <input
                      type="tel"
                      name="telefonoTutor"
                      value={formData.telefonoTutor}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="600123456"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email del Tutor</label>
                    <input
                      type="email"
                      name="emailTutor"
                      value={formData.emailTutor}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="tutor@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Relación</label>
                    <select
                      name="relacionTutor"
                      value={formData.relacionTutor}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Seleccionar...</option>
                      {relacionesTutor.map(rel => (
                        <option key={rel} value={rel}>{rel}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-orange-600 border-b pb-2">👥 Segundo Tutor (Opcional)</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del 2º Tutor</label>
                    <input
                      type="text"
                      name="nombreTutor2"
                      value={formData.nombreTutor2}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Apellido del 2º Tutor</label>
                    <input
                      type="text"
                      name="apellidoTutor2"
                      value={formData.apellidoTutor2}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono del 2º Tutor</label>
                    <input
                      type="tel"
                      name="telefonoTutor2"
                      value={formData.telefonoTutor2}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="600123456"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email del 2º Tutor</label>
                    <input
                      type="email"
                      name="emailTutor2"
                      value={formData.emailTutor2}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="tutor2@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Relación</label>
                    <select
                      name="relacionTutor2"
                      value={formData.relacionTutor2}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Seleccionar...</option>
                      {relacionesTutor.map(rel => (
                        <option key={rel} value={rel}>{rel}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              {isEditMode ? 'Actualizar Alumno' : 'Crear Alumno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}