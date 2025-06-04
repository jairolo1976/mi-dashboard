import React from 'react';
import ReporteMensual from './templates/ReporteMensual';
import ReportePartido from './templates/ReportePartido';
import ReporteAnual from './templates/ReporteAnual';

/**
 * Componente VistaPrevia
 * Renderiza la plantilla correcta según el tipo de reporte
 */
export default function VistaPrevia({ tipo, datos, modo }) {
  // Seleccionar la plantilla según el tipo
  const renderizarPlantilla = () => {
    switch(tipo) {
      case 'mensual':
        return <ReporteMensual datos={datos} modo={modo} />;
      case 'partido':
        return <ReportePartido datos={datos} modo={modo} />;
      case 'anual':
        return <ReporteAnual datos={datos} modo={modo} />;
      default:
        return (
          <div className="text-center p-8">
            <p className="text-gray-500">Selecciona un tipo de reporte</p>
          </div>
        );
    }
  };

  return (
    <div id="vista-previa-reporte" className="vista-previa-container">
      {renderizarPlantilla()}
    </div>
  );
}