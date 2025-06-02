import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { XIcon } from 'lucide-react';

const colors = {
  partido: 'bg-red-500',
  entreno: 'bg-blue-500',
  torneo: 'bg-green-500'
};

function CalendarioMensual() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://localhost:3001/events');
        if (res.ok) setEvents(await res.json());
      } catch {
        // ignore
      }
    }
    load();
  }, []);

  const eventsByDate = events.reduce((acc, ev) => {
    (acc[ev.date] = acc[ev.date] || []).push(ev);
    return acc;
  }, {});

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const key = date.toISOString().split('T')[0];
    const day = eventsByDate[key];
    if (!day) return null;
    return (
      <div className="flex justify-center mt-1">
        {day.map((e) => (
          <span key={e.id} className={`w-2 h-2 rounded-full mx-0.5 ${colors[e.type]}`} />
        ))}
      </div>
    );
  };

  const onClickDay = (value) => {
    const key = value.toISOString().split('T')[0];
    if (eventsByDate[key]) setSelected({ date: key, eventos: eventsByDate[key] });
  };

  return (
    <div className="space-y-4">
      <Calendar onClickDay={onClickDay} tileContent={tileContent} className="!w-full bg-white rounded shadow p-2" />
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-80 p-4 shadow space-y-2">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="font-semibold">Eventos {selected.date}</h2>
              <button onClick={() => setSelected(null)}><XIcon size={18} /></button>
            </div>
            <ul className="space-y-2">
              {selected.eventos.map(ev => (
                <li key={ev.id} className="flex justify-between items-center">
                  <span className={`px-2 py-1 text-white text-xs rounded ${colors[ev.type]}`}>{ev.title}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-end pt-2">
              <button className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded" onClick={() => setSelected(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarioMensual;