import { useState, useEffect } from 'react';
import { getCasilleros } from '../services/endpoints';

export default function CasillerosList(){
  const [data,setData]=useState([]); const [load,setLoad]=useState(true); const [err,setErr]=useState(null);
  useEffect(()=>{ getCasilleros().then(setData).catch(e=>{setErr('Error al cargar.');console.error(e);} ).finally(()=>setLoad(false)); },[]);
  if(load) return <div className="p-6">Cargando…</div>;
  if(err)  return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Casilleros</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {data.map(c=>(
          <div key={c.id} className={`rounded p-4 text-center text-white ${c.estado==='ocupado'?'bg-red-500':'bg-green-500'}`}>
            <b>C-{c.id}</b><br/>{c.estado}
          </div>
        ))}
      </div>
    </div>
  );
}
