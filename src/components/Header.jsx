function Header({ nombre = "Jairo" }) {
    return (
      <header className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center mb-6 rounded">
        <h2 className="text-xl font-bold text-blue-600">CALYSM</h2>
        <div className="text-gray-700">
          Hola, <span className="font-semibold">{nombre}</span>
        </div>
      </header>
    );
  }
  
  export default Header;
  