const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Función para calcular semáforo basado en el valor y la normativa
function calcularSemaforo(valor, normativa) {
  if (normativa.menorEsMejor) {
    // Para pruebas donde menor es mejor (sprint, agilidad)
    if (valor <= normativa.valorExcelente) return 'verde';
    if (valor <= normativa.valorBueno) return 'verde';
    if (valor <= normativa.valorPromedio) return 'amarillo';
    if (valor <= normativa.valorBajo) return 'amarillo';
    return 'rojo';
  } else {
    // Para pruebas donde mayor es mejor (cooper, saltos)
    if (valor >= normativa.valorExcelente) return 'verde';
    if (valor >= normativa.valorBueno) return 'verde';
    if (valor >= normativa.valorPromedio) return 'amarillo';
    if (valor >= normativa.valorBajo) return 'amarillo';
    return 'rojo';
  }
}

// Generar valor aleatorio basado en la categoría y tipo de prueba
function generarValorPrueba(prueba, categoria, iteracion) {
  // Mejora progresiva con cada evaluación
  const mejora = 1 - (iteracion * 0.02);
  
  switch (prueba.codigo) {
    case 'SPRINT_20M':
      switch (categoria) {
        case 'Benjamín': return (3.8 + Math.random() * 1.2) * mejora;
        case 'Alevín': return (3.5 + Math.random() * 1.2) * mejora;
        case 'Infantil': return (3.2 + Math.random() * 1.2) * mejora;
        case 'Cadete': return (3.0 + Math.random() * 1.2) * mejora;
        case 'Juvenil': return (2.8 + Math.random() * 1.2) * mejora;
        default: return 4.0 * mejora;
      }
    case 'COOPER':
      switch (categoria) {
        case 'Benjamín': return 1600 + Math.random() * 600 + (iteracion * 50);
        case 'Alevín': return 1900 + Math.random() * 600 + (iteracion * 50);
        case 'Infantil': return 2200 + Math.random() * 600 + (iteracion * 50);
        case 'Cadete': return 2500 + Math.random() * 600 + (iteracion * 50);
        case 'Juvenil': return 2800 + Math.random() * 600 + (iteracion * 50);
        default: return 2000 + (iteracion * 50);
      }
    case 'SALTO_VERTICAL':
      switch (categoria) {
        case 'Benjamín': return 20 + Math.random() * 15 + (iteracion * 1);
        case 'Alevín': return 25 + Math.random() * 15 + (iteracion * 1);
        case 'Infantil': return 30 + Math.random() * 15 + (iteracion * 1);
        case 'Cadete': return 35 + Math.random() * 15 + (iteracion * 1);
        case 'Juvenil': return 40 + Math.random() * 15 + (iteracion * 1);
        default: return 30 + (iteracion * 1);
      }
    default:
      return 50 + Math.random() * 50;
  }
}

async function generarEvaluaciones() {
  try {
    console.log('🚀 Generando evaluaciones para 50 jugadores...\n');
    
    const jugadores = await prisma.alumno.findMany();
    const pruebas = await prisma.pruebaFisica.findMany();
    
    let totalResultadosFisicos = 0;
    let totalEvaluacionesTecnicas = 0;
    let totalEvaluacionesActitudinales = 0;
    let totalEvaluacionesGlobales = 0;
    
    for (const jugador of jugadores) {
      console.log(`\n👤 Procesando: ${jugador.nombre} ${jugador.apellido || ''} (#${jugador.numeroCamiseta})`);
      
      // 1. GENERAR RESULTADOS FÍSICOS (3 evaluaciones en 6 meses)
      for (let i = 0; i < 3; i++) {
        const fecha = new Date();
        fecha.setMonth(fecha.getMonth() - (6 - i * 2)); // Hace 6, 4 y 2 meses
        
        for (const prueba of pruebas.slice(0, 4)) { // Solo las 4 pruebas principales
          // Obtener normativa para esta prueba y categoría
          const normativa = await prisma.normativaReferencia.findFirst({
            where: {
              pruebaId: prueba.id,
              categoria: jugador.categoria
            }
          });
          
          if (normativa) {
            const valor = generarValorPrueba(prueba, jugador.categoria, i);
            const semaforo = calcularSemaforo(valor, normativa);
            
            await prisma.resultadoFisico.create({
              data: {
                alumnoId: jugador.id,
                pruebaId: prueba.id,
                valor: parseFloat(valor.toFixed(2)),
                fecha: fecha,
                semaforo: semaforo,
                percentil: semaforo === 'verde' ? 80 + Math.floor(Math.random() * 20) :
                           semaforo === 'amarillo' ? 40 + Math.floor(Math.random() * 40) :
                           10 + Math.floor(Math.random() * 30)
              }
            });
            totalResultadosFisicos++;
          }
        }
      }
      
      // 2. GENERAR EVALUACIONES TÉCNICAS (5 partidos últimos 2 meses)
      for (let i = 0; i < 5; i++) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - (60 - i * 15)); // Distribuidos en 2 meses
        
        // Generar estadísticas según posición
        let datos = {
          alumnoId: jugador.id,
          fecha: fecha,
          tipoEvaluacion: 'partido',
          minutosJugados: 60 + Math.floor(Math.random() * 30),
          pasesBuenos: 0,
          pasesTotales: 0,
          goles: 0,
          asistencias: 0,
          recuperaciones: 0,
          duelosGanados: 0,
          duelosPerdidos: 0
        };
        
        // Ajustar estadísticas según posición
        switch (jugador.posicion) {
          case 'Portero':
            datos.pasesBuenos = 15 + Math.floor(Math.random() * 10);
            datos.pasesTotales = datos.pasesBuenos + Math.floor(Math.random() * 5);
            break;
          case 'Defensa':
            datos.pasesBuenos = 25 + Math.floor(Math.random() * 15);
            datos.pasesTotales = datos.pasesBuenos + Math.floor(Math.random() * 10);
            datos.recuperaciones = 3 + Math.floor(Math.random() * 5);
            datos.duelosGanados = 4 + Math.floor(Math.random() * 4);
            datos.duelosPerdidos = 1 + Math.floor(Math.random() * 3);
            break;
          case 'Medio':
            datos.pasesBuenos = 30 + Math.floor(Math.random() * 20);
            datos.pasesTotales = datos.pasesBuenos + Math.floor(Math.random() * 10);
            datos.asistencias = Math.random() > 0.6 ? 1 : 0;
            datos.recuperaciones = 2 + Math.floor(Math.random() * 3);
            datos.goles = Math.random() > 0.8 ? 1 : 0;
            break;
          case 'Delantero':
            datos.pasesBuenos = 15 + Math.floor(Math.random() * 10);
            datos.pasesTotales = datos.pasesBuenos + Math.floor(Math.random() * 8);
            datos.goles = Math.random() > 0.5 ? Math.floor(Math.random() * 2) + 1 : 0;
            datos.asistencias = Math.random() > 0.7 ? 1 : 0;
            datos.tirosPuerta = 2 + Math.floor(Math.random() * 3);
            datos.tirosDesviados = Math.floor(Math.random() * 3);
            break;
        }
        
        // Calcular porcentaje de pases
        datos.porcentajePases = datos.pasesTotales > 0 ? 
          parseFloat(((datos.pasesBuenos / datos.pasesTotales) * 100).toFixed(1)) : 0;
        
        // Asignar semáforos según rendimiento
        datos.semaforoPases = datos.porcentajePases >= 80 ? 'verde' : 
                              datos.porcentajePases >= 65 ? 'amarillo' : 'rojo';
        
        if (jugador.posicion === 'Delantero') {
          datos.semaforoOfensivo = datos.goles > 0 ? 'verde' : 
                                   datos.tirosPuerta > 2 ? 'amarillo' : 'rojo';
        }
        
        if (jugador.posicion === 'Defensa') {
          datos.semaforoDefensivo = datos.recuperaciones >= 5 ? 'verde' :
                                    datos.recuperaciones >= 3 ? 'amarillo' : 'rojo';
        }
        
        datos.semaforoGeneral = 'amarillo'; // Por defecto
        if ((datos.semaforoOfensivo === 'verde') || (datos.semaforoDefensivo === 'verde') || 
            (datos.semaforoPases === 'verde')) {
          datos.semaforoGeneral = 'verde';
        } else if ((datos.semaforoOfensivo === 'rojo') || (datos.semaforoDefensivo === 'rojo')) {
          datos.semaforoGeneral = 'rojo';
        }
        
        await prisma.evaluacionTecnica.create({ data: datos });
        totalEvaluacionesTecnicas++;
      }
      
      // 3. GENERAR EVALUACIÓN ACTITUDINAL (1 cada 2 meses)
      for (let i = 0; i < 3; i++) {
        const fecha = new Date();
        fecha.setMonth(fecha.getMonth() - (6 - i * 2));
        
        const evaluacion = await prisma.evaluacionActitudinal.create({
          data: {
            alumnoId: jugador.id,
            fecha: fecha,
            periodo: 'bimestral',
            disciplina: 3 + Math.floor(Math.random() * 3), // 3-5
            concentracion: 3 + Math.floor(Math.random() * 3),
            puntualidad: 4 + Math.floor(Math.random() * 2), // 4-5
            trabajoEquipo: 3 + Math.floor(Math.random() * 3),
            liderazgo: 2 + Math.floor(Math.random() * 4), // 2-5
            resiliencia: 3 + Math.floor(Math.random() * 3),
            tarjetasAmarillas: Math.random() > 0.7 ? 1 : 0,
            tarjetasRojas: 0,
            asistenciaPercent: 85 + Math.random() * 15,
            semaforoGeneral: 'verde' // Simplificado
          }
        });
        totalEvaluacionesActitudinales++;
      }
      
      // 4. GENERAR EVALUACIÓN GLOBAL (última)
      const ultimaFecha = new Date();
      
      // Contar semáforos recientes
      const resultadosRecientes = await prisma.resultadoFisico.findMany({
        where: { 
          alumnoId: jugador.id,
          fecha: { gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) } // Últimos 2 meses
        }
      });
      
      const semaforosFisicos = resultadosRecientes.map(r => r.semaforo);
      const verdesFisicos = semaforosFisicos.filter(s => s === 'verde').length;
      const rojosFisicos = semaforosFisicos.filter(s => s === 'rojo').length;
      
      await prisma.evaluacionGlobal.create({
        data: {
          alumnoId: jugador.id,
          fecha: ultimaFecha,
          periodo: 'bimestral',
          semaforoFisico: verdesFisicos > rojosFisicos ? 'verde' : 
                          rojosFisicos > verdesFisicos ? 'rojo' : 'amarillo',
          semaforoTecnico: 'amarillo', // Basado en evaluaciones técnicas
          semaforoTactico: 'verde',
          semaforoActitudinal: 'verde',
          notaGeneral: 6.5 + Math.random() * 3.5, // 6.5 a 10
          percentilCategoria: 40 + Math.floor(Math.random() * 60),
          fortalezas: ['Velocidad destacada', 'Buen compañero'],
          areasDesarrollo: ['Mejorar resistencia', 'Técnica de pase'],
          recomendaciones: ['Trabajar ejercicios aeróbicos 2 veces/semana', 'Practicar pases largos'],
          tendenciaFisica: 'mejorando',
          tendenciaTecnica: 'estable',
          tendenciaActitudinal: 'mejorando'
        }
      });
      totalEvaluacionesGlobales++;
      
      console.log(`  ✅ Físicas: ${pruebas.length * 3} | Técnicas: 5 | Actitud: 3 | Global: 1`);
    }
    
    console.log('\n📊 RESUMEN TOTAL:');
    console.log(`- ${totalResultadosFisicos} resultados físicos`);
    console.log(`- ${totalEvaluacionesTecnicas} evaluaciones técnicas`);
    console.log(`- ${totalEvaluacionesActitudinales} evaluaciones actitudinales`);
    console.log(`- ${totalEvaluacionesGlobales} evaluaciones globales`);
    console.log('\n✅ ¡Todas las evaluaciones generadas!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
generarEvaluaciones();