// src/routes.js
import React from 'react'
import { Navigate } from 'react-router-dom'
import {
  HomeIcon,
  MessageCircleIcon,
  GraduationCapIcon,
  CalendarIcon,
  ArchiveIcon,
  SettingsIcon,
} from 'lucide-react'

// importa tus páginas
import Inicio from './pages/Inicio'
import Alumnos from './pages/Alumnos'
import Mensajes from './pages/Messages'      // o renómbralo a Mensajes.jsx si quieres
import Agenda   from './pages/Agenda'
import Casilleros from './pages/Casilleros'
import Configuracion from './pages/Configuracion'

export const routes = [
  {
    path: '/',
    element: <Navigate to="/inicio" replace />,
    sidebar: false,
  },
  {
    path: '/inicio',
    element: <Inicio />,
    label: 'Inicio',
    icon: <HomeIcon />,
    sidebar: true,
  },
  {
    path: '/alumnos',
    element: <Alumnos />,
    label: 'Alumnos',
    icon: <GraduationCapIcon />,
    sidebar: true,
  },
  {
    path: '/mensajes',
    element: <Mensajes />,
    label: 'Mensajes',
    icon: <MessageCircleIcon />,
    sidebar: true,
  },
  {
    path: '/agenda',
    element: <Agenda />,
    label: 'Agenda',
    icon: <CalendarIcon />,
    sidebar: true,
  },
  {
    path: '/casilleros',
    element: <Casilleros />,
    label: 'Casilleros',
    icon: <ArchiveIcon />,
    sidebar: true,
  },
  {
    path: '/configuracion',
    element: <Configuracion />,
    label: 'Configuración',
    icon: <SettingsIcon />,
    sidebar: true,
  },
]
