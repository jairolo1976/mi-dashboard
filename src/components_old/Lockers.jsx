import Locker from "./Locker";

function Lockers({ onSeleccionar }) {
  const lockers = [
    { id: "A1", estado: "libre" },
    { id: "A2", estado: "ocupado" },
    { id: "A3", estado: "reservado" },
    { id: "A4", estado: "libre" },
    { id: "B1", estado: "ocupado" },
    { id: "B2", estado: "libre" },
    { id: "B3", estado: "reservado" },
    { id: "B4", estado: "libre" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 100px)",
        gap: "10px",
        padding: "20px",
      }}
    >
      {lockers.map((locker, index) => (
        <div
          key={index}
          onClick={() =>
            onSeleccionar({ numero: locker.id, estado: locker.estado })
          }
        >
          <Locker estado={locker.estado} />
        </div>
      ))}
    </div>
  );
}

export default Lockers;

  