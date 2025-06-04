import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend
} from 'recharts';

/**
 * Componente RadarHabilidades
 * Muestra un gráfico radar con las habilidades del jugador
 * @param {Object} datos - Valores de las habilidades
 * @param {String} titulo - Título del gráfico
 */
export default function RadarHabilidades({ datos, titulo = "Perfil de Habilidades" }) {
  // Convertir los datos del semáforo a valores numéricos
  const convertirSemaforoAValor = (color) => {
    switch(color) {
      case 'verde': return 85;
      case 'amarillo': return 60;
      case 'rojo': return 35;
      default: return 50;
    }
  };

  // Preparar datos para el gráfico
  const datosGrafico = [
    {
      habilidad: 'Físico',
      valor: convertirSemaforoAValor(datos.fisico),
      valorMax: 100
    },
    {
      habilidad: 'Técnico',
      valor: convertirSemaforoAValor(datos.tecnico),
      valorMax: 100
    },
    {
      habilidad: 'Táctico',
      valor: convertirSemaforoAValor(datos.tactico),
      valorMax: 100
    },
    {
      habilidad: 'Mental',
      valor: convertirSemaforoAValor(datos.actitudinal),
      valorMax: 100
    }
  ];

  // Si se proporcionan valores numéricos directos
  if (datos.valores) {
    datosGrafico.forEach((item, index) => {
      if (datos.valores[index] !== undefined) {
        item.valor = datos.valores[index];
      }
    });
  }

  // Colores personalizados según el nivel
  const obtenerColor = (valor) => {
    if (valor >= 80) return '#10B981'; // Verde
    if (valor >= 60) return '#F59E0B'; // Amarillo
    return '#EF4444'; // Rojo
  };

  return (
    <div className="w-full h-full">
      <h3 className="text-center text-lg font-semibold mb-4 text-gray-800">
        {titulo}
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={datosGrafico}>
          <PolarGrid 
            gridType="polygon"
            stroke="#e5e7eb"
            strokeWidth={1}
          />
          
          <PolarAngleAxis 
            dataKey="habilidad"
            tick={{ fontSize: 12 }}
            className="text-gray-700"
          />
          
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickCount={5}
          />
          
          <Radar
            name="Nivel Actual"
            dataKey="valor"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="#3B82F6"
            fillOpacity={0.3}
            dot={{ r: 4, fill: '#3B82F6' }}
          />
          
          {/* Área de referencia (promedio) */}
          <Radar
            name="Promedio Categoría"
            dataKey="valorMax"
            stroke="#E5E7EB"
            strokeWidth={1}
            fill="none"
            strokeDasharray="5 5"
            dot={false}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Leyenda personalizada */}
      <div className="flex justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">Jugador</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-gray-300 rounded-full"></div>
          <span className="text-gray-600">Promedio</span>
        </div>
      </div>
      
      {/* Indicadores de nivel */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {datosGrafico.map((item) => (
          <div key={item.habilidad} className="text-center">
            <div className="text-xs text-gray-500">{item.habilidad}</div>
            <div 
              className="text-sm font-bold"
              style={{ color: obtenerColor(item.valor) }}
            >
              {item.valor}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}