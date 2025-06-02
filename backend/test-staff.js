const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('🔍 Probando conexión directa con Prisma...');
    
    // Primero lista el staff existente
    const existing = await prisma.staff.findMany();
    console.log(`📋 Staff existente: ${existing.length} registros`);
    
    // Crea uno nuevo
    console.log('\n➕ Creando nuevo staff...');
    const newStaff = await prisma.staff.create({
      data: {
        nombre: 'DirectTest',
        apellido: 'Prisma',
        cargo: 'Test',
        email: `direct${Date.now()}@test.com`,
        password: '123456',
        telefono: '600000000',
        activo: true
      }
    });
    
    console.log('✅ Staff creado exitosamente:');
    console.log(newStaff);
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Tipo:', error.constructor.name);
    console.error('Código:', error.code);
    if (error.meta) {
      console.error('Meta:', error.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

test();
