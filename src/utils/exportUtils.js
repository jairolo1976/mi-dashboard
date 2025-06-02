// src/utils/exportUtils.js
// Utilidades para exportar datos a Excel y PDF

export const exportToExcel = (data, filename = 'alumnos') => {
  // Crear el contenido CSV
  const headers = ['Nombre', 'Edad', 'Categoría', 'Teléfono', 'Email'];
  const csvContent = [
    headers.join(','),
    ...data.map(alumno => [
      alumno.nombre,
      alumno.edad,
      alumno.categoria,
      alumno.telefono || '',
      alumno.email || ''
    ].join(','))
  ].join('\n');

  // Crear blob y descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcelDetailed = (data, filename = 'alumnos_detallado') => {
  // Versión más detallada con todos los campos
  const headers = [
    'ID',
    'Nombre Completo',
    'Edad',
    'Fecha de Nacimiento',
    'Categoría',
    'Teléfono',
    'Email',
    'Dirección',
    'Grupo Sanguíneo',
    'Alergias',
    'Enfermedades',
    'Medicamentos',
    'Seguro Médico',
    'Nombre del Tutor',
    'Teléfono del Tutor',
    'Email del Tutor',
    'Estado'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(alumno => [
      alumno.id,
      `"${alumno.nombre || ''}"`,
      alumno.edad || '',
      alumno.fechaNacimiento || '',
      alumno.categoria || '',
      alumno.telefono || '',
      alumno.email || '',
      `"${alumno.direccion || ''}"`,
      alumno.grupoSanguineo || '',
      `"${alumno.alergias || ''}"`,
      `"${alumno.enfermedades || ''}"`,
      `"${alumno.medicamentos || ''}"`,
      alumno.seguroMedico || '',
      `"${alumno.nombreTutor || ''}"`,
      alumno.telefonoTutor || '',
      alumno.emailTutor || '',
      alumno.activo ? 'Activo' : 'Inactivo'
    ].join(','))
  ].join('\n');

  // Crear blob y descargar
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Función para generar reporte de cumpleaños del mes
export const generateBirthdayReport = (alumnos) => {
  const currentMonth = new Date().getMonth();
  const birthdayAlumnos = alumnos.filter(alumno => {
    if (alumno.fechaNacimiento) {
      const birthMonth = new Date(alumno.fechaNacimiento).getMonth();
      return birthMonth === currentMonth;
    }
    return false;
  });

  if (birthdayAlumnos.length === 0) {
    alert('No hay cumpleaños este mes');
    return;
  }

  const headers = ['Nombre', 'Fecha de Nacimiento', 'Edad', 'Categoría', 'Teléfono'];
  const csvContent = [
    `Cumpleaños del mes de ${new Date().toLocaleString('es-ES', { month: 'long' })}`,
    '',
    headers.join(','),
    ...birthdayAlumnos.map(alumno => [
      alumno.nombre,
      new Date(alumno.fechaNacimiento).toLocaleDateString('es-ES'),
      alumno.edad,
      alumno.categoria,
      alumno.telefono || ''
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `cumpleaños_${new Date().toISOString().split('T')[0]}.csv`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
