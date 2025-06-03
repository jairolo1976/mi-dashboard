const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function crearCatalogoPruebas() {
  try {
    console.log('🏃 Creando catálogo de pruebas físicas...\n');
    
    // 1. CREAR PRUEBAS FÍSICAS
    const pruebas = [
      {
        codigo: 'SPRINT_20M',
        nombre: 'Sprint 20 metros',
        unidad: 'segundos',
        categoria: 'velocidad',
        descripcion: 'Carrera de velocidad en 20 metros desde salida parada'
      },
      {
        codigo: 'SPRINT_40M',
        nombre: 'Sprint 40 metros',
        unidad: 'segundos',
        categoria: 'velocidad',
        descripcion: 'Carrera de velocidad en 40 metros desde salida parada'
      },
      {
        codigo: 'COOPER',
        nombre: 'Test de Cooper',
        unidad: 'metros',
        categoria: 'resistencia',
        descripcion: 'Distancia recorrida en 12 minutos'
      },
      {
        codigo: 'SALTO_VERTICAL',
        nombre: 'Salto Vertical',
        unidad: 'centímetros',
        categoria: 'potencia',
        descripcion: 'Altura máxima de salto vertical con contramovimiento'
      },
      {
        codigo: 'SALTO_HORIZONTAL',
        nombre: 'Salto Horizontal',
        unidad: 'metros',
        categoria: 'potencia',
        descripcion: 'Distancia de salto horizontal a pies juntos'
      },
      {
        codigo: 'AGILIDAD_ILLINOIS',
        nombre: 'Test de Agilidad Illinois',
        unidad: 'segundos',
        categoria: 'agilidad',
        descripcion: 'Circuito de agilidad en zigzag entre conos'
      },
      {
        codigo: 'FLEXIBILIDAD',
        nombre: 'Test de Flexibilidad',
        unidad: 'centímetros',
        categoria: 'flexibilidad',
        descripcion: 'Flexión de tronco sentado (sit and reach)'
      }
    ];
    
    // Crear las pruebas
    for (const prueba of pruebas) {
      const created = await prisma.pruebaFisica.create({ data: prueba });
      console.log(`✅ Prueba creada: ${created.nombre}`);
    }
    
    console.log('\n📏 Creando normativas de referencia...\n');
    
    // 2. CREAR NORMATIVAS DE REFERENCIA
    // Obtenemos las pruebas creadas
    const pruebasCreadas = await prisma.pruebaFisica.findMany();
    
    // Normativas por categoría
    const categorias = ['Benjamín', 'Alevín', 'Infantil', 'Cadete', 'Juvenil'];
    
    for (const prueba of pruebasCreadas) {
      for (const categoria of categorias) {
        // Valores base que ajustaremos según categoría
        let normativa = {
          pruebaId: prueba.id,
          categoria: categoria,
          sexo: null, // Para ambos sexos (simplificado por ahora)
          menorEsMejor: false
        };
        
        // Ajustar valores según prueba y categoría
        switch (prueba.codigo) {
          case 'SPRINT_20M':
            normativa.menorEsMejor = true;
            // Valores en segundos (menor es mejor)
            switch (categoria) {
              case 'Benjamín':
                normativa.valorExcelente = 3.8;
                normativa.valorBueno = 4.2;
                normativa.valorPromedio = 4.5;
                normativa.valorBajo = 4.8;
                normativa.valorCritico = 5.2;
                break;
              case 'Alevín':
                normativa.valorExcelente = 3.5;
                normativa.valorBueno = 3.9;
                normativa.valorPromedio = 4.2;
                normativa.valorBajo = 4.5;
                normativa.valorCritico = 4.9;
                break;
              case 'Infantil':
                normativa.valorExcelente = 3.2;
                normativa.valorBueno = 3.6;
                normativa.valorPromedio = 3.9;
                normativa.valorBajo = 4.2;
                normativa.valorCritico = 4.6;
                break;
              case 'Cadete':
                normativa.valorExcelente = 3.0;
                normativa.valorBueno = 3.4;
                normativa.valorPromedio = 3.7;
                normativa.valorBajo = 4.0;
                normativa.valorCritico = 4.4;
                break;
              case 'Juvenil':
                normativa.valorExcelente = 2.8;
                normativa.valorBueno = 3.2;
                normativa.valorPromedio = 3.5;
                normativa.valorBajo = 3.8;
                normativa.valorCritico = 4.2;
                break;
            }
            break;
            
          case 'COOPER':
            // Valores en metros (mayor es mejor)
            switch (categoria) {
              case 'Benjamín':
                normativa.valorExcelente = 2200;
                normativa.valorBueno = 2000;
                normativa.valorPromedio = 1800;
                normativa.valorBajo = 1600;
                normativa.valorCritico = 1400;
                break;
              case 'Alevín':
                normativa.valorExcelente = 2500;
                normativa.valorBueno = 2300;
                normativa.valorPromedio = 2100;
                normativa.valorBajo = 1900;
                normativa.valorCritico = 1700;
                break;
              case 'Infantil':
                normativa.valorExcelente = 2800;
                normativa.valorBueno = 2600;
                normativa.valorPromedio = 2400;
                normativa.valorBajo = 2200;
                normativa.valorCritico = 2000;
                break;
              case 'Cadete':
                normativa.valorExcelente = 3100;
                normativa.valorBueno = 2900;
                normativa.valorPromedio = 2700;
                normativa.valorBajo = 2500;
                normativa.valorCritico = 2300;
                break;
              case 'Juvenil':
                normativa.valorExcelente = 3400;
                normativa.valorBueno = 3200;
                normativa.valorPromedio = 3000;
                normativa.valorBajo = 2800;
                normativa.valorCritico = 2600;
                break;
            }
            break;
            
          case 'SALTO_VERTICAL':
            // Valores en centímetros (mayor es mejor)
            switch (categoria) {
              case 'Benjamín':
                normativa.valorExcelente = 35;
                normativa.valorBueno = 30;
                normativa.valorPromedio = 25;
                normativa.valorBajo = 20;
                normativa.valorCritico = 15;
                break;
              case 'Alevín':
                normativa.valorExcelente = 40;
                normativa.valorBueno = 35;
                normativa.valorPromedio = 30;
                normativa.valorBajo = 25;
                normativa.valorCritico = 20;
                break;
              case 'Infantil':
                normativa.valorExcelente = 45;
                normativa.valorBueno = 40;
                normativa.valorPromedio = 35;
                normativa.valorBajo = 30;
                normativa.valorCritico = 25;
                break;
              case 'Cadete':
                normativa.valorExcelente = 50;
                normativa.valorBueno = 45;
                normativa.valorPromedio = 40;
                normativa.valorBajo = 35;
                normativa.valorCritico = 30;
                break;
              case 'Juvenil':
                normativa.valorExcelente = 55;
                normativa.valorBueno = 50;
                normativa.valorPromedio = 45;
                normativa.valorBajo = 40;
                normativa.valorCritico = 35;
                break;
            }
            break;
            
          case 'AGILIDAD_ILLINOIS':
            normativa.menorEsMejor = true;
            // Valores en segundos (menor es mejor)
            switch (categoria) {
              case 'Benjamín':
                normativa.valorExcelente = 18.0;
                normativa.valorBueno = 19.5;
                normativa.valorPromedio = 21.0;
                normativa.valorBajo = 22.5;
                normativa.valorCritico = 24.0;
                break;
              case 'Alevín':
                normativa.valorExcelente = 17.0;
                normativa.valorBueno = 18.5;
                normativa.valorPromedio = 20.0;
                normativa.valorBajo = 21.5;
                normativa.valorCritico = 23.0;
                break;
              case 'Infantil':
                normativa.valorExcelente = 16.0;
                normativa.valorBueno = 17.5;
                normativa.valorPromedio = 19.0;
                normativa.valorBajo = 20.5;
                normativa.valorCritico = 22.0;
                break;
              case 'Cadete':
                normativa.valorExcelente = 15.0;
                normativa.valorBueno = 16.5;
                normativa.valorPromedio = 18.0;
                normativa.valorBajo = 19.5;
                normativa.valorCritico = 21.0;
                break;
              case 'Juvenil':
                normativa.valorExcelente = 14.0;
                normativa.valorBueno = 15.5;
                normativa.valorPromedio = 17.0;
                normativa.valorBajo = 18.5;
                normativa.valorCritico = 20.0;
                break;
            }
            break;
            
          default:
            // Para las demás pruebas, usar valores genéricos
            normativa.valorExcelente = 100;
            normativa.valorBueno = 80;
            normativa.valorPromedio = 60;
            normativa.valorBajo = 40;
            normativa.valorCritico = 20;
        }
        
        await prisma.normativaReferencia.create({ data: normativa });
      }
    }
    
    console.log('✅ Normativas creadas para todas las categorías');
    
    // Mostrar resumen
    const totalPruebas = await prisma.pruebaFisica.count();
    const totalNormativas = await prisma.normativaReferencia.count();
    
    console.log('\n📊 RESUMEN:');
    console.log(`- ${totalPruebas} pruebas físicas creadas`);
    console.log(`- ${totalNormativas} normativas de referencia creadas`);
    console.log('✅ Catálogo de pruebas completado!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
crearCatalogoPruebas();