const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function arreglarSinPosicion() {
  const sinPosicion = await prisma.alumno.findMany({
    where: { posicion: null }
  });
  
  console.log(`Encontrados ${sinPosicion.length} jugadores sin posición`);
  
  const posiciones = ['Defensa', 'Defensa', 'Defensa', 'Medio', 'Medio', 'Medio', 'Medio', 'Delantero', 'Delantero', 'Delantero'];
  
  for (let i = 0; i < sinPosicion.length; i++) {
    await prisma.alumno.update({
      where: { id: sinPosicion[i].id },
      data: { posicion: posiciones[i] }
    });
    console.log(`✅ ${sinPosicion[i].nombre} - ${posiciones[i]}`);
  }
  
  await prisma.$disconnect();
}

arreglarSinPosicion();
