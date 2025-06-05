import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EvaluacionesService {
  constructor(private prisma: PrismaService) {}

  async crearEvaluacionFisica(jugadorId: number, datos: any) {
    try {
      console.log('💾 Guardando evaluación física en BD:', { jugadorId, datos });
      
      // Buscar evaluación existente
      const evaluacionExistente = await this.prisma.resultadoFisico.findFirst({
        where: { alumnoId: jugadorId }
      });

      let evaluacion;
      if (evaluacionExistente) {
        // Actualizar existente
        evaluacion = await this.prisma.resultadoFisico.update({
          where: { id: evaluacionExistente.id },
          data: {
            // Guardamos todos los datos como JSON en observaciones
            observaciones: JSON.stringify(datos),
            semaforo: 'verde', // Por defecto
            valor: parseFloat(datos.velocidad40m) || 0 // Usar velocidad como valor principal
          }
        });
        console.log('✅ Evaluación física actualizada en BD');
      } else {
        // Crear nueva - necesitamos una prueba física existente
        let pruebaFisica = await this.prisma.pruebaFisica.findFirst({
          where: { nombre: 'Evaluación Integral' }
        });

        if (!pruebaFisica) {
          // Crear la prueba física si no existe
          pruebaFisica = await this.prisma.pruebaFisica.create({
            data: {
              codigo: 'EVAL_INT',
              nombre: 'Evaluación Integral',
              unidad: 'múltiple',
              categoria: 'general',
              descripcion: 'Evaluación física completa'
            }
          });
        }

        evaluacion = await this.prisma.resultadoFisico.create({
          data: {
            alumnoId: jugadorId,
            pruebaId: pruebaFisica.id,
            valor: parseFloat(datos.velocidad40m) || 0,
            semaforo: 'verde',
            observaciones: JSON.stringify(datos),
            fecha: new Date()
          }
        });
        console.log('✅ Nueva evaluación física creada en BD');
      }

      return {
        success: true,
        message: 'Evaluación física guardada en base de datos',
        jugadorId,
        evaluacion
      };
    } catch (error) {
      console.error('❌ Error guardando evaluación física:', error);
      throw new Error('Error al guardar evaluación física');
    }
  }

  async crearEvaluacionTecnica(jugadorId: number, datos: any) {
    try {
      console.log('💾 Guardando evaluación técnica en BD:', { jugadorId, datos });
      
      const evaluacionExistente = await this.prisma.evaluacionTecnica.findFirst({
        where: { alumnoId: jugadorId }
      });

      let evaluacion;
      if (evaluacionExistente) {
        evaluacion = await this.prisma.evaluacionTecnica.update({
          where: { id: evaluacionExistente.id },
          data: {
            // Usar los campos que SÍ existen en la tabla
            goles: parseInt(datos.golesPartido) || 0,
            asistencias: parseInt(datos.asistencias) || 0,
            minutosJugados: parseInt(datos.minutosJugados) || 0,
            semaforoGeneral: 'verde',
            tipoEvaluacion: 'entrenamiento',
            observaciones: JSON.stringify({
              controlBalon: datos.controlBalon,
              pase: datos.pase,
              tiro: datos.tiro,
              regate: datos.regate,
              cabeceo: datos.cabeceo,
              visionJuego: datos.visionJuego
            })
          }
        });
        console.log('✅ Evaluación técnica actualizada en BD');
      } else {
        evaluacion = await this.prisma.evaluacionTecnica.create({
          data: {
            alumnoId: jugadorId,
            fecha: new Date(),
            tipoEvaluacion: 'entrenamiento',
            goles: parseInt(datos.golesPartido) || 0,
            asistencias: parseInt(datos.asistencias) || 0,
            minutosJugados: parseInt(datos.minutosJugados) || 0,
            semaforoGeneral: 'verde',
            observaciones: JSON.stringify({
              controlBalon: datos.controlBalon,
              pase: datos.pase,
              tiro: datos.tiro,
              regate: datos.regate,
              cabeceo: datos.cabeceo,
              visionJuego: datos.visionJuego
            })
          }
        });
        console.log('✅ Nueva evaluación técnica creada en BD');
      }

      return {
        success: true,
        message: 'Evaluación técnica guardada en base de datos',
        jugadorId,
        evaluacion
      };
    } catch (error) {
      console.error('❌ Error guardando evaluación técnica:', error);
      throw new Error('Error al guardar evaluación técnica');
    }
  }

  async crearEvaluacionActitudinal(jugadorId: number, datos: any) {
    try {
      console.log('💾 Guardando evaluación actitudinal en BD:', { jugadorId, datos });
      
      const evaluacionExistente = await this.prisma.evaluacionActitudinal.findFirst({
        where: { alumnoId: jugadorId }
      });

      let evaluacion;
      if (evaluacionExistente) {
        evaluacion = await this.prisma.evaluacionActitudinal.update({
          where: { id: evaluacionExistente.id },
          data: {
            // Usar los campos que SÍ existen en la tabla
            disciplina: datos.esfuerzo || 3, // Mapear esfuerzo a disciplina
            concentracion: datos.actitudPositiva || 3,
            puntualidad: datos.puntualidad || 3,
            trabajoEquipo: datos.trabajoEquipo || 3,
            liderazgo: datos.liderazgo || 3,
            resiliencia: datos.respeto || 3, // Mapear respeto a resiliencia
            semaforoGeneral: 'verde',
            periodo: 'mensual',
            observaciones: datos.observaciones || null
          }
        });
        console.log('✅ Evaluación actitudinal actualizada en BD');
      } else {
        evaluacion = await this.prisma.evaluacionActitudinal.create({
          data: {
            alumnoId: jugadorId,
            fecha: new Date(),
            periodo: 'mensual',
            disciplina: datos.esfuerzo || 3,
            concentracion: datos.actitudPositiva || 3,
            puntualidad: datos.puntualidad || 3,
            trabajoEquipo: datos.trabajoEquipo || 3,
            liderazgo: datos.liderazgo || 3,
            resiliencia: datos.respeto || 3,
            semaforoGeneral: 'verde',
            observaciones: datos.observaciones || null
          }
        });
        console.log('✅ Nueva evaluación actitudinal creada en BD');
      }

      // Verificar si ya tiene las 3 evaluaciones
      const todasCompletas = await this.verificarEvaluacionesCompletas(jugadorId);
      
      if (todasCompletas) {
        console.log('🎉 ¡Todas las evaluaciones completadas para el jugador!');
      }

      return {
        success: true,
        message: 'Evaluación actitudinal guardada en base de datos',
        jugadorId,
        evaluacion,
        todasCompletas
      };
    } catch (error) {
      console.error('❌ Error guardando evaluación actitudinal:', error);
      throw new Error('Error al guardar evaluación actitudinal');
    }
  }

  async obtenerEvaluacionesJugador(jugadorId: number) {
    try {
      const [fisica, tecnica, actitudinal] = await Promise.all([
        this.prisma.resultadoFisico.findFirst({
          where: { alumnoId: jugadorId },
          include: { prueba: true }
        }),
        this.prisma.evaluacionTecnica.findFirst({
          where: { alumnoId: jugadorId }
        }),
        this.prisma.evaluacionActitudinal.findFirst({
          where: { alumnoId: jugadorId }
        })
      ]);

      return {
        fisica,
        tecnica,
        actitudinal
      };
    } catch (error) {
      console.error('❌ Error obteniendo evaluaciones:', error);
      return {
        fisica: null,
        tecnica: null,
        actitudinal: null
      };
    }
  }

  async obtenerEvaluacionesPendientes() {
    try {
      const totalAlumnos = await this.prisma.alumno.count();
      
      const [
        conEvaluacionFisica,
        conEvaluacionTecnica,
        conEvaluacionActitudinal
      ] = await Promise.all([
        this.prisma.resultadoFisico.count(),
        this.prisma.evaluacionTecnica.count(),
        this.prisma.evaluacionActitudinal.count()
      ]);

      const resultado = {
        total: totalAlumnos,
        pendientesFisicas: Math.max(0, totalAlumnos - conEvaluacionFisica),
        pendientesTecnicas: Math.max(0, totalAlumnos - conEvaluacionTecnica),
        pendientesActitudinales: Math.max(0, totalAlumnos - conEvaluacionActitudinal)
      };

      console.log('📊 Estadísticas de evaluaciones:', resultado);
      return resultado;
    } catch (error) {
      console.error('❌ Error obteniendo pendientes:', error);
      return {
        total: 0,
        pendientesFisicas: 0,
        pendientesTecnicas: 0,
        pendientesActitudinales: 0
      };
    }
  }

  async verificarEvaluacionesCompletas(jugadorId: number): Promise<boolean> {
    try {
      const [fisica, tecnica, actitudinal] = await Promise.all([
        this.prisma.resultadoFisico.findFirst({
          where: { alumnoId: jugadorId }
        }),
        this.prisma.evaluacionTecnica.findFirst({
          where: { alumnoId: jugadorId }
        }),
        this.prisma.evaluacionActitudinal.findFirst({
          where: { alumnoId: jugadorId }
        })
      ]);

      return !!(fisica && tecnica && actitudinal);
    } catch (error) {
      console.error('❌ Error verificando evaluaciones:', error);
      return false;
    }
  }

  async enviarReportePorEmail(jugadorId: number) {
    const jugador = await this.prisma.alumno.findUnique({
      where: { id: jugadorId }
    });

    if (!jugador) {
      throw new Error('Jugador no encontrado');
    }

    // Obtener todas las evaluaciones
    const evaluaciones = await this.obtenerEvaluacionesJugador(jugadorId);

    console.log('📧 Preparando envío de reporte por email:', {
      jugador: `${jugador.nombre} ${jugador.apellido}`,
      emailPadre1: jugador.emailTutor,
      emailPadre2: jugador.emailTutor2,
      evaluaciones: {
        fisica: !!evaluaciones.fisica,
        tecnica: !!evaluaciones.tecnica,
        actitudinal: !!evaluaciones.actitudinal
      }
    });

    // Aquí integrarías con un servicio de email real (SendGrid, AWS SES, etc.)
    // Por ahora simulamos el envío exitoso
    
    console.log('✅ Reporte enviado exitosamente (simulado)');
    
    return {
      success: true,
      message: 'Reporte enviado por email',
      destinatarios: [jugador.emailTutor, jugador.emailTutor2].filter(Boolean),
      evaluaciones
    };
  }
}
