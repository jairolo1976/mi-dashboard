const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Datos para generar jugadores españoles y algunos internacionales
const nombres = {
  masculinos: ['Carlos', 'Miguel', 'Juan', 'Pedro', 'Diego', 'Sergio', 'Pablo', 'Alejandro', 'Marco'],
  femeninos: ['María', 'Carmen', 'Ana', 'Laura', 'Elena', 'Cristina', 'Patricia', 'Natalia', 'Lucía', 'Andrea']
};

const apellidos = ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Romero', 'Fernández', 'Torres'];

const colegios = [
  'IES San Isidro', 
  'Colegio Santa María', 
  'IES Ramón y Cajal',
  'Colegio Internacional Madrid',
  'IES Villa de Majadahonda'
];

const gruposSanguineos = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

async function crearNuevosJugadores() {
  try {
    console.log('🔄 Creando 19 jugadores nuevos...\n');
    
    const jugadoresNuevos = [];
    
    // Distribución por categorías (19 jugadores)
    // 5 Benjamín, 7 Alevín, 3 Infantil, 2 Cadete, 2 Juvenil
    const categorias = [
      ...Array(5).fill('Benjamín'),
      ...Array(7).fill('Alevín'),
      ...Array(3).fill('Infantil'),
      ...Array(2).fill('Cadete'),
      ...Array(2).fill('Juvenil')
    ];
    
    // Distribución de posiciones (para mantener balance)
    // 2 porteros, 6 defensas, 8 medios, 3 delanteros
    const posiciones = [
      ...Array(2).fill('Portero'),
      ...Array(6).fill('Defensa'),
      ...Array(8).fill('Medio'),
      ...Array(3).fill('Delantero')
    ];
    
    // Mezclar arrays
    categorias.sort(() => Math.random() - 0.5);
    posiciones.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < 19; i++) {
      const esFemenino = Math.random() > 0.6; // 40% chicas
      const nombreArray = esFemenino ? nombres.femeninos : nombres.masculinos;
      const nombre = nombreArray[Math.floor(Math.random() * nombreArray.length)];
      const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
      
      // Edad según categoría
      const categoria = categorias[i];
      let edad;
      switch(categoria) {
        case 'Benjamín': edad = 8 + Math.floor(Math.random() * 2); break;
        case 'Alevín': edad = 10 + Math.floor(Math.random() * 2); break;
        case 'Infantil': edad = 12 + Math.floor(Math.random() * 2); break;
        case 'Cadete': edad = 14 + Math.floor(Math.random() * 2); break;
        case 'Juvenil': edad = 16 + Math.floor(Math.random() * 2); break;
        default: edad = 12;
      }
      
      // Calcular fecha de nacimiento
      const fechaNacimiento = new Date();
      fechaNacimiento.setFullYear(fechaNacimiento.getFullYear() - edad);
      fechaNacimiento.setMonth(Math.floor(Math.random() * 12));
      fechaNacimiento.setDate(Math.floor(Math.random() * 28) + 1);
      
      const jugador = {
        nombre: nombre,
        apellido: apellido,
        edad: edad,
        fechaNacimiento: fechaNacimiento,
        categoria: categoria,
        telefono: `+34 6${Math.floor(Math.random() * 90000000 + 10000000)}`,
        email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@gmail.com`,
        direccion: `Calle ${apellidos[Math.floor(Math.random() * apellidos.length)]}, ${Math.floor(Math.random() * 100) + 1}`,
        colegio: colegios[Math.floor(Math.random() * colegios.length)],
        tallaCamiseta: ['XS', 'S', 'M', 'L'][Math.floor(Math.random() * 4)],
        tallaPantalon: ['XS', 'S', 'M', 'L'][Math.floor(Math.random() * 4)],
        
        // Información médica
        grupoSanguineo: gruposSanguineos[Math.floor(Math.random() * gruposSanguineos.length)],
        alergias: Math.random() > 0.8 ? ['Polen', 'Frutos secos', 'Lactosa', 'Ninguna'][Math.floor(Math.random() * 4)] : 'Ninguna',
        enfermedades: Math.random() > 0.9 ? 'Asma leve' : 'Ninguna',
        medicamentos: Math.random() > 0.9 ? 'Ventolin (si necesario)' : 'Ninguno',
        seguroMedico: ['Sanitas', 'Adeslas', 'DKV', 'Mapfre', 'Seguridad Social'][Math.floor(Math.random() * 5)],
        numeroSeguro: `SEG${Math.floor(Math.random() * 900000 + 100000)}`,
        
        // Tutor principal
        nombreTutor: nombres.masculinos[Math.floor(Math.random() * nombres.masculinos.length)],
        apellidoTutor: apellido,
        telefonoTutor: `+34 6${Math.floor(Math.random() * 90000000 + 10000000)}`,
        emailTutor: `${apellido.toLowerCase()}.familia@gmail.com`,
        relacionTutor: Math.random() > 0.5 ? 'Padre' : 'Madre',
        
        // Segundo tutor (80% tienen segundo tutor)
        nombreTutor2: Math.random() > 0.2 ? nombres.femeninos[Math.floor(Math.random() * nombres.femeninos.length)] : null,
        apellidoTutor2: Math.random() > 0.2 ? apellidos[Math.floor(Math.random() * apellidos.length)] : null,
        telefonoTutor2: Math.random() > 0.2 ? `+34 6${Math.floor(Math.random() * 90000000 + 10000000)}` : null,
        emailTutor2: Math.random() > 0.2 ? `contacto${i}@gmail.com` : null,
        relacionTutor2: Math.random() > 0.2 ? 'Madre' : null,
        
        // Otros
        observaciones: Math.random() > 0.7 ? 'Muy buen compañero de equipo' : null,
        activo: true,
        foto: null,
        
        // Campos nuevos
        numeroCamiseta: 22 + i, // Del 22 al 40
        posicion: posiciones[i]
      };
      
      jugadoresNuevos.push(jugador);
    }
    
    // Crear todos los jugadores
    let creados = 0;
    for (const jugador of jugadoresNuevos) {
      const created = await prisma.alumno.create({
        data: jugador
      });
      creados++;
      console.log(`✅ ${created.nombre} ${created.apellido} - #${created.numeroCamiseta} - ${created.posicion} - ${created.categoria}`);
    }
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE NUEVOS JUGADORES:');
    console.log(`Total creados: ${creados}`);
    
    // Contar por categoría
    const porCategoria = await prisma.alumno.groupBy({
      by: ['categoria'],
      _count: true,
      orderBy: {
        categoria: 'asc'
      }
    });
    
    console.log('\n📊 DISTRIBUCIÓN POR CATEGORÍA (TOTAL):');
    porCategoria.forEach(c => {
      console.log(`${c.categoria}: ${c._count} jugadores`);
    });
    
    // Contar por posición
    const porPosicion = await prisma.alumno.groupBy({
      by: ['posicion'],
      _count: true,
      orderBy: {
        posicion: 'asc'
      }
    });
    
    console.log('\n📊 DISTRIBUCIÓN POR POSICIÓN (TOTAL):');
    porPosicion.forEach(p => {
      console.log(`${p.posicion}: ${p._count} jugadores`);
    });
    
    console.log('\n✅ ¡Ahora tienes 50 jugadores en total!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
crearNuevosJugadores();
