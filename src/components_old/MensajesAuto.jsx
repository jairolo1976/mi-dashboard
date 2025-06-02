import React, { useEffect, useState } from 'react';
import {
  MailIcon,
  MessageCircleIcon,
  SendHorizonalIcon,
  XIcon
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function MensajesAuto() {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://localhost:3001/messages');
        if (!res.ok) throw new Error('Error ' + res.status);
        setMessages(await res.json());
      } catch (err) {
        toast('Error cargando mensajes: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  const resend = async (msg) => {
    toast(`Mensaje reenviado a ${msg.tutor}`);
  };

  if (loading) {
    return <p className="text-gray-500">Cargando mensajes…</p>;
  }

  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {messages.map((msg) => (
          <li key={msg.id} className="flex items-start space-x-3">
            <div className="flex flex-col items-center w-6">
              {msg.type === 'email' ? (
                <MailIcon className="text-blue-600" size={20} />
              ) : (
                <MessageCircleIcon className="text-green-600" size={20} />
              )}
              <span className="text-xs text-gray-400 mt-1">
                {new Date(msg.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow p-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">{msg.tutor}</h3>
                <button
                  onClick={() => setSelected(msg)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Ver más
                </button>
              </div>
              <p className="text-gray-700 text-sm mt-1">
                {msg.body.slice(0, 80)}{msg.body.length > 80 ? '…' : ''}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-4 space-y-2">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="font-semibold">{selected.subject}</h2>
              <button onClick={() => setSelected(null)}>
                <XIcon size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-500">{selected.tutor} – {new Date(selected.date).toLocaleString()}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm">{selected.body}</p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                onClick={() => {
                  resend(selected);
                  setSelected(null);
                }}
              >
                <SendHorizonalIcon size={16} /> Reenviar
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                onClick={() => setSelected(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
