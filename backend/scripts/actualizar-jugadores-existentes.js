const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function actualizarJugadoresExistentes() {
  try {
    console.log('🔄 Actualizando jugadores existentes...');
    
    // Obtener todos los jugadores actuales
    const jugadores = await prisma.alumno.findMany({
      orderBy: { id: 'asc' }
    });
    
    console.log(`📊 Encontrados ${jugadores.length} jugadores`);
    
    // Distribución de posiciones basada en un equipo típico
    // Para 31 jugadores: 3 porteros, 10 defensas, 12 medios, 6 delanteros
    const posiciones = [
      ...Array(3).fill('Portero'),
      ...Array(10).fill('Defensa'),
      ...Array(12).fill('Medio'),
      ...Array(6).fill('Delantero')
    ];
    
    // Mezclar posiciones para distribuir aleatoriamente
    posiciones.sort(() => Math.random() - 0.5);
    
    // Números ya usados (para evitar duplicados)
    const numerosUsados = new Set();
    
    // Actualizar cada jugador
    for (let i = 0; i < jugadores.length; i++) {
      const jugador = jugadores[i];
      
      // Asignar posición
      const posicion = posiciones[i];
      
      // Generar número de camiseta único
      let numeroCamiseta;
      do {
        if (posicion === 'Portero') {
          // Porteros suelen usar 1, 13, 25
          numeroCamiseta = [1, 13, 25][Math.floor(Math.random() * 3)];
        } else if (posicion === 'Defensa') {
          // Defensas suelen usar 2-5, 12-16
          numeroCamiseta = Math.floor(Math.random() * 10) + 2;
        } else if (posicion === 'Medio') {
          // Medios suelen usar 6-8, 10, 14, 16-23
          numeroCamiseta = Math.floor(Math.random() * 15) + 6;
        } else {
          // Delanteros suelen usar 7, 9, 11, 17-21
          numeroCamiseta = [7, 9, 11, 17, 18, 19, 20, 21][Math.floor(Math.random() * 8)];
        }
      } while (numerosUsados.has(numeroCamiseta));
      
      numerosUsados.add(numeroCamiseta);
      
      // Actualizar jugador
      await prisma.alumno.update({
        where: { id: jugador.id },
        data: {
          numeroCamiseta,
          posicion
        }
      });
      
      console.log(`✅ ${jugador.nombre} ${jugador.apellido || ''} - #${numeroCamiseta} - ${posicion}`);
    }
    
    // Resumen por posición
    const resumen = await prisma.alumno.groupBy({
      by: ['posicion'],
      _count: true
    });
    
    console.log('\n�� RESUMEN POR POSICIÓN:');
    resumen.forEach(r => {
      console.log(`${r.posicion}: ${r._count} jugadores`);
    });
    
    console.log('\n✅ Actualización completada!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
actualizarJugadoresExistentes();
