function Locker({ estado = "libre" }) {
    return (
      <div style={{
        width: "100px",
        height: "100px",
        backgroundColor: estado === "libre" ? "lightgreen" :
                         estado === "ocupado" ? "tomato" :
                         estado === "reservado" ? "gold" : "lightgray",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontWeight: "bold"
      }}>
        {estado}
      </div>
    );
  }
  
  export default Locker;
  
