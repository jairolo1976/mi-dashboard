const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const alumno = await prisma.alumno.create({
    data: {
      nombre: 'Juan Test',
      edad: 10,
      categoria: 'Alevín',
      telefono: '600123456',
      email: 'juan@test.com'
    }
  });
  console.log('Alumno creado:', alumno);
  await prisma.$disconnect();
}

test();
