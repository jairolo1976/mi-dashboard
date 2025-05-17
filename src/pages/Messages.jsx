// src/pages/Messages.jsx
import React, { useState, useEffect } from 'react';

/**
 * Página de Mensajes
 * Muestra un listado de mensajes obtenidos desde la API.
 */
export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await fetch('http://localhost:3000/messages');
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadMessages();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Mensajes</h1>
        <p className="text-gray-500">Cargando mensajes…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Mensajes</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error al cargar mensajes: {error}
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Mensajes</h1>
        <p className="text-gray-500">No tienes mensajes nuevos.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mensajes</h1>
      <ul className="space-y-4">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className="bg-white p-4 rounded-lg shadow transition-shadow hover:shadow-md"
            role="region"
            aria-label={`Mensaje de ${msg.sender}`}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">{msg.subject}</h2>
              <time className="text-gray-500 text-sm">
                {new Date(msg.date).toLocaleString()}
              </time>
            </div>
            <p className="text-gray-700 mt-1">
              <span className="font-medium">{msg.sender}:</span>{' '}
              {msg.body.length > 100 ? msg.body.slice(0, 100) + '…' : msg.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
