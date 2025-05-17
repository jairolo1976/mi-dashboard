import Messages from "../components/Messages";
import Alumnos from "../components/Alumnos";
import Agenda from "../components/Agenda";

function MainContent({ seccion }) {
  const mensajes = [
    {
      remitente: "Carlos (Padre)",
      texto: "¿A qué hora es el entrenamiento?",
      respuesta: "A las 17:00.",
      tipo: "padre",
    },
    {
      remitente: "Lucía (Email)",
      texto: "Estoy interesada en apuntar a mi hijo.",
      respuesta: "Gracias Lucía, te enviamos la información.",
      tipo: "interesado",
    },
  ];

  const alumnos = [
    {
      nombre: "Daniel Martínez",
      telefono: "666 123 456",
      estado: "activo",
      categoria: "Benjamín",
    },
    {
      nombre: "Laura Torres",
      telefono: "600 987 321",
      estado: "lesionado",
      categoria: "Alevín",
    },
  ];

  const eventos = [
    {
      titulo: "Entrenamiento general",
      fecha: "2025-05-10",
      hora: "17:00",
      tipo: "entrenamiento",
    },
    {
      titulo: "Partido contra Club Rayo",
      fecha: "2025-05-13",
      hora: "19:30",
      tipo: "partido",
    },
    {
      titulo: "Viaje a Torneo Nacional",
      fecha: "2025-05-18",
      hora: "07:00",
      tipo: "viaje",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{seccion}</h2>

      {seccion === "Mensajes" && <Messages mensajes={mensajes} />}
      {seccion === "Alumnos" && <Alumnos lista={alumnos} />}
      {seccion === "Agenda" && <Agenda eventos={eventos} />}

      {/* Más secciones como Casilleros, Configuración, etc. */}
    </div>
  );
}

export default MainContent;
