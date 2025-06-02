const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function crearAlumnos() {
  const alumnos = [
    { 
      nombre: 'María López', 
      edad: 12, 
      categoria: 'Infantil', 
      telefono: '600234567', 
      email: 'maria@test.com',
      alergias: 'Polen',
      grupoSanguineo: 'A+'
    },
    { 
      nombre: 'Carlos Martín', 
      edad: 8, 
      categoria: 'Benjamín', 
      telefono: '600345678', 
      email: 'carlos@test.com',
      enfermedades: 'Asma leve',
      medicamentos: 'Ventolín'
    },
    { 
      nombre: 'Ana Rodríguez', 
      edad: 16, 
      categoria: 'Juvenil', 
      telefono: '600456789', 
      email: 'ana@test.com',
      alergias: 'Frutos secos',
      grupoSanguineo: 'O+'
    },
    { 
      nombre: 'Pedro Sánchez', 
      edad: 14, 
      categoria: 'Cadete', 
      telefono: '600567890', 
      email: 'pedro@test.com'
    }
  ];

  for (const alumno of alumnos) {
    const created = await prisma.alumno.create({ data: alumno });
    console.log(`✅ Creado: ${created.nombre}`);
  }

  const total = await prisma.alumno.count();
  console.log(`\n📊 Total de alumnos en la base de datos: ${total}`);
  
  await prisma.$disconnect();
}

crearAlumnos();
