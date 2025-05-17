import { useState } from "react";

const casillerosIniciales = Array(12).fill({ ocupado: false, nombre: "" });

export default function Casilleros() {
  const [casilleros, setCasilleros] = useState(casillerosIniciales);

  const asignarNombre = (index, nombre) => {
    setCasilleros((prev) =>
      prev.map((c, i) =>
        i === index ? { ocupado: !!nombre, nombre } : c
      )
    );
  };

  const liberarCasillero = (index) => {
    setCasilleros((prev) =>
      prev.map((c, i) => (i === index ? { ocupado: false, nombre: "" } : c))
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#1E2A38] mb-6">Casilleros</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {casilleros.map((casillero, index) => (
          <div
            key={index}
            className={`relative border rounded-xl p-4 shadow hover:shadow-md transition duration-200 ${
              casillero.ocupado ? "bg-red-100" : "bg-green-100"
            }`}
            title={casillero.ocupado ? "Casillero ocupado" : "Casillero disponible"}
          >
            <p className="text-lg font-bold mb-2">#{index + 1}</p>
            <p className="mb-2">{casillero.ocupado ? "Ocupado 🔒" : "Disponible 🔓"}</p>
            <input
              type="text"
              placeholder="Asignar nombre..."
              value={casillero.nombre}
              onChange={(e) => asignarNombre(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.target.blur();
              }}
              className="w-full p-2 border rounded mb-2"
            />
            {casillero.ocupado && (
              <button
                onClick={() => liberarCasillero(index)}
                className="text-sm text-red-600 hover:underline"
              >
                Liberar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
