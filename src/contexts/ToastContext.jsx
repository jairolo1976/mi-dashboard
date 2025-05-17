import React, { createContext, useContext, useState, useCallback } from 'react';

// Contexto para gestionar notificaciones tipo toast
const ToastContext = createContext();

export function ToastProvider({ children }) {
  // Estado para almacenar los toasts activos
  const [toasts, setToasts] = useState([]);

  // Función para agregar un toast con duración personalizada
  const addToast = useCallback((msg, duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg }]);
    // Eliminar el toast pasado el tiempo
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Container de toasts en la esquina inferior derecha */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div
            key={t.id}
            role="alert"
            aria-live="assertive"
            className="bg-gray-800 text-white px-4 py-2 rounded shadow"
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Hook para acceder al contexto de toast
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
}
