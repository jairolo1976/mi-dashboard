function Dashboard() {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-4">Inicio</h2>
        <p className="text-gray-600 mb-6">Bienvenido al panel de CALYSM</p>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-6 border-t-4 border-blue-400">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Alumnos registrados</h3>
            <p className="text-3xl font-bold text-blue-500">35</p>
          </div>
  
          <div className="bg-white shadow rounded-xl p-6 border-t-4 border-green-400">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Eventos próximos</h3>
            <p className="text-3xl font-bold text-green-500">4</p>
          </div>
  
          <div className="bg-white shadow rounded-xl p-6 border-t-4 border-pink-400">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Mensajes nuevos</h3>
            <p className="text-3xl font-bold text-pink-500">2</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default Dashboard;
  