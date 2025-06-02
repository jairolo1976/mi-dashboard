import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');
  
  // Crear alumnos de prueba
  const alumnos = [
    { nombre: 'Juan García', edad: 10, categoria: 'Alevín', telefono: '600123456', email: 'juan.garcia@email.com' },
    { nombre: 'María López', edad: 12, categoria: 'Infantil', telefono: '600234567', email: 'maria.lopez@email.com' },
    { nombre: 'Carlos Martín', edad: 8, categoria: 'Benjamín', telefono: '600345678', email: 'carlos.martin@email.com' },
    { nombre: 'Ana Rodríguez', edad: 16, categoria: 'Juvenil', telefono: '600456789', email: 'ana.rodriguez@email.com' },
    { nombre: 'Pedro Sánchez', edad: 14, categoria: 'Cadete', telefono: '600567890', email: 'pedro.sanchez@email.com' },
  ];

  for (const alumno of alumnos) {
    await prisma.alumno.create({ data: alumno });
    console.log(`✅ Creado alumno: ${alumno.nombre}`);
  }

  // Crear mensajes de prueba
  const mensajes = [
    { sender: 'Entrenador', subject: 'Entrenamiento', body: 'Mañana a las 10', date: new Date(), leido: false },
    { sender: 'Secretaría', subject: 'Cuotas', body: 'Recordatorio de pago', date: new Date(), leido: false },
  ];

  for (const mensaje of mensajes) {
    await prisma.mensaje.create({ data: mensaje });
    console.log(`✅ Creado mensaje: ${mensaje.subject}`);
  }

  console.log('✅ Base de datos poblada con éxito');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
