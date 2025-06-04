import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

/**
 * Componente EvolucionLineal
 * Muestra la evolución del rendimiento a lo largo del tiempo
 * @param {Array} datos - Array con datos de evolución [{mes, nota}]
 * @param {String} titulo - Título del gráfico
 * @param {String} tipo - 'linea' o 'area'
 */
export default function EvolucionLineal({ 
  datos, 
  titulo = "Evolución del Rendimiento",
  tipo = 'linea'
}) {
  // Asegurar que los datos tengan el formato correcto
  const datosFormateados = datos.map(item => ({
    ...item,
    nota: parseFloat(item.nota) || 0
  }));

  // Calcular min y max para el dominio Y
  const valores = datosFormateados.map(d => d.nota);
  const minValor = Math.min(...valores) - 0.5;
  const maxValor = Math.max(...valores) + 0.5;

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-sm">
            Nota: <span className="font-bold text-blue-600">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Determinar color según el valor
  const obtenerColor = (valor) => {
    if (valor >= 8) return '#10B981'; // Verde
    if (valor >= 6) return '#F59E0B'; // Amarillo
    return '#EF4444'; // Rojo
  };

  // Componente común para ambos tipos
  const ComponenteGrafico = tipo === 'area' ? AreaChart : LineChart;
  const ComponenteLinea = tipo === 'area' ? Area : Line;

  return (
    <div className="w-full h-full">
      <h3 className="text-center text-lg font-semibold mb-4 text-gray-800">
        {titulo}
      </h3>
      
      <ResponsiveContainer width="100%" height={250}>
        <ComponenteGrafico 
          data={datosFormateados}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb"
            vertical={false}
          />
          
          <XAxis 
            dataKey="mes" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          
          <YAxis
            domain={[Math.floor(minValor), Math.ceil(maxValor)]}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            label={{ 
              value: 'Calificación', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: 12, fill: '#6b7280' }
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <ComponenteLinea
            type="monotone"
            dataKey="nota"
            stroke="#3B82F6"
            strokeWidth={3}
            fill="#3B82F6"
            fillOpacity={tipo === 'area' ? 0.2 : 0}
            dot={{ r: 5, fill: '#3B82F6' }}
            activeDot={{ r: 7 }}
          />
          
          {/* Línea de referencia - Promedio */}
          <Line
            type="monotone"
            dataKey={() => 7.5}
            stroke="#9CA3AF"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
            name="Objetivo"
          />
        </ComponenteGrafico>
      </ResponsiveContainer>
      
      {/* Resumen de tendencia */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Tendencia:</span>
          <TendenciaIndicador datos={datosFormateados} />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-600">Última evaluación:</span>
          <span className="text-sm font-bold" style={{ 
            color: obtenerColor(datosFormateados[datosFormateados.length - 1]?.nota || 0)
          }}>
            {datosFormateados[datosFormateados.length - 1]?.nota || 0}/10
          </span>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para mostrar la tendencia
function TendenciaIndicador({ datos }) {
  if (datos.length < 2) return <span className="text-sm text-gray-500">Sin datos suficientes</span>;
  
  const ultimos = datos.slice(-3);
  const promedioPrimeros = ultimos.slice(0, -1).reduce((acc, d) => acc + d.nota, 0) / (ultimos.length - 1);
  const ultimo = ultimos[ultimos.length - 1].nota;
  
  if (ultimo > promedioPrimeros + 0.2) {
    return (
      <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
        Mejorando ↗️
      </span>
    );
  } else if (ultimo < promedioPrimeros - 0.2) {
    return (
      <span className="text-sm font-semibold text-red-600 flex items-center gap-1">
        Bajando ↘️
      </span>
    );
  } else {
    return (
      <span className="text-sm font-semibold text-yellow-600 flex items-center gap-1">
        Estable →
      </span>
    );
  }
}