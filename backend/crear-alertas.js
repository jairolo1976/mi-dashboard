// crear-alertas.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function crearAlertas() {
  console.log('🚨 Creando 3 alertas importantes...\n');

  const alertas = [
    {
      titulo: 'Revisión médica obligatoria',
      descripcion: 'Todos los alumnos deben presentar certificado médico actualizado antes del 15 de febrero. Incluir electrocardiograma para mayores de 12 años.',
      tipo: 'warning',
      activo: true
    },
    {
      titulo: 'Isabella Miller - ALERGIA SEVERA A ABEJAS',
      descripcion: 'ATENCIÓN: Isabella Miller tiene alergia severa a picaduras de abejas. Verificar que lleve EpiPen en TODOS los entrenamientos y partidos. Contacto emergencia: Sarah Miller (323) 555-0208',
      tipo: 'error',
      activo: true
    },
    {
      titulo: 'Torneo de primavera Los Angeles Youth Cup',
      descripcion: 'Inscripciones abiertas para el torneo del 15-17 de marzo. Categorías Sub-10 y Sub-12. Fecha límite de inscripción: 1 de marzo. Costo: $50 por equipo.',
      tipo: 'info',
      activo: true
    }
  ];

  try {
    for (const alerta of alertas) {
      const created = await prisma.alerta.create({
        data: alerta
      });
      console.log(`✅ Creada: "${created.titulo}" - Tipo: ${created.tipo}`);
    }
    
    console.log('\n🎉 ¡3 alertas creadas exitosamente!');
    
    // Mostrar resumen
    const total = await prisma.alerta.count();
    const activas = await prisma.alerta.count({ where: { activo: true } });
    
    console.log(`\n📊 Total de alertas en el sistema: ${total}`);
    console.log(`✅ Alertas activas: ${activas}`);
    
  } catch (error) {
    console.error('❌ Error al crear alertas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
crearAlertas();
