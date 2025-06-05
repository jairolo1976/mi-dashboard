import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AlumnosPage from './pages/AlumnosPage';
import EvaluacionesPage from './pages/EvaluacionesPage';
import FormularioEvaluacion from './pages/FormularioEvaluacion';
import PartidosPage from './pages/PartidosPage';
import NuevoPartido from './pages/NuevoPartido';
import GestionPartido from './pages/GestionPartido';
import EstadisticasPartido from './pages/EstadisticasPartido';
import PartidoDetalle from './pages/PartidoDetalle';
import DashboardPrincipal from './pages/DashboardPrincipal';
import ReportesAvanzados from './pages/ReportesAvanzados';function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Dashboard />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<DashboardPrincipal />} />
            <Route path="/alumnos" element={<AlumnosPage />} />
            <Route path="/evaluaciones" element={<EvaluacionesPage />} />
            <Route path="/evaluaciones/nueva/:alumnoId" element={<FormularioEvaluacion />} />
            <Route path="/partidos" element={<PartidosPage />} />
            <Route path="/partidos/nuevo" element={<NuevoPartido />} />
            <Route path="/partidos/:id/gestion" element={<GestionPartido />} />
            <Route path="/partidos/:id/estadisticas" element={<EstadisticasPartido />} />
            <Route path="/partidos/:id" element={<PartidoDetalle />} />
            <Route path="/reportes" element={<ReportesAvanzados />} />          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
