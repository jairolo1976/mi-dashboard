import React from 'react';

/**
 * Componente SemaforoVisual
 * Muestra indicadores tipo semáforo para las evaluaciones
 * @param {Object} evaluacion - Objeto con valores: fisico, tecnico, tactico, actitudinal
 * @param {String} modo - 'simple' o 'detallado'
 */
export default function SemaforoVisual({ evaluacion, modo = 'simple' }) {
  // Mapeo de colores a valores y estilos
  const colorConfig = {
    verde: {
      bg: 'bg-green-500',
      text: 'text-green-600',
      label: 'Excelente',
      emoji: '🟢'
    },
    amarillo: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-600',
      label: 'En desarrollo',
      emoji: '🟡'
    },
    rojo: {
      bg: 'bg-red-500',
      text: 'text-red-600',
      label: 'Necesita mejora',
      emoji: '🔴'
    }
  };

  // Áreas a evaluar con sus iconos
  const areas = [
    { 
      key: 'fisico', 
      label: 'Físico',
      icon: '💪',
      descripcion: 'Velocidad, resistencia y potencia'
    },
    { 
      key: 'tecnico', 
      label: 'Técnico',
      icon: '⚽',
      descripcion: 'Habilidades con el balón'
    },
    { 
      key: 'tactico', 
      label: 'Táctico',
      icon: '🧠',
      descripcion: 'Visión de juego y posicionamiento'
    },
    { 
      key: 'actitudinal', 
      label: 'Actitudinal',
      icon: '❤️',
      descripcion: 'Disciplina y trabajo en equipo'
    }
  ];

  if (modo === 'simple') {
    // Vista simple: solo círculos de colores
    return (
      <div className="flex gap-4 justify-center items-center">
        {areas.map(area => {
          const valor = evaluacion[area.key] || 'amarillo';
          const config = colorConfig[valor];
          
          return (
            <div key={area.key} className="text-center">
              <div className="text-xs text-gray-600 mb-1">{area.label}</div>
              <div className={`w-8 h-8 rounded-full ${config.bg} shadow-md`} 
                   title={`${area.label}: ${config.label}`} />
            </div>
          );
        })}
      </div>
    );
  }

  // Vista detallada
  return (
    <div className="grid grid-cols-2 gap-4">
      {areas.map(area => {
        const valor = evaluacion[area.key] || 'amarillo';
        const config = colorConfig[valor];
        
        return (
          <div key={area.key} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              {/* Icono del área */}
              <div className="text-2xl">{area.icon}</div>
              
              {/* Información */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{area.label}</h4>
                <p className="text-xs text-gray-500">{area.descripcion}</p>
              </div>
              
              {/* Semáforo */}
              <div className="text-center">
                <div className={`w-10 h-10 rounded-full ${config.bg} shadow-md flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">
                    {valor.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={`text-xs mt-1 ${config.text} font-medium`}>
                  {config.label}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}