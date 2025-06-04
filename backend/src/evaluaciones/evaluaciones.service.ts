import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EvaluacionesService {
  constructor(private prisma: PrismaService) {}

  async crearEvaluacionFisica(jugadorId: number, datos: any) {
    // Aquí guardarías en la base de datos
    console.log('Guardando evaluación física:', { jugadorId, datos });
    
    // Por ahora retornamos un objeto simulado
    return {
      success: true,
      message: 'Evaluación física guardada',
      jugadorId,
      datos
    };
  }

  async crearEvaluacionTecnica(jugadorId: number, datos: any) {
    console.log('Guardando evaluación técnica:', { jugadorId, datos });
    
    return {
      success: true,
      message: 'Evaluación técnica guardada',
      jugadorId,
      datos
    };
  }

  async crearEvaluacionActitudinal(jugadorId: number, datos: any) {
    console.log('Guardando evaluación actitudinal:', { jugadorId, datos });
    
    // Verificar si ya tiene las 3 evaluaciones
    const todasCompletas = await this.verificarEvaluacionesCompletas(jugadorId);
    
    if (todasCompletas) {
      // Enviar email automáticamente
      await this.enviarReportePorEmail(jugadorId);
    }
    
    return {
      success: true,
      message: 'Evaluación actitudinal guardada',
      jugadorId,
      datos,
      todasCompletas
    };
  }

  async obtenerEvaluacionesJugador(jugadorId: number) {
    // Aquí obtendrías de la base de datos
    return {
      fisica: null,
      tecnica: null,
      actitudinal: null
    };
  }

  async obtenerEvaluacionesPendientes() {
    const alumnos = await this.prisma.alumno.findMany();
    
    return {
      total: alumnos.length,
      pendientesFisicas: alumnos.length,
      pendientesTecnicas: alumnos.length,
      pendientesActitudinales: alumnos.length
    };
  }

  async verificarEvaluacionesCompletas(jugadorId: number): Promise<boolean> {
    // Aquí verificarías en la base de datos
    // Por ahora simulamos
    return true;
  }

  async enviarReportePorEmail(jugadorId: number) {
    const jugador = await this.prisma.alumno.findUnique({
      where: { id: jugadorId }
    });

    if (!jugador) {
      throw new Error('Jugador no encontrado');
    }

    console.log('📧 Enviando reporte por email a:', {
      jugador: `${jugador.nombre} ${jugador.apellido}`,
      emailPadre1: jugador.emailTutor,
      emailPadre2: jugador.emailTutor2
    });

    // Aquí integrarías con un servicio de email real (SendGrid, AWS SES, etc.)
    
    return {
      success: true,
      message: 'Reporte enviado por email',
      destinatarios: [jugador.emailTutor, jugador.emailTutor2].filter(Boolean)
    };
  }
}
