const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  await prisma.alumno.updateMany({
    where: { categoria: 'Sub-10' },
    data: { categoria: 'Benjamín' }
  });
  
  await prisma.alumno.updateMany({
    where: { categoria: 'Sub-12' },
    data: { categoria: 'Alevín' }
  });
  
  console.log('✅ Categorías actualizadas');
  await prisma.$disconnect();
}

fix();
