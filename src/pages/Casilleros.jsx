import { useEffect, useState } from 'react';
import { getCasilleros } from '../services/endpoints';

export default function CasillerosList() {
  const [data,setData]=useState([]); const [load,setLoad]=useState(true);
  useEffect(()=>{ getCasilleros().then(setData).finally(()=>setLoad(false)); },[]);
  if(load) return <p className="p-6">Cargando…</p>;
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Casilleros</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {data.map(c => (
          <li key={c.id}
              className={`rounded p-4 text-center text-white
                 ${c.estado==='ocupado'?'bg-red-500':'bg-green-500'}`}>
            {c.id}<br/><span className="text-sm">{c.estado}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
